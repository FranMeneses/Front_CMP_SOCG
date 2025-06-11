import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { GET_BENEFICIARIES } from "@/app/api/beneficiaries";
import { GET_PRIORITIES, GET_SUBTASK_STATUSES, CREATE_SUBTASK, UPDATE_SUBTASK, GET_SUBTASK, DELETE_SUBTASK } from "@/app/api/subtasks";
import { IPriority, ISubtask, ISubtasksStatus } from "@/app/models/ISubtasks";
import { SubtasksInitialValues, Beneficiary, ExtendedSubtaskValues } from "@/app/models/ISubtaskForm";
import { IBeneficiary } from "@/app/models/IBeneficiary";

export const useValleySubtasksForm = (onSave: (subtask: ExtendedSubtaskValues) => void, subtask?: ISubtask) => {
    const [subtasksInitialValues, setSubtasksInitialValues] = useState<SubtasksInitialValues | undefined>(undefined);
    const {data: beneficiariesData} = useQuery(GET_BENEFICIARIES);

    const [beneficiariesMap, setBeneficiariesMap] = useState<Record<string, string>>({});
    const [beneficiariesIdToNameMap, setBeneficiariesIdToNameMap] = useState<Record<string, string>>({});

    const [createSubtask] = useMutation(CREATE_SUBTASK);
    const [updateSubtask] = useMutation(UPDATE_SUBTASK);
    const [getSubtask] = useLazyQuery(GET_SUBTASK);
    const [deleteSubtask] = useMutation(DELETE_SUBTASK);

    const {data: subtaskPriorityData} = useQuery(GET_PRIORITIES);
    const {data: subtaskStateData} = useQuery(GET_SUBTASK_STATUSES);

    const priority = subtaskPriorityData?.priorities || [];
    const state = subtaskStateData?.subtaskStatuses || [];

    const subtaskPriority = priority.map((p: IPriority) => p.name);
    const subtaskState = state.map((s: ISubtasksStatus) => s.name);

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
                    number: subtaskData.subtask.number || "",
                    name: subtaskData.subtask.name || "",
                    description: subtaskData.subtask.description || "",
                    budget: subtaskData.subtask.budget || 0,
                    startDate: subtaskData.subtask.startDate || new Date().toISOString(),
                    endDate: subtaskData.subtask.endDate || new Date().toISOString(),
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
            const { data } = await deleteSubtask({
                variables: { id: subtaskId },
            });
            if (!data?.deleteSubtask?.id) {
                throw new Error("Subtask deletion failed: ID is undefined.");
            }
            return data.deleteSubtask.id;
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
    const handleCreateSubtask = async (subtask: ISubtask, selectedTaskId: string) => {
        try {
            const { data } = await createSubtask({
                variables: {
                    input: {
                        taskId: selectedTaskId,
                        number: subtask.number,
                        name: subtask.name,
                        description: subtask.description,
                        budget: subtask.budget,
                        startDate: subtask.startDate,
                        endDate: subtask.endDate,
                        beneficiaryId: subtask.beneficiaryId ? subtask.beneficiaryId : null,
                        statusId: 1,
                        priorityId: subtask.priority,
                    },
                },
            });
            if (!data?.createSubtask?.id) {
                throw new Error("Subtask creation failed: ID is undefined.");
            }
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
     * @param selectedTaskId ID de la tarea a la que se asociará la subtarea
     * @param selectedSubtask Objeto que representa la subtarea seleccionada para actualizar
     * @returns 
     */
    const handleUpdateSubtask = async (subtask: ISubtask, selectedTaskId: string, selectedSubtask: ISubtask | null) => {
        try {
            const { data } = await updateSubtask({
                variables: {
                    id: selectedSubtask?.id,
                    input: {
                        taskId: selectedTaskId,
                        number: subtask.number,
                        name: subtask.name,
                        description: subtask.description,
                        budget: subtask.budget,
                        expense: subtask.expense,
                        beneficiaryId: subtask.beneficiaryId ? subtask.beneficiaryId : null,
                        startDate: subtask.startDate,
                        endDate: subtask.endDate,
                        statusId: subtask.status,
                        priorityId: subtask.priority,
                        finalDate: subtask.finishDate,
                    },
                },
            });
            if (!data?.updateSubtask?.id) {
                throw new Error("Subtask update failed: ID is undefined.");
            }
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
        finishDate: subtasksInitialValues?.finishDate || "",
        beneficiary: subtasksInitialValues?.beneficiary || "",
        state: subtasksInitialValues?.state || "",
        priority: subtasksInitialValues?.priority || "",
    });

    /**
     * Hook para inicializar los valores del formulario de subtareas
     * @description Utiliza useEffect para establecer los valores iniciales del formulario de subtareas basados en los datos de beneficiarios
     */
    useEffect(() => {
        if (beneficiariesData?.beneficiaries) {
            const nameToIdMap: Record<string, string> = {};
            const idToNameMap: Record<string, string> = {};
            
            beneficiariesData.beneficiaries.forEach((beneficiary: Beneficiary) => {
                nameToIdMap[beneficiary.legalName] = beneficiary.id;
                idToNameMap[beneficiary.id] = beneficiary.legalName;
            });
            
            setBeneficiariesMap(nameToIdMap);
            setBeneficiariesIdToNameMap(idToNameMap);
        }
    }, [beneficiariesData]);

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

                let beneficiaryName = "";
                if (subtask.beneficiaryId) {
                    beneficiaryName = beneficiariesIdToNameMap[subtask.beneficiaryId] || "";
                }

                setSubtasksInitialValues({
                    name: subtask.name || "",
                    description: subtask.description || "",
                    budget: subtask.budget !== undefined && subtask.budget !== null ? String(subtask.budget) : "",
                    expense: subtask.expense !== undefined && subtask.expense !== null ? String(subtask.expense) : "",
                    startDate: formatDateForInput(subtask.startDate) || "",
                    endDate: formatDateForInput(subtask.endDate) || "",
                    finishDate: formatDateForInput(subtask.finishDate) || "", 
                    beneficiary: beneficiaryName, 
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
    }, [subtask, beneficiariesIdToNameMap, priority, state]);

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
                finishDate: subtasksInitialValues.finishDate || "",
                beneficiary: subtasksInitialValues.beneficiary || "",
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
    const handleSubtaskInputChange = useCallback((field: string, value: string) => {
        setSubtaskFormState((prev) => ({ ...prev, [field]: value }));
    }, []);

    /**
     * Función para guardar los cambios en la subtarea
     * @description Maneja el guardado de los cambios en la subtarea, incluyendo la creación o actualización según corresponda
     */
    const handleSaveSubtask = useCallback(() => {
        const beneficiaryId = beneficiariesMap[subtaskFormState.beneficiary] || "";
        
        const subtaskDetails = {
            ...subtaskFormState,
            budget: parseInt(subtaskFormState.budget) || 0,
            expense: parseInt(subtaskFormState.expense) || 0,
            priority: Number(subtaskFormState.priority) ? Number(subtaskFormState.priority) : subtaskPriority.findIndex((p: string | number) => p === subtaskFormState.priority) + 1,
            status: Number(subtaskFormState.state) ? Number(subtaskFormState.state) : subtaskState.findIndex((s: string | number) => s === subtaskFormState.state) + 1,
            beneficiaryId: beneficiaryId,
        };
        
        onSave(subtaskDetails);
        setSubtaskFormState({
            name: "",
            description: "",
            budget: "",
            expense: "",
            startDate: "",
            endDate: "",
            finishDate: "",
            beneficiary: "",
            state: "",
            priority: "",
        });
    }, [subtaskFormState, onSave, beneficiariesMap]);

    const dropdownItems = useMemo(() => {
        const beneficiaryNames = beneficiariesData?.beneficiaries
            ? beneficiariesData.beneficiaries.map((beneficiary: IBeneficiary) => beneficiary.legalName)
            : [];

        return {
            subtaskState: subtaskState,
            subtaskPriority: subtaskPriority,
            beneficiaries: beneficiaryNames,
        };
    }, [beneficiariesData]);

    return {
        subtaskFormState,
        dropdownItems,
        handleSubtaskInputChange,
        handleSaveSubtask,
        handleGetSubtask,
        handleCreateSubtask,
        handleUpdateSubtask,
        handleDeleteSubtask,
    };
};