import { useState, useEffect } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { CREATE_TASK, GET_TASKS_BY_VALLEY, GET_TASKS_BY_VALLEY_AND_STATUS, GET_TASK_STATUSES, GET_TASK_SUBTASKS } from "@/app/api/tasks";
import { CREATE_INFO_TASK } from "@/app/api/infoTask";
import { ISubtask } from "@/app/models/ISubtasks";
import { useHooks } from "../../hooks/useHooks";
import { IInfoTask, ITask, ITaskDetails, ITaskStatus } from "@/app/models/ITasks";
import React from "react";
import { useValleyTaskForm } from "./useValleyTaskForm";
import { useValleySubtasksForm } from "./useValleySubtasksForm";

export const usePlanification = () => {
    const { currentValleyId } = useHooks();

    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [isPopupSubtaskOpen, setIsPopupSubtaskOpen] = useState<boolean>(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [tableOption, setTableOption] = useState<string>("Tareas");
    const [subTasks, setSubtasks] = useState<ISubtask[]>([]);
    const [selectedInfoTask, setSelectedInfoTask] = useState<IInfoTask | null>(null);
    const [selectedSubtask, setSelectedSubtask] = useState<ISubtask | null>(null);
    const [expandedRow, setExpandedRow] = useState<string>('');
    const [detailedTasks, setDetailedTasks] = useState<ITaskDetails[]>([]);
    const [activeFilter, setActiveFilter] = React.useState<string | null>(null);

    const [isLoadingSubtasks, setIsLoadingSubtasks] = useState<boolean>(false);
    const [isLoadingTaskDetails, setIsLoadingTaskDetails] = useState<boolean>(false);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    
    const dummyTask = (task: any) => {};
    const dummySubtask = (subtask: any) => {};

    const valleyTaskForm = useValleyTaskForm(dummyTask, currentValleyId?.toString() || "");
    const valleySubtaskForm = useValleySubtasksForm(dummySubtask);
    
    const [createTask] = useMutation(CREATE_TASK);
    const [createInfoTask] = useMutation(CREATE_INFO_TASK);

    const { data, loading: mainQueryLoading, error, refetch } = useQuery(GET_TASKS_BY_VALLEY, {
        variables: { valleyId: currentValleyId },
        skip: !currentValleyId,
    });

    const {data: taskStateData} = useQuery(GET_TASK_STATUSES);

    const [getSubtasks] = useLazyQuery(GET_TASK_SUBTASKS);
    const [getTasksByStatus] = useLazyQuery(GET_TASKS_BY_VALLEY_AND_STATUS);
    
    const states = taskStateData?.taskStatuses || [];
    const taskState = states.map((s: ITaskStatus) => s.name);

    const loading = mainQueryLoading || isLoadingSubtasks || isLoadingTaskDetails || isInitialLoad;

    const handleAddTask = () => {
        setIsPopupOpen(true);
    };

    const handleCancel = () => {
        setSelectedInfoTask(null);
        setIsPopupOpen(false);
    };

    const handleCancelSubtask = () => {
        setSelectedSubtask(null);
        setIsPopupSubtaskOpen(false);
    };
    
    const handleGetTasksByStatus = async (statusId: number) => {
        try {
            setIsLoadingTaskDetails(true);
            const { data } = await getTasksByStatus({
                variables: { valleyId: currentValleyId, statusId },
            });
            return data?.tasksByValleyAndStatus || [];
        } catch (error) {
            console.error("Error fetching tasks by valley:", error);
            return [];
        } finally {
            setIsLoadingTaskDetails(false);
        }
    };

    const handleFilterClick = async (filter: string) => {
        if (activeFilter === filter) {
            setActiveFilter(null);
            await refetch();
            
            const tasks = await loadTasksWithDetails();
            setDetailedTasks(tasks);
        } else {
            const statusId = states.find((state: ITaskStatus) => state.name === filter)?.id;
            if (statusId) {
                try {
                    setActiveFilter(filter);
                    const filteredTasks = await handleGetTasksByStatus(statusId);
                    const detailedFilteredTasks = await processTasksWithDetails(filteredTasks);
                    setDetailedTasks(detailedFilteredTasks);
                } catch (error) {
                    console.error("Error filtering tasks:", error);
                }
            }
        };
    }

    const handleSaveTask = async (task: any) => {
        console.log("Saving task:", task);
        try {
            const { data } = await createTask({
                variables: {
                    input: {
                        name: task.name,
                        description: task.description,
                        valleyId: task.valley,
                        faenaId: task.faena,
                        statusId: 1,
                    },
                },
            });

            if (!data?.createTask?.id) {
                throw new Error("Task creation failed: ID is undefined.");
            }

            const { data: infoData } = await createInfoTask({
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
            await refetch();
        } catch (error) {
            console.error("Error saving task:", error);
        }

        setIsPopupOpen(false);
    };

    const handleOnTaskClick = (taskId: string) => {
        setSelectedTaskId((prev) => (prev === taskId ? null : taskId));
        setExpandedRow((prev) => (prev === taskId ? '' : taskId));
    };

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    useEffect(() => {
        const fetchSubtasks = async () => {
            if (data?.tasksByValley) {
                setIsLoadingSubtasks(true);
                try {
                    const allSubtasks = await Promise.all(
                        data.tasksByValley.map(async (task: ITask) => {
                            const { data: subtaskData } = await getSubtasks({
                                variables: { id: task.id },
                            });
                            return subtaskData?.taskSubtasks || [];
                        })
                    );

                    const flattenedSubtasks = allSubtasks.flat();
                    setSubtasks(flattenedSubtasks);
                } catch (error) {
                    console.error("Error fetching subtasks:", error);
                } finally {
                    setIsLoadingSubtasks(false);
                }
            }
        };

        if (!mainQueryLoading && data?.tasksByValley) {
            fetchSubtasks();
        }
    }, [data, mainQueryLoading, getSubtasks]);

    const getRemainingDays = (task: ITaskDetails) => {
        const end = new Date(task.endDate);
        if (task.status.name === "NO iniciada") {
            return "-";
        }
        if (task.status.name === "Completada") {
            const taskSubtasks = subTasks.filter(subtask => subtask.taskId === task.id);
            if (taskSubtasks.length === 0) {
                return 0;
            }

            const subtaskDays = taskSubtasks.map(subtask => {
                const daysValue = getRemainingSubtaskDays(subtask);
                return daysValue === "-" ? Number.MAX_SAFE_INTEGER : Number(daysValue);
            });

            const validDays = subtaskDays.filter(days => days !== Number.MAX_SAFE_INTEGER);
            if (validDays.length === 0) {
                return 0;
            }
            
            return Math.min(...validDays);
        }
        if (task.status.name === "Cancelada") {
            return 0;
        }
        else {
            const today = new Date();
            const diffTime = end.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (isNaN(diffDays)) {
                return "-";
            }
            return diffDays;
        }
    };
    const getRemainingSubtaskDays = (subtask: ISubtask) => {
        const end = new Date(subtask.endDate);
        if (subtask.status.name === "Completada con Informe Final") {
            const finishDate = new Date(subtask.finalDate);
            const startDate = new Date(subtask.startDate);
            const diffTime = finishDate.getTime() - startDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (isNaN(diffDays)) {
                return "-";
            }
            return diffDays;
        }
        if (subtask.status.name === "Cancelada") {
            return 0;
        }
        else {
            const today = new Date();
            const diffTime = end.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (isNaN(diffDays)) {
                return "-";
            }
            return diffDays;
        }
    };

    const formatDate = (isoDate: string): string => {
        if (isoDate === null || isoDate === undefined || isoDate === "-") {
            return "-";
        }
        
        try {
            const date = new Date(isoDate);
            
            const year = date.getUTCFullYear();
            const month = String(date.getUTCMonth() + 1).padStart(2, "0");
            const day = String(date.getUTCDate()).padStart(2, "0");
            
            return `${day}-${month}-${year}`;
        } catch (error) {
            console.error("Error formatting date:", error);
            return "-";
        }
    };

    const processTasksWithDetails = async (tasks: ITask[]) => {
        if (!tasks || tasks.length === 0) return [];
        
        try {
            const detailedTasks = await Promise.all(tasks.map(async (task: ITask) => {
                const associatedSubtasks = subTasks.filter((subtask) => subtask.taskId === task.id);
                
                const budget = task.id ? await valleyTaskForm.handleGetTaskBudget(task.id) : null;
                
                const startDate = associatedSubtasks.length
                    ? new Date(Math.min(...associatedSubtasks.map((subtask) => new Date(subtask.startDate).getTime())))
                    : null;
            
                const endDate = associatedSubtasks.length
                    ? new Date(Math.max(...associatedSubtasks.map((subtask) => new Date(subtask.endDate).getTime())))
                    : null;
            
                const validFinalDates = associatedSubtasks
                    .filter(subtask => subtask.finalDate && !isNaN(new Date(subtask.finalDate).getTime()))
                    .map(subtask => new Date(subtask.finalDate).getTime());
                
                const finishDate = validFinalDates.length > 0
                    ? new Date(Math.max(...validFinalDates))
                    : null;
            
                return {
                    ...task,
                    budget: budget || 0,  
                    startDate: startDate ? startDate.toISOString() : "-",
                    endDate: endDate ? endDate.toISOString() : "-",
                    finishedDate: finishDate ? finishDate.toISOString() : "-",
                };
            }));
            
            return detailedTasks;
        } catch (error) {
            console.error("Error processing filtered tasks:", error);
            return [];
        }
    };

    const loadTasksWithDetails = async () => {
        if (!data?.tasksByValley) return [];
        
        setIsLoadingTaskDetails(true);
        
        try {
            const detailedTasks = await processTasksWithDetails(data.tasksByValley);
            return detailedTasks;
        } catch (error) {
            console.error("Error loading detailed tasks:", error);
            return [];
        } finally {
            setIsLoadingTaskDetails(false);
        }
    };

    useEffect(() => {
        const fetchTaskDetails = async () => {
            if (!mainQueryLoading && !isLoadingSubtasks) {
                try {
                    if (data?.tasksByValley) {
                        const tasks = await loadTasksWithDetails();
                        setDetailedTasks(tasks);
                    }
                } catch (error) {
                    console.error("Error loading task details:", error);
                } finally {
                    setIsInitialLoad(false);
                }
            }
        };
        
        fetchTaskDetails();
    }, [data, mainQueryLoading, isLoadingSubtasks]);

    const handleSeeInformation = async (taskId: string) => {
        setSelectedTaskId(taskId);
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
    };
    
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

    const handleCreateSubtask = async (subtask: ISubtask) => {
        try {
            await valleySubtaskForm.handleCreateSubtask(subtask, selectedTaskId!);
            setIsPopupSubtaskOpen(false);
            refetch();
            window.location.reload();
        } catch (error) {
            console.error("Error in handleCreateSubtask:", error);
        }
    };

    const handleUpdateSubtask = async (subtask: ISubtask) => {
        try {
            await valleySubtaskForm.handleUpdateSubtask(subtask, selectedTaskId!, selectedSubtask);
            setIsPopupSubtaskOpen(false);
            window.location.reload();
        } catch (error) {
            console.error("Error in handleUpdateSubtask:", error);
        }
    };

    const handleUpdateTask = async (task: any) => {
        try {
            const updatedTaskId = await valleyTaskForm.handleUpdateTask(task, selectedTaskId!, selectedInfoTask);
            setIsPopupOpen(false);
            setSelectedTaskId(updatedTaskId);
            window.location.reload();
        } catch (error) {
            console.error("Error in handleUpdateTask:", error);
        }
    };

    return {
        setTableOption,
        handleAddTask,
        handleSaveTask,
        handleOnTaskClick,
        toggleSidebar,
        createTask,
        getRemainingDays,
        getRemainingSubtaskDays,
        setIsPopupOpen,
        setIsPopupSubtaskOpen,
        setSelectedTaskId,
        setIsSidebarOpen,
        handleCancel,
        formatDate,
        handleSeeInformation,
        handleGetSubtask,
        handleCreateSubtask,
        handleUpdateSubtask,
        handleUpdateTask,
        handleCancelSubtask,
        handleFilterClick,
        isPopupOpen,
        isPopupSubtaskOpen,
        selectedTaskId,
        isSidebarOpen,
        tableOption,
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
    };
};