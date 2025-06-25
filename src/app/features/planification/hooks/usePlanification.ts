import { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CREATE_TASK, UPDATE_TASK } from "@/app/api/tasks";
import { CREATE_INFO_TASK } from "@/app/api/infoTask";
import { ISubtask } from "@/app/models/ISubtasks";
import { useHooks } from "../../hooks/useHooks";
import { IInfoTask, ITask } from "@/app/models/ITasks";
import { useValleyTaskForm } from "./useValleyTaskForm";
import { useValleySubtasksForm } from "./useValleySubtasksForm";
import { useTasksData } from "./useTaskData";
import { useCommunicationTaskForm } from "./useCommunicationTaskForm";
import { Task } from "@/app/models/ITaskForm";

import { CREATE_COMPLIANCE, CREATE_REGISTRY, GET_TASK_COMPLIANCE, UPDATE_COMPLIANCE, UPDATE_REGISTRY } from "@/app/api/compliance";

export const usePlanification = () => {
    const { currentValleyId, isValleyManager, isCommunicationsManager, userRole } = useHooks();
    
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
    
    const dummyInfoTask = () => {}; 
    const dummyTask = () => {}; 
    const dummySubtask = () => {}; 
   
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
    } = useTasksData(currentValleyId ?? undefined, userRole);

    const valleyTaskForm = useValleyTaskForm(dummyInfoTask, currentValleyId?.toString() || "");
    const valleySubtaskForm = useValleySubtasksForm(
        dummySubtask, 
        undefined, 
        async () => {
            await refetch();
        },
        updateTaskDetailsAfterSubtaskChange 
    );
    const communicationTaskForm = useCommunicationTaskForm(dummyTask);
    
    const [createTask] = useMutation(CREATE_TASK);
    const [updateTask] = useMutation(UPDATE_TASK);
    const [updateCompliance] = useMutation(UPDATE_COMPLIANCE);
    const [updateRegistry] = useMutation(UPDATE_REGISTRY);
    const [createInfoTask] = useMutation(CREATE_INFO_TASK);
    const [createCompliance] = useMutation(CREATE_COMPLIANCE);
    const [createRegistry] = useMutation(CREATE_REGISTRY);

    useEffect(() => {
        if (subTasks && subTasks.length > 0) {
            setLocalSubtasks(subTasks);
        }
    }, [subTasks]);

    const [getCompliance] = useLazyQuery(GET_TASK_COMPLIANCE);
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
        if (userRole === "encargado cumplimiento") {
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
            const { data: complianceData } = await createCompliance({
                variables: {
                    input: {
                        taskId: data.createTask.id,
                        statusId: 1,
                    },
                },
            });
            await createRegistry({
                variables: {
                    input: {
                        complianceId: complianceData.create.id,
                    },
                },
            });
            await refetch();
        }catch (error) {
            console.error("Error saving communication task:", error);
        }
        setIsCommunicationModalOpen(false);
        await refetch();
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
            
            if (data?.updateTask.status.id === 3) {
                try {
                    const complianceData = await getCompliance({
                        variables: {
                            taskId: data.updateTask.id,
                        },
                    });
                    if (complianceData.data?.getTaskCompliance) {
                        const complianceId = complianceData.data.getTaskCompliance.id
                        await updateRegistry({
                            variables: {
                                id: complianceData?.data.getTaskCompliance.registries?.[0]?.id,
                                input: {
                                    startDate: new Date(),
                                },
                            },
                        });
                        await updateCompliance({
                            variables: {
                                id: complianceId,
                                input: {
                                    statusId: 2,
                                },
                            },
                        });
                    } else {
                        console.warn("No compliance data found for the updated task.");
                    }
                }
                catch (error) {
                    console.error("Error fetching compliance data:", error);
                }
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
     * @param taskId ID de la tarea a eliminar
     */
    const handleDeleteTask = async () => {
        try {
            await valleyTaskForm.handleDeleteTask(itemToDeleteId!);
            setIsDeleteTaskModalOpen(false);
            await refetch();
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
            
            await refetch();
            
            setIsDeleteSubtaskModalOpen(false);
        } catch (error) {
            console.error("Error deleting subtask:", error);
        }
        setIsDeleteSubtaskModalOpen(false);
    };

    /**
     * Función para guardar una nueva tarea
     * @description Guarda una nueva tarea en la base de datos
     * @param task Tarea a guardar
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
            const { data: complianceData } = await createCompliance({
                variables: {
                    input: {
                        taskId: data.createTask.id,
                        statusId: 1,
                    },
                },
            });
            await createRegistry({
                variables: {
                    input: {
                        complianceId: complianceData.create.id,
                    },
                },
            });
            await refetch();
        } catch (error) {
            console.error("Error saving task:", error);
        }

        setIsPopupOpen(false);
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
        else if (isCommunicationsManager || userRole === "encargado cumplimiento") {
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
            
            setLocalSubtasks(prev => [...prev, newSubtask]);
            
            await refetch();
            
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
            
            // Actualizar el estado local de subtareas inmediatamente para la UI
            setLocalSubtasks(prev => prev.map(s => 
                s.id === selectedSubtask?.id ? {...subtask, id: selectedSubtask.id, taskId: selectedTaskId!} : s
            ));
            
            // Refrescar explícitamente para asegurar que detailedTasks se actualiza
            await refetch();
            
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
        allProcesses: useTasksData(currentValleyId ?? undefined, userRole).allProcesses,
    };
};