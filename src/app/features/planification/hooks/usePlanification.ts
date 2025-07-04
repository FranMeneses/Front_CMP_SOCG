import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_TASK, UPDATE_TASK } from "@/app/api/tasks";
import { CREATE_INFO_TASK } from "@/app/api/infoTask";
import { ISubtask } from "@/app/models/ISubtasks";
import { useHooks } from "../../hooks/useHooks";
import { IInfoTask, ITask, ITaskDetails } from "@/app/models/ITasks";
import { useValleyTaskForm } from "./useValleyTaskForm";
import { useValleySubtasksForm } from "./useValleySubtasksForm";
import { useTasksData } from "./useTaskData";
import { useCommunicationTaskForm } from "./useCommunicationTaskForm";
import { Task } from "@/app/models/ITaskForm";

import { CREATE_COMPLIANCE } from "@/app/api/compliance";

export const usePlanification = () => {
    const { currentValley, isValleyManager, isCommunicationsManager, userRole } = useHooks();
    
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [isPopupSubtaskOpen, setIsPopupSubtaskOpen] = useState<boolean>(false);
    const [isPopupPlanificationOpen, setIsPopupPlanificationOpen] = useState<boolean>(false);
    const [isCommunicationModalOpen, setIsCommunicationModalOpen] = useState<boolean>(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<ITask | undefined>(undefined);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [selectedInfoTask, setSelectedInfoTask] = useState<IInfoTask | null>(null);
    const [selectedSubtask, setSelectedSubtask] = useState<ISubtask | null>(null);
    const [expandedRow, setExpandedRow] = useState<string>('');
    
    const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
    const [isDeleteSubtaskModalOpen, setIsDeleteSubtaskModalOpen] = useState(false);
    const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);

    const [localSubtasks, setLocalSubtasks] = useState<ISubtask[]>([]);
    const [isLocalEdit, setIsLocalEdit] = useState(false);
    
    // Estado para el proceso filtrado
    const [selectedProcess, setSelectedProcess] = useState<{id: number, name: string} | null>(null);
    const selectedProcessId = selectedProcess?.id;
    const {
        data,
        loading,
        error,
        subTasks,
        detailedTasks,
        taskState,
        activeFilter,
        refetch,
        updateTaskDetailsAfterSubtaskChange, 
        getRemainingDays,
        getRemainingSubtaskDays,
        formatDate,
        handleFilterClick,
        handleFilterByProcess,
        setDetailedTasks,
    } = useTasksData(currentValley?.id ?? undefined, userRole, isLocalEdit, selectedProcessId);

    const valleyTaskForm = useValleyTaskForm(() => {}, currentValley?.id.toString() || "");
    const valleySubtaskForm = useValleySubtasksForm(() => {}, undefined, undefined, updateTaskDetailsAfterSubtaskChange);
    const communicationTaskForm = useCommunicationTaskForm(() => {});
    
    const [createTask] = useMutation(CREATE_TASK);
    const [updateTask] = useMutation(UPDATE_TASK);
    const [createInfoTask] = useMutation(CREATE_INFO_TASK);
    const [createCompliance] = useMutation(CREATE_COMPLIANCE);

    const [filteredTasksLocal, setFilteredTasksLocal] = useState<ITaskDetails[]>([]);

    useEffect(() => {
        if (!selectedProcessId) {
            refetch();
        }
    }, [selectedProcessId]);

    useEffect(() => {
        if (!isLocalEdit) {
            if (subTasks && subTasks.length > 0) {
                setLocalSubtasks(subTasks);
            } else {
                setLocalSubtasks([]);
            }
        }
    }, [subTasks, isLocalEdit]);

    useEffect(() => {
        if (!activeFilter && !selectedProcessId) {
            refetch();
            setIsLocalEdit(false);
        }
    }, [activeFilter, selectedProcessId]);

    useEffect(() => {
        setIsLocalEdit(false);
    }, [activeFilter]);

    /**
     * Función para manejar la creación de una nueva tarea
     * @description Abre el modal para crear una nueva tarea, dependiendo del rol del usuario
     */
    const handleCreateTask = () => {

        if (isValleyManager) {
            setIsPopupOpen(true);
        }
        else if (isCommunicationsManager){
            setIsCommunicationModalOpen(true);
        }
    };

    /**
     * Función para manejar la subida de un plan de planificación
     * @description Abre el modal para subir un plan de planificación
     */
    const handleUploadPlanification = () => {
        setIsPopupPlanificationOpen(true);
    }

    /**
     * Función para manejar la creación de un encargado de cumplimiento
     * @description Abre el modal de comunicación para crear una tarea de cumplimiento
     */
    const handleCreateComplianceManager = () => {
        if (userRole === "Encargado Cumplimiento" || userRole === 'Admin') {
            setIsCommunicationModalOpen(true); 
        }
    };
    /**
     * Función para guardar una nueva tarea 
     * @param task Tarea a guardar
     * @description Guarda una nueva tarea
     */
    const handleSaveCommunication = async (task: ITask) => {
        try {
            const { data } = await createTask({
                variables: {
                    input: {
                        name: task.name,
                        description: task.description,
                        valleyId: task.valleyId,
                        faenaId: task.faenaId,
                        statusId: task.statusId,
                        processId: task.processId,
                        applies: task.applies,
                    }
                }
            });
            if (task.applies) {
                await createCompliance({
                    variables: {
                        input: {
                            taskId: data.createTask.id,
                            statusId: 7,
                        },
                    },
                });
            }
            // Refresca la lista de tareas después de crear
            await refetch();
            if (selectedProcess && selectedProcess.id) {
                await handleFilterByProcess(selectedProcess.id);
            }
        }catch (error) {
            console.error("Error saving communication task:", error);
        }
        setIsCommunicationModalOpen(false);
    };
      
    /**
     * Función para actualizar una tarea de comunicación
     * @description Actualiza una tarea de comunicación existente
     * @param task Tarea a actualizar
     */
    const handleUpdateCommunication = async (task: ITask) => {
        try {
            const { data } = await updateTask({
                variables: {
                    id: selectedTaskId,
                    input: {
                        name: task.name,
                        description: task.description,
                        processId: task.processId,
                        statusId: task.statusId,
                    }
                }
            })
            if (!data?.updateTask?.id) {
                throw new Error("Task update failed: ID is undefined.");
            }
        }catch (error) {
            console.error("Error updating communication task:", error);
        }
        await refetch();
        setIsCommunicationModalOpen(false);
    };

    /**
     * Función para cancelar la creación de una tarea asociada a comunicación
     * @description Cierra el modal de comunicación sin guardar cambios
     */
    const handleCancelCommunication = () => {
        setSelectedTask(undefined);
        setIsCommunicationModalOpen(false);
    };

    /**
     * Función para manejar la adición de una nueva tarea
     * @description Abre el modal para agregar una nueva tarea
     */
    const handleAddTask = () => {
        setIsPopupOpen(true);
    };

    /**
     * Función para cancelar la creación o edición de una tarea
     * @description Cierra el modal de tarea sin guardar cambios
     */
    const handleCancel = () => {
        setSelectedInfoTask(null);
        setIsPopupOpen(false);
    };

    /**
     * Función para cancelar la edición de una sub-tarea
     * @description Cierra el modal de sub-tarea sin guardar cambios
     */
    const handleCancelSubtask = () => {
        setSelectedSubtask(null);
        setIsPopupSubtaskOpen(false);
    };
    
    /**
     * Función para eliminar una tarea
     * @description Abre el modal de confirmación para eliminar una tarea
     * @param selectedProcessId ID del proceso filtrado
     */
    const handleDeleteTask = async () => {
        try {
            await valleyTaskForm.handleDeleteTask(itemToDeleteId!);
            setIsDeleteTaskModalOpen(false);
            // Después de eliminar una tarea, refresca los datos globales
            await window.location.reload();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
        setIsDeleteTaskModalOpen(false);
    };
    
    /**
     * Función para eliminar una sub-tarea
     * @description Abre el modal de confirmación para eliminar una sub-tarea
     * @param subtaskId ID de la sub-tarea a eliminar
     */
    const handleDeleteSubtask = async () => {
        try {
            await valleySubtaskForm.handleDeleteSubtask(itemToDeleteId!);
            setLocalSubtasks(prev => prev.filter(s => s.id !== itemToDeleteId));
            setDetailedTasks((prev: ITaskDetails[]) => {
                let updated = prev.map((task: ITaskDetails) => {
                    if (task.id === selectedTaskId) {
                        const subtasks = localSubtasks.filter(s => s.id !== itemToDeleteId && s.taskId === task.id);
                        const budget = subtasks.reduce((acc, s) => acc + (s.budget || 0), 0);
                        const expense = subtasks.reduce((acc, s) => acc + (s.expense || 0), 0);
                        const startDates = subtasks.map(s => new Date(s.startDate)).filter(d => !isNaN(d.getTime()));
                        const endDates = subtasks.map(s => new Date(s.endDate)).filter(d => !isNaN(d.getTime()));
                        return {
                            ...task,
                            budget,
                            expense,
                            startDate: startDates.length ? new Date(Math.min(...startDates.map(d => d.getTime()))).toISOString() : '',
                            endDate: endDates.length ? new Date(Math.max(...endDates.map(d => d.getTime()))).toISOString() : '',
                        };
                    }
                    return task;
                });
                if (activeFilter) {
                    updated = updated.filter(task => task.status?.name === activeFilter);
                }
                if (selectedProcessId) {
                    updated = updated.filter(task => task.processId === selectedProcessId);
                }
                return updated;
            });
            setIsDeleteSubtaskModalOpen(false);
        } catch (error) {
            console.error("Error deleting subtask:", error);
        }
        setIsDeleteSubtaskModalOpen(false);
    };

    /**
     * Función para guardar una nueva tarea
     * @param task Tarea a guardar
     * @description Guarda una nueva tarea
     */
    const handleSaveTask = async (task: Task) => { 
        try {
            const { data } = await createTask({
                variables: {
                    input: {
                        name: task.name,
                        description: task.description,
                        valleyId: task.valley,
                        faenaId: task.faena,
                        statusId: 1,
                        processId: task.process,
                        applies: task.compliance,
                        beneficiaryId: task.beneficiary,
                    },
                },
            });
            if (!data?.createTask?.id) {
                throw new Error("Task creation failed: ID is undefined.");
            }

            await createInfoTask({
                variables: {
                    input: {
                        taskId: data.createTask.id,
                        originId: task.origin,
                        investmentId: task.investment,
                        typeId: task.type,
                        scopeId: task.scope,
                        interactionId: task.interaction,
                        riskId: task.risk,
                    },
                },
            });
            if (task.compliance) {
                await createCompliance({
                    variables: {
                        input: {
                            taskId: data.createTask.id,
                            statusId: 7,
                        },
                    },
                });
            }
            // Refresca la lista de tareas después de crear
            await refetch();
            if (selectedProcess && selectedProcess.id) {
                await handleFilterByProcess(selectedProcess.id);
            }
        } catch (error) {
            console.error("Error saving task:", error);
        }
        finally {
            if (isValleyManager) {
                setIsPopupOpen(false);
            } else {
                setIsCommunicationModalOpen(false);
            }
        };
    };

    /**
     * Función para manejar el clic en una tarea
     * @description Alterna la selección y expansión de una tarea al hacer clic en ella
     * @param taskId ID de la tarea a manejar
     */
    const handleOnTaskClick = (taskId: string) => {
        setSelectedTaskId((prev) => (prev === taskId ? null : taskId));
        setExpandedRow((prev) => (prev === taskId ? '' : taskId));
    };

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    /**
     * Función para ver información de una tarea
     * @description Abre un modal para ver información detallada de una tarea
     * @param taskId ID de la tarea para ver información
     * @param userRole Rol del usuario
     */
    const handleSeeInformation = async (taskId: string, userRole: string) => {
        setSelectedTaskId(taskId);
        if (isValleyManager) {
            try {
                const taskInfo = await valleyTaskForm.handleGetInfoTask(taskId);
                if (taskInfo) {
                    setSelectedInfoTask(taskInfo);
                    setIsPopupOpen(true);
                } else {
                    console.warn("No task information found for the given task ID:", taskId);
                }
            } catch (error) {
                console.error("Error handling task information:", error);
            }
        }
        else if (isCommunicationsManager || userRole === "Encargado Cumplimiento" || userRole === "Admin") {
            try {
                const taskInfo = await communicationTaskForm.handleGetTask(taskId);
                if (taskInfo) {
                    setSelectedTask(taskInfo);
                    setIsCommunicationModalOpen(true);
                }
            }
            catch (error) {
                console.error("Error fetching task information:", error);
            }
        }
    };
    
    /**
     * Función para manejar el clic en una sub-tarea
     * @description Abre un modal para ver o editar una sub-tarea
     * @param subtaskId ID de la sub-tarea a manejar
     */
    const handleGetSubtask = async (subtaskId: string) => {
        try {
            const subtask = await valleySubtaskForm.handleGetSubtask(subtaskId);
            if (subtask) {
                setSelectedSubtask(subtask);
                setIsPopupSubtaskOpen(true);
                return subtask;
            }
            return null;
        } catch (error) {
            console.error("Error in handleGetSubtask:", error);
            return null;
        }
    };

    /**
     * Función para crear una nueva sub-tarea
     * @description Abre un modal para crear una nueva sub-tarea
     * @param taskId ID de la tarea a la que se añadirá la sub-tarea
     */
    const handleCreateSubtask = async (subtask: ISubtask) => {
        try {
            setIsLocalEdit(true);
            const newSubtaskId = await valleySubtaskForm.handleCreateSubtask(subtask);
            const newSubtask: ISubtask = {
                ...subtask,
                id: newSubtaskId,
                taskId: selectedTaskId!,
                status: {
                    id: 1,
                    name: "NO iniciada",
                    percentage: 0,
                }
            };
            setLocalSubtasks(prev => {
                const updatedSubtasks = [...prev, newSubtask];
                setFilteredTasksLocal((prevTasks: ITaskDetails[]) => {
                    let updatedTasks = prevTasks.map((task) => {
                        if (task.id === newSubtask.taskId) {
                            const subtasks = updatedSubtasks.filter(s => s.taskId === task.id);
                            const budget = subtasks.reduce((acc, s) => acc + (s.budget || 0), 0);
                            const expense = subtasks.reduce((acc, s) => acc + (s.expense || 0), 0);
                            const startDates = subtasks.map(s => new Date(s.startDate)).filter(d => !isNaN(d.getTime()));
                            const endDates = subtasks.map(s => new Date(s.endDate)).filter(d => !isNaN(d.getTime()));
                            return {
                                ...task,
                                budget,
                                expense,
                                startDate: startDates.length ? new Date(Math.min(...startDates.map(d => d.getTime()))).toISOString() : '',
                                endDate: endDates.length ? new Date(Math.max(...endDates.map(d => d.getTime()))).toISOString() : '',
                            };
                        }
                        return task;
                    });
                    if (activeFilter) {
                        updatedTasks = updatedTasks.filter(task => task.status?.name === activeFilter);
                    }
                    return updatedTasks;
                });
                return updatedSubtasks;
            });
            setIsPopupSubtaskOpen(false);
        } catch (error) {
            console.error("Error in handleCreateSubtask:", error);
        }
    };

    /**
     * Función para actualizar una sub-tarea
     * @description Abre un modal para editar una sub-tarea existente
     * @param subtask Sub-tarea a actualizar
     */
    const handleUpdateSubtask = async (subtask: ISubtask) => {
        try {
            await valleySubtaskForm.handleUpdateSubtask(subtask);
            setLocalSubtasks(prev => {
                // Actualiza la subtarea en el array local
                const updatedSubtasks = prev.map(s => s.id === subtask.id ? { ...subtask } : s);
                setFilteredTasksLocal((prevTasks: ITaskDetails[]) => {
                    let updatedTasks = prevTasks.map((task) => {
                        if (task.id === subtask.taskId) {
                            const subtasks = updatedSubtasks.filter(s => s.taskId === task.id);
                            const budget = subtasks.reduce((acc, s) => acc + (s.budget || 0), 0);
                            const expense = subtasks.reduce((acc, s) => acc + (s.expense || 0), 0);
                            const startDates = subtasks.map(s => new Date(s.startDate)).filter(d => !isNaN(d.getTime()));
                            const endDates = subtasks.map(s => new Date(s.endDate)).filter(d => !isNaN(d.getTime()));
                            return {
                                ...task,
                                budget,
                                expense,
                                startDate: startDates.length ? new Date(Math.min(...startDates.map(d => d.getTime()))).toISOString() : '',
                                endDate: endDates.length ? new Date(Math.max(...endDates.map(d => d.getTime()))).toISOString() : '',
                            };
                        }
                        return task;
                    });
                    if (activeFilter) {
                        updatedTasks = updatedTasks.filter(task => task.status?.name === activeFilter);
                    }
                    return updatedTasks;
                });
                return updatedSubtasks;
            });
            setIsPopupSubtaskOpen(false);
        } catch (error) {
            console.error("Error in handleUpdateSubtask:", error);
        }
    };

    /**
     * Función para actualizar una tarea
     * @description Abre un modal para editar una tarea existente
     * @param task Tarea a actualizar
     */
    const handleUpdateTask = async (task: Task) => { 
        try {
            const updatedTaskId = await valleyTaskForm.handleUpdateTask(task, selectedTaskId!, selectedInfoTask);
            setIsPopupOpen(false);
            setSelectedTaskId(updatedTaskId);
        } catch (error) {
            console.error("Error in handleUpdateTask:", error);
        }
    };

    // Sincroniza filteredTasksLocal con detailedTasks cuando se sale del modo edición local
    useEffect(() => {
        if (!isLocalEdit) {
            setFilteredTasksLocal(detailedTasks);
        }
    }, [isLocalEdit, detailedTasks]);

    return {
        setIsPopupOpen,
        setIsPopupSubtaskOpen,
        setIsCommunicationModalOpen,
        setSelectedTaskId,
        setSelectedTask,
        setIsSidebarOpen,
        setIsDeleteSubtaskModalOpen,
        setIsDeleteTaskModalOpen,
        setIsPopupPlanificationOpen,
        setItemToDeleteId,
        handleAddTask,
        handleSaveTask,
        handleDeleteTask,
        handleDeleteSubtask,
        handleOnTaskClick,
        toggleSidebar,
        createTask,
        getRemainingDays,
        getRemainingSubtaskDays,
        handleCancel,
        formatDate,
        handleSeeInformation,
        handleGetSubtask,
        handleCreateSubtask,
        handleUpdateSubtask,
        handleUpdateTask,
        handleCancelSubtask,
        handleFilterClick,
        handleCreateTask,
        handleSaveCommunication,
        handleUpdateCommunication,
        handleCancelCommunication,
        handleFilterByProcess,
        handleUploadPlanification,
        handleCreateComplianceManager,
        localSubtasks,
        selectedTask,
        isPopupOpen,
        isPopupPlanificationOpen,
        isDeleteSubtaskModalOpen,
        isDeleteTaskModalOpen,
        isCommunicationModalOpen,
        itemToDeleteId,
        isPopupSubtaskOpen,
        selectedTaskId,
        isSidebarOpen,
        data,
        loading, 
        error,
        subTasks,
        detailedTasks,
        selectedInfoTask,
        selectedSubtask,
        expandedRow,
        taskState,
        activeFilter,
        allProcesses: useTasksData(currentValley?.id ?? undefined, userRole).allProcesses,
        selectedProcess,
        setSelectedProcess,
        isLocalEdit,
        filteredTasks: isLocalEdit ? filteredTasksLocal : detailedTasks,
    };
};