import { useState, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { 
    GET_ALL_PROCESSES,
    GET_TASKS,
    GET_TASKS_BY_PROCESS,
    GET_TASKS_BY_PROCESS_AND_STATUS,
    GET_TASK_STATUSES, 
    GET_TASK_SUBTASKS 
} from "@/app/api/tasks";
import { ISubtask } from "@/app/models/ISubtasks";
import { ITask, ITaskDetails, ITaskStatus } from "@/app/models/ITasks";
import { useValleyTaskForm } from "./useValleyTaskForm";
import { TaskDetails } from "@/app/models/ITaskForm";

export const useTasksData = (currentValleyId: number | undefined, userRole:string) => {
  const [subTasks, setSubtasks] = useState<ISubtask[]>([]);
  const [detailedTasks, setDetailedTasks] = useState<ITaskDetails[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [tasksData, setTasksData] = useState<ITask[]>([]);

  const [isLoadingSubtasks, setIsLoadingSubtasks] = useState<boolean>(false);
  const [isLoadingTaskDetails, setIsLoadingTaskDetails] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  // Nueva variable para identificar los roles de comunicación
  const isCommunicationsRole = userRole.toLowerCase() === "encargado comunicaciones" || 
                               userRole.toLowerCase() === "encargado asuntos públicos";
  
  // Nueva variable para controlar si se están cargando tareas de comunicación
  const [loadingCommunicationTasks, setLoadingCommunicationTasks] = useState(isCommunicationsRole);

  const validRoles = ["encargado copiapó", "encargado huasco", "encargado valle elqui", "encargado comunicaciones", "encargado asuntos públicos"];

  // Nueva función para cargar tareas de múltiples procesos de comunicación
  const loadCommunicationProcessesTasks = async () => {
    const communicationProcessIds = [4, 5, 6, 7]; // IDs de los procesos de comunicación
    const allTasks: ITask[] = [];
    
    setIsLoadingTaskDetails(true);
    
    try {
      // Cargar tareas para cada proceso en serie
      for (const processId of communicationProcessIds) {
        const { data } = await getTasksByProcess({
          variables: { processId },
        });
        const processTasks = data?.tasksByProcess || [];
        allTasks.push(...processTasks);
      }
      
      return allTasks;
    } catch (error) {
      console.error("Error loading communication processes tasks:", error);
      return [];
    } finally {
      setIsLoadingTaskDetails(false);
    }
  };

  /**
   * Función para obtener el ID del proceso actual según el rol del usuario
   * @description Determina el ID del proceso actual basado en el rol del usuario
   * @param userRole Role del usuario actual
   * @returns 
   */
  const getCurrentProcessId = (userRole: string) => {
    switch(userRole) {
      case "encargado copiapó":
        return 1;
      case "encargado huasco":
        return 2;
      case "encargado valle elqui":
        return 3;
      case "encargado comunicaciones":
        return 4;
      case "encargado asuntos públicos":
        return 5;
      default:
        return 6;
    }
  };

  /**
   * Determina si se debe usar la consulta de procesos
   * @description Verifica si el rol del usuario es uno de los roles válidos para usar la consulta de procesos
   */
  const shouldUseProcessQuery = validRoles.includes(userRole.toLowerCase());

  const dummyTask = (task: TaskDetails) => {};
  const valleyTaskForm = useValleyTaskForm(dummyTask, currentValleyId?.toString() || "");

  const { 
    data: processData, 
    loading: valleyQueryLoading, 
    error: valleyQueryError, 
    refetch: refetchValleyTasks 
  } = useQuery(GET_TASKS_BY_PROCESS, { 
    variables: { processId: getCurrentProcessId(userRole) },
    skip: !shouldUseProcessQuery || isCommunicationsRole, // Omitir para roles de comunicación
  });

  const { 
    data: allTasksData, 
    loading: allTasksQueryLoading, 
    error: allTasksQueryError,
    refetch: refetchAllTasks 
  } = useQuery(GET_TASKS, {
    skip: shouldUseProcessQuery || isCommunicationsRole, // También omitir para roles de comunicación
  });

  const {
    data: allProcessData,
    loading: allProcessQueryLoading,
    error: allProcessQueryError,
  } = useQuery(GET_ALL_PROCESSES);

  const { data: taskStateData } = useQuery(GET_TASK_STATUSES);
  
  const [getSubtasks] = useLazyQuery(GET_TASK_SUBTASKS);
  const [getTasksByStatus] = useLazyQuery(GET_TASKS_BY_PROCESS_AND_STATUS);
  const [getTasksByProcess] = useLazyQuery(GET_TASKS_BY_PROCESS);
  
  // Modificar cómo se determinan las tareas
  const tasks = isCommunicationsRole 
    ? tasksData 
    : (shouldUseProcessQuery 
        ? (processData?.tasksByProcess || []) 
        : (allTasksData?.tasks || []));
  
  const allProcesses = allProcessData?.processes || [];

  const error = shouldUseProcessQuery ? valleyQueryError : allTasksQueryError;
  const mainQueryLoading = shouldUseProcessQuery ? valleyQueryLoading : allTasksQueryLoading;
  
  // Modificar refetch para considerar los roles de comunicación
  const refetch = async () => {
    if (isCommunicationsRole) {
      try {
        const communicationTasks = await loadCommunicationProcessesTasks();
        setTasksData(communicationTasks);
        return { data: { tasksByProcess: communicationTasks } };
      } catch (error) {
        console.error("Error refetching communication tasks:", error);
        return { data: { tasksByProcess: [] } };
      }
    } else {
      return shouldUseProcessQuery ? refetchValleyTasks() : refetchAllTasks();
    }
  };
  
  const states = taskStateData?.taskStatuses || [];
  const taskState = states.map((s: ITaskStatus) => s.name);

  const loading = mainQueryLoading || isLoadingSubtasks || isLoadingTaskDetails || 
                  isInitialLoad || allProcessQueryLoading || loadingCommunicationTasks;

  // Cargar tareas de comunicación al inicio para roles específicos
  useEffect(() => {
    const loadInitialCommunicationTasks = async () => {
      if (isCommunicationsRole) {
        try {
          setLoadingCommunicationTasks(true);
          const communicationTasks = await loadCommunicationProcessesTasks();
          setTasksData(communicationTasks);
          
          // Cargar subtareas para estas tareas para que estén disponibles
          if (communicationTasks.length > 0) {
            setIsLoadingSubtasks(true);
            try {
              const allSubtasks = await Promise.all(
                communicationTasks.map(async (task: ITask) => {
                  const { data: subtaskData } = await getSubtasks({
                    variables: { id: task.id },
                  });
                  return subtaskData?.taskSubtasks || [];
                })
              );
              const flattenedSubtasks = allSubtasks.flat();
              setSubtasks(flattenedSubtasks);
            } catch (error) {
              console.error("Error fetching subtasks for communication tasks:", error);
            } finally {
              setIsLoadingSubtasks(false);
            }
          }
        } catch (error) {
          console.error("Error loading initial communication tasks:", error);
        } finally {
          setLoadingCommunicationTasks(false);
        }
      }
    };

    loadInitialCommunicationTasks();
  }, [isCommunicationsRole]);

  /**
   * Hook para manejar el estado de las tareas
   * @description Inicializa el estado de las tareas y subtareas, y configura los efectos secundarios para cargar los datos
   */
  useEffect(() => {
    if (!isCommunicationsRole) {
      const newTasks = shouldUseProcessQuery 
        ? (processData?.tasksByProcess || []) 
        : (allTasksData?.tasks || []);
      
      setTasksData(newTasks);
    }
  }, [processData, allTasksData, shouldUseProcessQuery, isCommunicationsRole]);

  /**
   * Función para obtener las tareas filtradas por estado
   * @description Maneja la obtención de tareas filtradas por estado utilizando la consulta GraphQL o filtrando localmente
   * @param statusId ID del estado de la tarea
   * @returns 
   */
  const handleGetTasksByStatus = async (statusId: number) => {
    try {
      setIsLoadingTaskDetails(true);
      
      if (isCommunicationsRole) {
        // Para roles de comunicación, filtrar el estado de las tareas ya cargadas
        return tasksData.filter(task => task.status?.id === statusId);
      } else if (shouldUseProcessQuery) {
        const { data } = await getTasksByStatus({
          variables: { processId: getCurrentProcessId(userRole), statusId },
        });
        console.log("Tasks by status data:", data);
        return data?.tasksByProcessAndStatus || [];
      } else {
        return tasksData.filter(task => task.status?.id === statusId);
      }
    } catch (error) {
      console.error("Error fetching tasks by status:", error);
      return [];
    } finally {
      console.log("Tasks by status fetched successfully", getCurrentProcessId(userRole));
      setIsLoadingTaskDetails(false);
    }
  };

  /**
   * Función para manejar el clic en un filtro
   * @description Maneja el clic en un filtro de estado de tarea, actualiza el estado activo y refetch de tareas
   * @param filter Nombre del filtro seleccionado
   */
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

  /**
   * Función para obtener los días restantes de una tarea
   * @description Calcula los días restantes para completar una tarea según su estado y fecha de finalización
   * @param task Tarea para calcular los días restantes
   * @returns 
   */
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

  /**
   * Función para obtener los días restantes de una subtarea
   * @description Calcula los días restantes para completar una subtarea según su estado y fecha de finalización
   * @param subtask Subtarea para calcular los días restantes
   * @returns 
   */
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

  /**
   * Función para formatear una fecha en formato ISO
   * @description Convierte una fecha en formato ISO a un formato legible (DD-MM-YYYY)
   * @param isoDate Fecha en formato ISO para formatear
   * @returns 
   */
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

  /**
   * Función para procesar las tareas con detalles adicionales
   * @description Maneja la obtención de detalles adicionales de las tareas, como presupuesto, fechas de inicio y fin, y subtareas asociadas
   * @param tasks Lista de tareas a procesar
   * @returns 
   */
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

  /**
   * Función para cargar las tareas con detalles adicionales
   * @description Maneja la carga de tareas con detalles adicionales, como presupuesto, fechas de inicio y fin, y subtareas asociadas
   */
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

  /**
   * Hook para inicializar el estado de las subtareas
   * @description Maneja la carga de subtareas al inicio o cuando cambian las tareas, el estado de carga principal o el estado de carga de subtareas
   */
  useEffect(() => {
    const fetchSubtasks = async () => {
      if (tasks && tasks.length > 0 && !isCommunicationsRole) {
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

    if (!mainQueryLoading && tasks && tasks.length > 0 && !isCommunicationsRole) {
      fetchSubtasks();
    }
  }, [tasks, mainQueryLoading, getSubtasks, isCommunicationsRole]);

  /**
   * Hook para cargar los detalles de las tareas al inicio
   * @description Maneja la carga de detalles de las tareas al inicio o cuando cambian las tareas, el estado de carga principal o el estado de carga de subtareas
   */
  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (!mainQueryLoading && !isLoadingSubtasks && !loadingCommunicationTasks) {
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
  }, [tasks, mainQueryLoading, isLoadingSubtasks, loadingCommunicationTasks]);

  /**
  * Función para filtrar tareas por proceso
  * @description Filtra las tareas según el ID del proceso seleccionado
  * @param processId ID del proceso para filtrar
  */
  const handleFilterByProcess = async (processId: number) => {
    try {
      setIsLoadingTaskDetails(true);
      
      if (isCommunicationsRole) {
        if (!processId) {
          // "Todos los procesos" para roles de comunicación
          const communicationTasks = await loadCommunicationProcessesTasks();
          setTasksData(communicationTasks);
          const detailedTasks = await processTasksWithDetails(communicationTasks);
          setDetailedTasks(detailedTasks);
          return detailedTasks;
        } else {
          // Proceso específico para roles de comunicación
          const { data } = await getTasksByProcess({
            variables: { processId },
          });
          
          const filteredTasks = data?.tasksByProcess || [];
          const detailedFilteredTasks = await processTasksWithDetails(filteredTasks);
          setDetailedTasks(detailedFilteredTasks);
          setTasksData(filteredTasks);
          return detailedFilteredTasks;
        }
      } else if (processId) {
        // Proceso específico para otros roles
        const { data } = await getTasksByProcess({
          variables: { processId },
        });
        
        const filteredTasks = data?.tasksByProcess || [];
        const detailedFilteredTasks = await processTasksWithDetails(filteredTasks);
        setDetailedTasks(detailedFilteredTasks); 
        return detailedFilteredTasks; 
      } else {
        // "Todos los procesos" para otros roles
        const processedTasks = await loadTasksWithDetails();
        setDetailedTasks(processedTasks);
        return processedTasks;
      }
    } catch (error) {
      console.error("Error filtering tasks by process:", error);
      return []; 
    } finally {
      setIsLoadingTaskDetails(false);
    }
  };

  const unifiedData = shouldUseProcessQuery
    ? processData
    : { tasksByValley: allTasksData?.tasks || [] };

  return {
    data: unifiedData,
    loading,
    error,
    subTasks,
    detailedTasks,
    states,
    taskState,
    activeFilter,
    allProcesses,
    refetch,
    handleFilterByProcess,
    getRemainingDays,
    getRemainingSubtaskDays,
    formatDate,
    handleFilterClick,
    setActiveFilter,
    isCommunicationsRole
  };
};