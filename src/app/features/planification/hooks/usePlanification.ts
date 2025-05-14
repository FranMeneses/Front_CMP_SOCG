import { useState, useEffect } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { CREATE_TASK, GET_TASK, GET_TASK_STATUSES, GET_TASK_SUBTASKS, GET_TASK_TOTAL_BUDGET, GET_TASK_TOTAL_EXPENSE, GET_TASKS_BY_VALLEY, GET_TASKS_BY_VALLEY_AND_STATUS, UPDATE_TASK } from "@/app/api/tasks";
import { CREATE_INFO_TASK, GET_TASK_INFO, UPDATE_INFO_TASK } from "@/app/api/infoTask";
import { ISubtask } from "@/app/models/ISubtasks";
import { CREATE_SUBTASK, GET_SUBTASK, UPDATE_SUBTASK } from "@/app/api/subtasks";
import { useHooks } from "../../hooks/useHooks";
import { IInfoTask, ITask, ITaskDetails, ITaskStatus } from "@/app/models/ITasks";
import React from "react";

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
    
    const [createTask] = useMutation(CREATE_TASK);
    const [createSubtask] = useMutation(CREATE_SUBTASK);
    const [createInfoTask] = useMutation(CREATE_INFO_TASK);
    const [updateTask] = useMutation(UPDATE_TASK); 
    const [updateSubtask] = useMutation(UPDATE_SUBTASK); 
    const [updateInfoTask] = useMutation(UPDATE_INFO_TASK);

    const { data, loading: mainQueryLoading, error, refetch } = useQuery(GET_TASKS_BY_VALLEY, {
        variables: { valleyId: currentValleyId },
        skip: !currentValleyId,
    });

    const {data: taskStateData} = useQuery(GET_TASK_STATUSES);

    const [getSubtasks] = useLazyQuery(GET_TASK_SUBTASKS);
    const [getTasksByStatus] = useLazyQuery(GET_TASKS_BY_VALLEY_AND_STATUS)
    const [getInfoTask] = useLazyQuery(GET_TASK_INFO);
    const [getTaskBudget] = useLazyQuery(GET_TASK_TOTAL_BUDGET);
    const [getTaskExpenses] = useLazyQuery(GET_TASK_TOTAL_EXPENSE);
    const [getTask] = useLazyQuery(GET_TASK);
    const [getSubtask] = useLazyQuery(GET_SUBTASK);
    
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


    const getRemainingDays = (task: any) => {
        const end = new Date(task.endDate);
        if (task.status.name === "NO iniciada") {
            return "-";
        }
        if (task.status.name === "Completada" || task.status.name === "Completada con Informe Final") {
            return 0;
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
                
                const budget = task.id ? await handleGetTaskBudget(task.id) : null;
                
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

    const handleGetTaskBudget = async (taskId: string) => {
        try {
            const { data: budgetData } = await getTaskBudget({
                variables: { id: taskId },
            });
            if (budgetData) {
                return budgetData.taskTotalBudget;
            } else {
                console.warn("No data found for the given task ID:", taskId);
                return null;
            }
        } catch (error) {
            console.error("Error fetching task budget:", error);
            return null;
        }
    };

    const handleGetTaskExpenses = async (taskId: string) => {
        try {
            const { data: expensesData } = await getTaskExpenses({
                variables: { id: taskId },
            });
            if (expensesData) {
                return expensesData.taskTotalExpense;
            } else {
                console.warn("No data found for the given task ID:", taskId);
                return null;
            }
        } catch (error) {
            console.error("Error fetching task expenses:", error);
            return null;
        }
    };

    const handleGetInfoTask = async (taskId: string) => {
        try {
            const { data: infoData } = await getInfoTask({
                variables: { id: taskId },
            });
            if (infoData) {
                return infoData.taskInfo;
            } else {
                console.warn("No data found for the given task ID:", taskId);
                return null;
            }
        } catch (error) {
            console.error("Error fetching task information:", error);
            return null;
        }
    };

    const handleGetSubtask = async (subtaskId: string) => {
        try {
            const { data: subtaskData } = await getSubtask({
                variables: { id: subtaskId },
            });
            if (subtaskData && subtaskData.subtask) {
                const subtaskWithDefaults = {
                    ...subtaskData.subtask,
                    priorityId: subtaskData.subtask.priorityId || 1,  
                    number: subtaskData.subtask.number || "",
                    name: subtaskData.subtask.name || "",
                    description: subtaskData.subtask.description || "",
                    budget: subtaskData.subtask.budget || 0,
                    startDate: subtaskData.subtask.startDate || new Date().toISOString(),
                    endDate: subtaskData.subtask.endDate || new Date().toISOString(),
                };
                setSelectedSubtask(subtaskWithDefaults);
                setIsPopupSubtaskOpen(true);
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

    const handleSeeInformation = async (taskId: string) => {
        setSelectedTaskId(taskId);
        try {
            const taskInfo = await handleGetInfoTask(taskId);
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

    const handleGetTaskFaena = async (taskId: string) => {
        try {
            const { data: taskData } = await getTask({
                variables: { id: taskId },
            });
            if (taskData) {
                return taskData.task.faenaId;
            } else {
                console.warn("No data found for the given task ID:", taskId);
                return null;
            }
        } catch (error) {
            console.error("Error fetching task:", error);
            return null;
        }
    }

    const handleCreateSubtask = async (subtask: ISubtask) => {
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
            setIsPopupSubtaskOpen(false);
            refetch(); 
            window.location.reload();
        }
        catch (error) {
            console.error("Error creating subtask:", error);
        }
    }

    const handleUpdateSubtask = async (subtask: ISubtask) => {
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
                    },
                },
            });
            if (!data?.updateSubtask?.id) {
                throw new Error("Subtask update failed: ID is undefined.");
            }
            setIsPopupSubtaskOpen(false);
            window.location.reload();
        }
        catch (error) {
            console.error("Error updating subtask:", error);
        }
    };

    const handleUpdateTask = async (task: any) => {
        try {
            const { data } = await updateTask({
                variables: {
                    id: selectedTaskId,
                    input: {
                        name: task.name,
                        description: task.description,
                        statusId: task.state,
                    },
                },
            });

            if (!data?.updateTask?.id) {
                throw new Error("Task update failed: ID is undefined.");
            }
            const { data: infoData } = await updateInfoTask({
                variables: {
                    id: selectedInfoTask?.id,
                    input: {
                        taskId: selectedTaskId,
                        originId: task.origin,
                        investmentId: task.investment,
                        typeId: task.type,
                        scopeId: task.scope,
                        interactionId: task.interaction,
                        riskId: task.risk,
                    },
                },
            });

            setIsPopupOpen(false);
            setSelectedTaskId(data.updateTask.id);
            window.location.reload();
        }
        catch (error) {
            console.error("Error updating task:", error);
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
        setIsPopupOpen,
        setIsPopupSubtaskOpen,
        setSelectedTaskId,
        setIsSidebarOpen,
        handleCancel,
        formatDate,
        handleSeeInformation,
        handleGetTaskBudget,
        handleGetTaskExpenses,
        handleGetTaskFaena,
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