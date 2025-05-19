import { useState, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { 
    GET_TASKS,
    GET_TASKS_BY_VALLEY, 
    GET_TASKS_BY_VALLEY_AND_STATUS, 
    GET_TASK_STATUSES, 
    GET_TASK_SUBTASKS 
} from "@/app/api/tasks";
import { ISubtask } from "@/app/models/ISubtasks";
import { ITask, ITaskDetails, ITaskStatus } from "@/app/models/ITasks";
import { useValleyTaskForm } from "./useValleyTaskForm";

export const useTasksData = (currentValleyId: number | undefined) => {
  const [subTasks, setSubtasks] = useState<ISubtask[]>([]);
  const [detailedTasks, setDetailedTasks] = useState<ITaskDetails[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [tasksData, setTasksData] = useState<ITask[]>([]);

  const [isLoadingSubtasks, setIsLoadingSubtasks] = useState<boolean>(false);
  const [isLoadingTaskDetails, setIsLoadingTaskDetails] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  const validValleyIds = [1, 2, 3];
  
  const shouldUseValleyQuery = currentValleyId !== undefined && validValleyIds.includes(currentValleyId);

  const dummyTask = (task: any) => {};
  const valleyTaskForm = useValleyTaskForm(dummyTask, currentValleyId?.toString() || "");

  const { 
    data: valleyData, 
    loading: valleyQueryLoading, 
    error: valleyQueryError, 
    refetch: refetchValleyTasks 
  } = useQuery(GET_TASKS_BY_VALLEY, {
    variables: { valleyId: currentValleyId },
    skip: !shouldUseValleyQuery,
  });

  const { 
    data: allTasksData, 
    loading: allTasksQueryLoading, 
    error: allTasksQueryError,
    refetch: refetchAllTasks 
  } = useQuery(GET_TASKS, {
    skip: shouldUseValleyQuery,
  });

  const { data: taskStateData } = useQuery(GET_TASK_STATUSES);
  
  const [getSubtasks] = useLazyQuery(GET_TASK_SUBTASKS);
  const [getTasksByStatus] = useLazyQuery(GET_TASKS_BY_VALLEY_AND_STATUS);
  
  const tasks = shouldUseValleyQuery 
    ? (valleyData?.tasksByValley || []) 
    : (allTasksData?.tasks || []);
  
  const error = shouldUseValleyQuery ? valleyQueryError : allTasksQueryError;
  const mainQueryLoading = shouldUseValleyQuery ? valleyQueryLoading : allTasksQueryLoading;
  
  const refetch = async () => {
    return shouldUseValleyQuery ? refetchValleyTasks() : refetchAllTasks();
  };
  
  const states = taskStateData?.taskStatuses || [];
  const taskState = states.map((s: ITaskStatus) => s.name);

  const loading = mainQueryLoading || isLoadingSubtasks || isLoadingTaskDetails || isInitialLoad;

  useEffect(() => {
    setTasksData(tasks);
  }, [valleyData, allTasksData, shouldUseValleyQuery]);

  const handleGetTasksByStatus = async (statusId: number) => {
    try {
      setIsLoadingTaskDetails(true);
      
      if (shouldUseValleyQuery) {
        const { data } = await getTasksByStatus({
          variables: { valleyId: currentValleyId, statusId },
        });
        return data?.tasksByValleyAndStatus || [];
      } else {
        return tasksData.filter(task => task.status?.id === statusId);
      }
    } catch (error) {
      console.error("Error fetching tasks by status:", error);
      return [];
    } finally {
      setIsLoadingTaskDetails(false);
    }
  };

  const handleFilterClick = async (filter: string) => {
    if (activeFilter === filter) {
      setActiveFilter(null);
      await refetch();
      
      const processedTasks = await loadTasksWithDetails();
      setDetailedTasks(processedTasks);
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
    }
  };

  const getRemainingDays = (task: ITaskDetails) => {
    const end = new Date(task.endDate);
    if (task.status?.name === "NO iniciada") {
      return "-";
    }
    if (task.status?.name === "Completada") {
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
    if (task.status?.name === "Cancelada") {
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
    if (!tasks || tasks.length === 0) return [];
    
    setIsLoadingTaskDetails(true);
    
    try {
      const detailedTasks = await processTasksWithDetails(tasks);
      return detailedTasks;
    } catch (error) {
      console.error("Error loading detailed tasks:", error);
      return [];
    } finally {
      setIsLoadingTaskDetails(false);
    }
  };

  useEffect(() => {
    const fetchSubtasks = async () => {
      if (tasks && tasks.length > 0) {
        setIsLoadingSubtasks(true);
        try {
          const allSubtasks = await Promise.all(
            tasks.map(async (task: ITask) => {
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

    if (!mainQueryLoading && tasks && tasks.length > 0) {
      fetchSubtasks();
    }
  }, [tasks, mainQueryLoading, getSubtasks]);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (!mainQueryLoading && !isLoadingSubtasks) {
        try {
          if (tasks && tasks.length > 0) {
            const processedTasks = await loadTasksWithDetails();
            setDetailedTasks(processedTasks);
          }
        } catch (error) {
          console.error("Error loading task details:", error);
        } finally {
          setIsInitialLoad(false);
        }
      }
    };
    
    fetchTaskDetails();
  }, [tasks, mainQueryLoading, isLoadingSubtasks]);

  const unifiedData = shouldUseValleyQuery
    ? valleyData
    : { tasksByValley: allTasksData?.tasks || [] };

  return {
    data: unifiedData,
    loading,
    error,
    refetch,
    subTasks,
    detailedTasks,
    states,
    taskState,
    activeFilter,
    getRemainingDays,
    getRemainingSubtaskDays,
    formatDate,
    handleFilterClick,
    setActiveFilter,
    isValleyMode: shouldUseValleyQuery,
  };
};