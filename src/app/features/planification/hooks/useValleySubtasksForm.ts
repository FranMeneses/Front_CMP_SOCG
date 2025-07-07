import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { GET_PRIORITIES, GET_SUBTASK_STATUSES, CREATE_SUBTASK, UPDATE_SUBTASK, GET_SUBTASK, DELETE_SUBTASK, GET_SUBTASKS } from "@/app/api/subtasks";
import { IPriority, ISubtask, ISubtasksStatus } from "@/app/models/ISubtasks";
import { SubtasksInitialValues, ExtendedSubtaskValues } from "@/app/models/ISubtaskForm";
import { useQueryClient } from '@tanstack/react-query';

export const useValleySubtasksForm = (
    onSave: (subtask: ExtendedSubtaskValues) => void, 
    subtask?: ISubtask, 
    onSuccess?: () => void,
    updateTaskDetailsAfterChange?: (taskId: string) => Promise<boolean> 
) => {
    const [subtasksInitialValues, setSubtasksInitialValues] = useState<SubtasksInitialValues | undefined>(undefined);
    const [dateError, setDateError] = useState<string>("");

    const [createSubtask] = useMutation(CREATE_SUBTASK, {
        update(cache, { data: { createSubtask } }) {
            try {
                type SubtasksData = { subtasks: ISubtask[] };
                
                const existingData = cache.readQuery<SubtasksData>({
                    query: GET_SUBTASKS
                });
                
                if (existingData && 'subtasks' in existingData) {
                    cache.writeQuery<SubtasksData>({
                        query: GET_SUBTASKS,
                        data: {
                            subtasks: [...existingData.subtasks, createSubtask]
                        }
                    });
                }
            } catch (error) {
                console.error("Error updating cache after creating subtask:", error);
            }
        }
    });
    
    const [updateSubtask] = useMutation(UPDATE_SUBTASK, {
        update(cache, { data: { updateSubtask } }) {
            try {
                type SubtasksData = { subtasks: ISubtask[] };
                
                const existingData = cache.readQuery<SubtasksData>({
                    query: GET_SUBTASKS
                });
                
                if (existingData && 'subtasks' in existingData) {
                    const updatedSubtasks = existingData.subtasks.map(
                        (subtask: ISubtask) => subtask.id === updateSubtask.id ? updateSubtask : subtask
                    );
                    
                    cache.writeQuery<SubtasksData>({
                        query: GET_SUBTASKS,
                        data: {
                            subtasks: updatedSubtasks
                        }
                    });
                }
            } catch (error) {
                console.error("Error updating cache after updating subtask:", error);
            }
        }
    });
    
    const [getSubtask] = useLazyQuery(GET_SUBTASK, {fetchPolicy: 'network-only'});
    
    const [deleteSubtask] = useMutation(DELETE_SUBTASK, {
        update(cache, { data: { removeSubtask } }) {
            try {
                type SubtasksData = { subtasks: ISubtask[] };
                
                const existingData = cache.readQuery<SubtasksData>({
                    query: GET_SUBTASKS
                });
                
                if (existingData && 'subtasks' in existingData) {
                    const updatedSubtasks = existingData.subtasks.filter(
                        (subtask: ISubtask) => subtask.id !== removeSubtask.id
                    );
                    
                    cache.writeQuery<SubtasksData>({
                        query: GET_SUBTASKS,
                        data: {
                            subtasks: updatedSubtasks
                        }
                    });
                }
            } catch (error) {
                console.error("Error updating cache after deleting subtask:", error);
            }
        }
    });

    const {data: subtaskPriorityData} = useQuery(GET_PRIORITIES);
    const {data: subtaskStateData} = useQuery(GET_SUBTASK_STATUSES);

    const priority = subtaskPriorityData?.priorities || [];
    const state = subtaskStateData?.subtaskStatuses || [];

    const subtaskPriority = priority.map((p: IPriority) => p.name);
    const subtaskState = state.map((s: ISubtasksStatus) => s.name);

    const queryClient = useQueryClient();

    /**
     * Valida que la fecha de inicio no sea posterior a la fecha de término
     * @param startDate - Fecha de inicio
     * @param endDate - Fecha de término
     * @returns true si las fechas son válidas
     */
    const validateDates = (startDate: string, endDate: string): boolean => {
        if (!startDate || !endDate) return true; 
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (start > end) {
            setDateError("La fecha de inicio no puede ser posterior a la fecha de término");
            return false;
        }
        
        setDateError("");
        return true;
    };

    /**
     * Función para obtener una subtarea por su ID
     * @description Maneja la obtención de una subtarea específica utilizando su ID
     * @param subtaskId ID de la subtarea a obtener
     * @returns 
     */
    const handleGetSubtask = async (subtaskId: string) => {
        try {
            const { data: subtaskData } = await getSubtask({
                variables: { id: subtaskId },
            });
            if (subtaskData && subtaskData.subtask) {
                const subtaskWithDefaults = {
                    ...subtaskData.subtask,
                    priorityId: subtaskData.subtask.priorityId || "",  
                    name: subtaskData.subtask.name || "",
                    description: subtaskData.subtask.description || "",
                    budget: subtaskData.subtask.budget || 0,
                    startDate: subtaskData.subtask.startDate,
                    endDate: subtaskData.subtask.endDate,
                    finalDate: subtaskData.subtask.finalDate,
                };
                return subtaskWithDefaults;
            } else {
                console.warn("No data found for the given subtask ID:", subtaskId);
                return null;
            }
        } catch (error) {
            console.error("Error fetching subtask:", error);
            return null;
        }
    };

    /**
     * Función para eliminar una subtarea por su ID
     * @description Maneja la eliminación de una subtarea específica utilizando su ID
     * @param subtaskId ID de la subtarea a eliminar
     * @returns 
     */
    const handleDeleteSubtask = async (subtaskId: string) => {
        try {
            const subtaskInfo = await handleGetSubtask(subtaskId);
            const taskId = subtaskInfo?.taskId;
            
            const { data } = await deleteSubtask({
                variables: { id: subtaskId },
            });
            if (!data?.removeSubtask?.id) {
                throw new Error("Subtask deletion failed: ID is undefined.");
            }
            
            if (updateTaskDetailsAfterChange && taskId) {
                await updateTaskDetailsAfterChange(taskId);
            }
            
            if (onSuccess) {
                onSuccess();
            }
            await queryClient.invalidateQueries({ queryKey: ['relationship-tasks'] });
            return data.removeSubtask.id;
        } catch (error) {
            console.error("Error deleting subtask:", error);
            throw error;
        }
    }

    /**
     * Función para crear una nueva subtarea
     * @description Maneja la creación de una nueva subtarea
     * @param subtask Objeto que contiene los detalles de la subtarea a crear
     * @param selectedTaskId ID de la tarea a la que se asociará la subtarea
     * @returns 
     */
    const handleCreateSubtask = async (subtask: ISubtask) => {
        try {
            const { data } = await createSubtask({
                variables: {
                    input: {
                        taskId: subtask.taskId,
                        name: subtask.name,
                        description: subtask.description,
                        budget: subtask.budget,
                        startDate: subtask.startDate,
                        endDate: subtask.endDate,
                        statusId: 1,
                        priorityId: subtask.priorityId,
                    },
                },
            });
            if (!data?.createSubtask?.id) {
                throw new Error("Subtask creation failed: ID is undefined.");
            }
            
            if (updateTaskDetailsAfterChange && subtask.taskId) {
                await updateTaskDetailsAfterChange(subtask.taskId);
            }
            
            if (onSuccess) {
                onSuccess();
            }
            await queryClient.invalidateQueries({ queryKey: ['relationship-tasks'] });
            return data.createSubtask.id;
        }
        catch (error) {
            console.error("Error creating subtask:", error);
            throw error;
        }
    };

    /**
     * Función para actualizar una subtarea existente
     * @description Maneja la actualización de una subtarea específica utilizando su ID
     * @param subtask Objeto que contiene los detalles actualizados de la subtarea
     * @returns 
     */
    const handleUpdateSubtask = async (subtask: ISubtask) => {
        try {
            const { data } = await updateSubtask({
                variables: {
                    id: subtask.id,
                    input: {
                        taskId: subtask.taskId,
                        name: subtask.name,
                        description: subtask.description,
                        budget: subtask.budget,
                        expense: subtask.expense,
                        startDate: subtask.startDate,
                        endDate: subtask.endDate,
                        statusId: subtask.statusId ?? subtask.status,
                        priorityId: subtask.priorityId,
                        finalDate: subtask.finalDate === "" ? undefined : subtask.finalDate,
                    },
                },
            });
            if (!data?.updateSubtask?.id) {
                throw new Error("Subtask update failed: ID is undefined.");
            }
            
            if (updateTaskDetailsAfterChange && subtask.taskId) {
                await updateTaskDetailsAfterChange(subtask.taskId);
            }
            
            if (onSuccess) {
                onSuccess();
            }
            await queryClient.invalidateQueries({ queryKey: ['relationship-tasks'] });
            return data.updateSubtask.id;
        }
        catch (error) {
            console.error("Error updating subtask:", error);
            throw error;
        }
    };

    /**
     * Estado para manejar el formulario de subtareas
     * @description Maneja el estado del formulario de subtareas, incluyendo los valores iniciales y cambios en los campos
     */
    const [subtaskFormState, setSubtaskFormState] = useState({
        name: subtasksInitialValues?.name || "",
        description: subtasksInitialValues?.description || "",
        budget: subtasksInitialValues?.budget || "",
        expense: subtasksInitialValues?.expense || "",
        startDate: subtasksInitialValues?.startDate || "",
        endDate: subtasksInitialValues?.endDate || "",
        finalDate: subtasksInitialValues?.finalDate || "",
        state: subtasksInitialValues?.state || "",
        priority: subtasksInitialValues?.priority || "",
    });

    /**
     * Función para obtener los valores iniciales del formulario de subtareas
     * @description Maneja la obtención de los valores iniciales del formulario de subtareas basados en los datos de la subtarea y los beneficiarios
     * @returns
     */
    const fetchSubtaskInitialValues = async () => {
        if (subtask) {
            try {
                const formatDateForInput = (dateString: string | null | undefined) => {
                    if (!dateString) return "";
                    const date = new Date(dateString);
                    if (isNaN(date.getTime())) return "";
                    return date.toISOString().split('T')[0]; 
                };


                setSubtasksInitialValues({
                    name: subtask.name || "",
                    description: subtask.description || "",
                    budget: subtask.budget !== undefined && subtask.budget !== null ? String(subtask.budget) : "",
                    expense: subtask.expense !== undefined && subtask.expense !== null ? String(subtask.expense) : "",
                    startDate: formatDateForInput(subtask.startDate) || "",
                    endDate: formatDateForInput(subtask.endDate) || "",
                    finalDate: formatDateForInput(subtask.finalDate) || "", 
                    state: subtask.statusId !== undefined && subtask.statusId !== null ? String(subtask.statusId) : "",
                    priority: subtask.priorityId !== undefined && subtask.priorityId !== null ? String(subtask.priorityId) : "",
                });
            }
            catch (error) {
                console.error("Error fetching subtask initial values:", error);
            }
        }
    };

    /**
     * Hook para establecer los valores iniciales del formulario de subtareas
     * @description Utiliza useEffect para establecer los valores iniciales del formulario de subtareas cuando se cargan los beneficiarios
     */
    useEffect(() => {
        if (priority.length > 0 && state.length > 0 && subtask) {
            fetchSubtaskInitialValues();
        }
    }, [subtask, priority, state]);

    /**
     * Hook para manejar los cambios en los campos del formulario de subtareas
     * @description Utiliza useCallback para manejar los cambios en los campos del formulario de subtareas
     */
    useEffect(() => {
        if (subtasksInitialValues) {
            setSubtaskFormState({
                name: subtasksInitialValues.name || "",
                description: subtasksInitialValues.description || "",
                budget: subtasksInitialValues.budget || "",
                expense: subtasksInitialValues.expense || "",
                startDate: subtasksInitialValues.startDate || "",
                endDate: subtasksInitialValues.endDate || "",
                finalDate: subtasksInitialValues.finalDate || "",
                state: subtasksInitialValues.state || "",
                priority: subtasksInitialValues.priority || "",
            });
        }
    }, [subtasksInitialValues]);

    /**
     * Función para manejar los cambios en los campos del formulario de subtareas
     * @description Maneja los cambios en los campos del formulario de subtareas y actualiza el estado correspondiente
     * @param field Campo del formulario que se está actualizando
     * @param value Nuevo valor para el campo del formulario
     */
    const handleSubtaskInputChange = (field: string, value: string) => {
        setSubtaskFormState(prev => ({
            ...prev,
            [field]: value
        }));

        if (field === "startDate") {
            validateDates(value, subtaskFormState.endDate);
        } else if (field === "endDate") {
            validateDates(subtaskFormState.startDate, value);
        }
    };

    /**
     * Función para guardar los cambios en la subtarea
     * @description Maneja el guardado de los cambios en la subtarea, incluyendo la creación o actualización según corresponda
     */
    const handleSaveSubtask = useCallback(() => {
        // Detectar si el estado seleccionado es 'Completada'
        const completedStateName = "Completada";
        const completedStateIndex = subtaskState.findIndex((s: string) => s === completedStateName);
        const isCompleted = (subtaskFormState.state === completedStateName) ||
            (Number(subtaskFormState.state) === completedStateIndex + 1);
        let finalDate = subtaskFormState.finalDate;
        if (isCompleted && !finalDate) {
            // Si no hay fecha de finalización, usar la fecha de hoy
            const today = new Date();
            finalDate = today.toISOString().split('T')[0];
        }
        const subtaskDetails = {
            ...subtaskFormState,
            budget: parseInt(subtaskFormState.budget) || 0,
            expense: parseInt(subtaskFormState.expense) || 0,
            priority: Number(subtaskFormState.priority) ? Number(subtaskFormState.priority) : subtaskPriority.findIndex((p: string | number) => p === subtaskFormState.priority) + 1,
            status: Number(subtaskFormState.state) ? Number(subtaskFormState.state) : subtaskState.findIndex((s: string | number) => s === subtaskFormState.state) + 1,
            finalDate: finalDate
        };
        onSave(subtaskDetails);
        setSubtaskFormState({
            name: "",
            description: "",
            budget: "",
            expense: "",
            startDate: "",
            endDate: "",
            finalDate: "",
            state: "",
            priority: "",
        });
    }, [subtaskFormState, onSave]);

    const dropdownItems = useMemo(() => {
        return {
            subtaskState: subtaskState,
            subtaskPriority: subtaskPriority,

        };
    }, []);

    const isFormValid = subtaskFormState.name && 
                       subtaskFormState.budget && 
                       subtaskFormState.endDate && 
                       subtaskFormState.startDate &&
                       !dateError; 

    return {
        subtaskFormState,
        dropdownItems,
        dateError,
        isFormValid,
        handleSubtaskInputChange,
        handleSaveSubtask,
        handleGetSubtask,
        handleCreateSubtask,
        handleUpdateSubtask,
        handleDeleteSubtask,
    };
};