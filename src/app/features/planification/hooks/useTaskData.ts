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

export const useTasksData = (currentValleyId: number | undefined, userRole:string, isLocalEdit?: boolean, selectedProcessId?: number) => {
  const [subTasks, setSubtasks] = useState<ISubtask[]>([]);
  const [detailedTasks, setDetailedTasks] = useState<ITaskDetails[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [tasksData, setTasksData] = useState<ITask[]>([]);

  const [isLoadingSubtasks, setIsLoadingSubtasks] = useState<boolean>(false);
  const [isLoadingTaskDetails, setIsLoadingTaskDetails] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  // Normaliza el rol del usuario a minúsculas para todas las comparaciones
  const normalizedUserRole = userRole.toLowerCase();

  const isCommunicationsRole = normalizedUserRole === "encargado comunicaciones" ||
                               normalizedUserRole === "superintendente comunicaciones" || 
                               normalizedUserRole === "encargado asuntos públicos";

  const isRelationshipSuperintendent = normalizedUserRole === "superintendente relacionamiento";
  
  const [loadingCommunicationTasks, setLoadingCommunicationTasks] = useState(isCommunicationsRole);
  const [loadingRelationshipTasks, setLoadingRelationshipTasks] = useState(isRelationshipSuperintendent);

  const validRoles = [
    "encargado comunicaciones",
    "encargado asuntos públicos",
    "jefe relacionamiento vc",
    "jefe relacionamiento vh",
    "jefe relacionamiento ve"
  ];

  /**
   * Función para cargar las tareas de los procesos de comunicación
   * @description Carga las tareas de los procesos de comunicación específicos y maneja el estado de carga
   * @returns 
   */
  const loadCommunicationProcessesTasks = async () => {
    const communicationProcessIds = [4, 5, 6, 7]; 
    const allTasks: ITask[] = [];
    
    setIsLoadingTaskDetails(true);
    
    try {
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
   * Función para cargar las tareas de los procesos de relación
   * @description Carga las tareas de los procesos de relación específicos y maneja el estado de carga
   * @returns 
   */
  const loadRelationshipProcessesTasks = async () => {
    const relationshipProcessIds = [1, 2, 3]; 
    const allTasks: ITask[] = [];
    
    setIsLoadingTaskDetails(true);
    
    try {
      for (const processId of relationshipProcessIds) {
        const { data } = await getTasksByProcess({
          variables: { processId },
        });
        const processTasks = data?.tasksByProcess || [];
        allTasks.push(...processTasks);
      }
      
      return allTasks;
    } catch (error) {
      console.error("Error loading relationship processes tasks:", error);
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
      case "Jefe Relacionamiento VC":
        return 1;
      case "Jefe Relacionamiento VH":
        return 2;
      case "Jefe Relacionamiento VE":
        return 3;
      case "Encargado Comunicaciones":
        return 4;
      case "Encargado Asuntos Públicos":
        return 5;
      default:
        return 6;
    }
  };

  /**
   * Determina si se debe usar la consulta de procesos
   * @description Verifica si el rol del usuario es uno de los roles válidos para usar la consulta de procesos
   */
  const shouldUseProcessQuery = validRoles.includes(normalizedUserRole);

  const dummyTask = () => {};
  const valleyTaskForm = useValleyTaskForm(dummyTask, currentValleyId?.toString() || "");

  const { 
    data: processData, 
    loading: valleyQueryLoading, 
    error: valleyQueryError, 
    refetch: refetchValleyTasks 
  } = useQuery(GET_TASKS_BY_PROCESS, { 
    variables: { processId: getCurrentProcessId(userRole) },
    skip: !shouldUseProcessQuery || isCommunicationsRole || isRelationshipSuperintendent,
    fetchPolicy: "network-only",
  });

  const { 
    data: allTasksData, 
    loading: allTasksQueryLoading, 
    error: allTasksQueryError,
    refetch: refetchAllTasks 
  } = useQuery(GET_TASKS, {
    skip: shouldUseProcessQuery || isCommunicationsRole || isRelationshipSuperintendent,
    fetchPolicy: "network-only",
  });

  const {
    data: allProcessData,
    loading: allProcessQueryLoading,
  } = useQuery(GET_ALL_PROCESSES, {
    fetchPolicy: "network-only",
  });

  const { data: taskStateData } = useQuery(GET_TASK_STATUSES,{
        fetchPolicy: "network-only",
  });
  
  const [getSubtasks] = useLazyQuery(GET_TASK_SUBTASKS,{
        fetchPolicy: "network-only",
  });
  const [getTasksByStatus] = useLazyQuery(GET_TASKS_BY_PROCESS_AND_STATUS,{
        fetchPolicy: "network-only",
  });
  const [getTasksByProcess] = useLazyQuery(GET_TASKS_BY_PROCESS, {
        fetchPolicy: "network-only",
  });
  
  const tasks = isCommunicationsRole 
    ? tasksData 
    : (isRelationshipSuperintendent 
        ? tasksData
        : (shouldUseProcessQuery 
            ? (processData?.tasksByProcess || []) 
            : (allTasksData?.tasks || [])));
  
  const allProcesses = allProcessData?.processes || [];

  const error = shouldUseProcessQuery ? valleyQueryError : allTasksQueryError;
  const mainQueryLoading = shouldUseProcessQuery ? valleyQueryLoading : allTasksQueryLoading;
  
  /**
   * Función para refrescar las tareas
   * @description Maneja la lógica de refresco de tareas según el rol del usuario y el estado de los procesos
   * @returns 
   */
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
    } else if (isRelationshipSuperintendent) {
      try {
        const relationshipTasks = await loadRelationshipProcessesTasks();
        setTasksData(relationshipTasks);
        return { data: { tasksByProcess: relationshipTasks } };
      } catch (error) {
        console.error("Error refetching relationship tasks:", error);
        return { data: { tasksByProcess: [] } };
      }
    } else {
      try {
        if (shouldUseProcessQuery) {
          const { data } = await refetchValleyTasks({ fetchPolicy: 'network-only' });
          const newTasks = data?.tasksByProcess || [];
          setTasksData(newTasks);
          if (newTasks.length > 0 && !isCommunicationsRole) {
            const allSubtasks = await Promise.all(
              newTasks.map(async (task: ITask) => {
                const { data: subtaskData } = await getSubtasks({
                  variables: { id: task.id },
                });
                return subtaskData?.taskSubtasks || [];
              })
            );
            const flattenedSubtasks = allSubtasks.flat();
            setSubtasks(flattenedSubtasks);
          } else {
            setSubtasks([]);
          }
          if (newTasks.length > 0) {
            const processedTasks = await processTasksWithDetails(newTasks);
            setDetailedTasks(processedTasks);
          } else {
            setDetailedTasks([]);
          }
          return { data: { tasksByProcess: newTasks } };
        } else {
          const { data } = await refetchAllTasks({ fetchPolicy: 'network-only' });
          const newTasks = data?.tasks || [];
          setTasksData(newTasks);
          if (newTasks.length > 0 && !isCommunicationsRole) {
            const allSubtasks = await Promise.all(
              newTasks.map(async (task: ITask) => {
                const { data: subtaskData } = await getSubtasks({
                  variables: { id: task.id },
                });
                return subtaskData?.taskSubtasks || [];
              })
            );
            const flattenedSubtasks = allSubtasks.flat();
            setSubtasks(flattenedSubtasks);
          } else {
            setSubtasks([]);
          }
          if (newTasks.length > 0) {
            const processedTasks = await processTasksWithDetails(newTasks);
            setDetailedTasks(processedTasks);
          } else {
            setDetailedTasks([]);
          }
          return { data: { tasksByProcess: newTasks } };
        }
      } catch (error) {
        console.error("Error refetching data:", error);
        setTasksData([]);
        setDetailedTasks([]);
        setSubtasks([]);
        return { data: { tasksByProcess: [] } };
      }
    }
  };
  
  /**
   * Función para actualizar los detalles de una tarea después de un cambio en sus subtareas
   * @description Actualiza los detalles de una tarea específica cuando sus subtareas han cambiado
   * @param taskId ID de la tarea cuyos detalles deben actualizarse
   * @returns Promise<boolean> que indica si la actualización fue exitosa
   */
  const updateTaskDetailsAfterSubtaskChange = async (taskId: string) => {
      try {
          const { data: subtaskData } = await getSubtasks({
              variables: { id: taskId },
          });
          
          const updatedSubtasks = subtaskData?.taskSubtasks || [];
          
          setSubtasks(prev => {
              const filteredSubtasks = prev.filter(subtask => subtask.taskId !== taskId);
              return [...filteredSubtasks, ...updatedSubtasks];
          });
          
          const affectedTask = tasks.find((task: ITask) => task.id === taskId);
          
          if (affectedTask) {
              const updatedTask = await processTasksWithDetails([affectedTask]);
              
              setDetailedTasks(prev => {
                  const updatedTasks = prev.map(task => 
                      task.id === taskId ? updatedTask[0] : task
                  );
                  return updatedTasks;
              });
          }
          
          return true;
      } catch (error) {
          console.error("Error updating task details after subtask change:", error);
          return false;
      }
  };
  
  const states = taskStateData?.taskStatuses || [];
  const taskState = states.map((s: ITaskStatus) => s.name);

  const loading = mainQueryLoading || isLoadingSubtasks || isLoadingTaskDetails || 
                  isInitialLoad || allProcessQueryLoading || loadingCommunicationTasks ||
                  loadingRelationshipTasks;


  /**
   * Función para cargar las tareas de los procesos de comunicación al inicio
   * @description Carga las tareas de los procesos de comunicación al inicio si el usuario es superintendente de comunicación o encargado de comunicaciones
   */
  useEffect(() => {
    const loadInitialCommunicationTasks = async () => {
      if (isCommunicationsRole) {
        try {
          setLoadingCommunicationTasks(true);
          const communicationTasks = await loadCommunicationProcessesTasks();
          setTasksData(communicationTasks);
          
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

  /**
  * Función para cargar las tareas de los procesos de relación al inicio
  * @description Carga las tareas de los procesos de relación al inicio si el usuario es superintendente de relación
  */
  const loadInitialRelationshipTasks = async () => {
      if (isRelationshipSuperintendent) {
        try {
          setLoadingRelationshipTasks(true);
          const relationshipTasks = await loadRelationshipProcessesTasks();
          setTasksData(relationshipTasks);
          
          if (relationshipTasks.length > 0) {
            setIsLoadingSubtasks(true);
            try {
              const allSubtasks = await Promise.all(
                relationshipTasks.map(async (task: ITask) => {
                  const { data: subtaskData } = await getSubtasks({
                    variables: { id: task.id },
                  });
                  return subtaskData?.taskSubtasks || [];
                })
              );
              const flattenedSubtasks = allSubtasks.flat();
              setSubtasks(flattenedSubtasks);
            } catch (error) {
              console.error("Error fetching subtasks for relationship tasks:", error);
            } finally {
              setIsLoadingSubtasks(false);
            }
          }
        } catch (error) {
          console.error("Error loading initial relationship tasks:", error);
        } finally {
          setLoadingRelationshipTasks(false);
        }
      }
    };

    loadInitialCommunicationTasks();
    loadInitialRelationshipTasks();
  }, [isCommunicationsRole, isRelationshipSuperintendent]);

  /**
   * Hook para manejar el estado de las tareas
   * @description Inicializa el estado de las tareas y subtareas, y configura los efectos secundarios para cargar los datos
   */
  useEffect(() => {
    if (isLocalEdit) return; // No sobrescribas si es edición local
    let processedTasks = shouldUseProcessQuery 
      ? (processData?.tasksByProcess || []) 
      : (allTasksData?.tasks || []);
    // Aplica siempre el filtro activo y el proceso seleccionado
    if (activeFilter) {
      processedTasks = processedTasks.filter((task: ITaskDetails) => task.status?.name === activeFilter);
    }
    if (selectedProcessId) {
      processedTasks = processedTasks.filter((task: ITaskDetails) => task.processId === selectedProcessId);
    }
    setTasksData(processedTasks);
    setDetailedTasks(processedTasks);
  }, [processData, allTasksData, shouldUseProcessQuery, isCommunicationsRole, activeFilter, selectedProcessId, isLocalEdit]);

  /**
   * Función para obtener las tareas filtradas por estado
   * @description Maneja la obtención de tareas filtradas por estado utilizando la consulta GraphQL o filtrando localmente
   * @param statusId ID del estado de la tarea
   * @returns 
   */
  const handleGetTasksByStatus = async (statusId: number) => {
    try {
      setIsLoadingTaskDetails(true);
      
      if (isCommunicationsRole || isRelationshipSuperintendent) {
        return tasksData.filter(task => task.status?.id === statusId);
      } else if (shouldUseProcessQuery) {
        const { data } = await getTasksByStatus({
          variables: { processId: getCurrentProcessId(userRole), statusId },
        });
        return data?.tasksByProcessAndStatus || [];
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
      if (task.finishedDate && task.endDate) {
        const finish = new Date(task.finishedDate);
        const diffTime = end.getTime() - finish.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (isNaN(diffDays)) {
          return "-";
        }
        return diffDays;
      }
      return 0;
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
    if (subtask.status.name === "Completada") {
      const finishDate = new Date(subtask.finalDate);
      const diffTime = end.getTime() - finishDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (isNaN(diffDays) || !subtask.finalDate ) {
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
        
        const expense = task.id ? await valleyTaskForm.handleGetTaskExpenses(task.id) : null;

        const startDate = associatedSubtasks.length
          ? new Date(Math.min(...associatedSubtasks.map((subtask) => new Date(subtask.startDate).getTime())))
          : null;
      
        const endDate = associatedSubtasks.length
          ? new Date(Math.max(...associatedSubtasks.map((subtask) => new Date(subtask.endDate).getTime())))
          : null;
      
        const allSubtasksHaveFinalDate = associatedSubtasks.length > 0 && 
          associatedSubtasks.every(subtask => 
            subtask.finalDate && 
            subtask.finalDate !== null && 
            subtask.finalDate !== undefined && 
            !isNaN(new Date(subtask.finalDate).getTime())
          );
        
        let finishDate = null;
        
        if (allSubtasksHaveFinalDate) {
          const validFinalDates = associatedSubtasks
            .map(subtask => new Date(subtask.finalDate).getTime());
          
          finishDate = validFinalDates.length > 0
            ? new Date(Math.max(...validFinalDates))
            : null;
        }
      
        return {
          ...task,
          budget: budget || 0,  
          expense: expense || 0,
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
  }, [tasks, mainQueryLoading, isLoadingSubtasks, loadingCommunicationTasks, subTasks]);

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
          const communicationTasks = await loadCommunicationProcessesTasks();
          setTasksData(communicationTasks);
          const detailedTasks = await processTasksWithDetails(communicationTasks);
          setDetailedTasks(detailedTasks);
          return detailedTasks;
        } else {
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
        const { data } = await getTasksByProcess({
          variables: { processId },
        });
        
        const filteredTasks = data?.tasksByProcess || [];
        const detailedFilteredTasks = await processTasksWithDetails(filteredTasks);
        setDetailedTasks(detailedFilteredTasks); 
        return detailedFilteredTasks; 
      } else {
        // Forzar refetch real al backend cuando es 'Todos los procesos'
        await refetch();
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

  useEffect(() => {
    if (!isLocalEdit) {
      // Forzar refetch real y aplicar filtro al salir del modo edición local
      refetch().then(() => {
        // Si hay un filtro activo, volver a aplicarlo
        if (activeFilter) {
          handleFilterClick(activeFilter);
        }
      });
    }
  }, [isLocalEdit]);

  return {
    data: unifiedData,
    loading,
    error,
    subTasks,
    setSubtasks,
    detailedTasks,
    setDetailedTasks,
    states,
    taskState,
    activeFilter,
    setActiveFilter,
    tasksData,
    setTasksData,
    allProcesses,
    isCommunicationsRole,
    refetch,
    updateTaskDetailsAfterSubtaskChange,
    handleFilterByProcess,
    getRemainingDays,
    getRemainingSubtaskDays,
    formatDate,
    handleFilterClick,
  };
};