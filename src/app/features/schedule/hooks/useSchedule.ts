import { GET_TASK_SUBTASKS } from "@/app/api/tasks";
import { ISubtask } from "@/app/models/ISubtasks";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useState, useEffect, useMemo } from "react";
import { useHooks } from "../../hooks/useHooks";
import { GET_TASK, GET_TASKS_BY_PROCESS } from "@/app/api/tasks";
import { ITask } from "@/app/models/ITasks";

export function useSchedule() {
  const { currentProcess } = useHooks();

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [getTaskSubtasks] = useLazyQuery(GET_TASK_SUBTASKS, {
    fetchPolicy: "network-only",
  });
  const [isLoading, setIsLoading] = useState(true); 
  
  const { data, loading: queryLoading, error } = useQuery(GET_TASKS_BY_PROCESS, {
    variables: { processId: currentProcess?.id },
    skip: !currentProcess,
  });

  const [getTask] = useLazyQuery(GET_TASK, {
    fetchPolicy: "network-only",
  });
  
  const [subTasks, setSubtasks] = useState<ISubtask[]>([]);
  const [processingTasks, setProcessingTasks] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  /**
   * Procesa los datos de subtareas obtenidos de la consulta GraphQL.
   * Versión optimizada que hace las consultas en paralelo.
   */
  useEffect(() => {
    const processData = async () => {
      if (data?.tasksByProcess && data.tasksByProcess.length > 0) {
        setProcessingTasks(true);
        
        try {
          const subtaskPromises = data.tasksByProcess.map(async (task:ITask) => {
            try {
              const { data: subtaskData } = await getTaskSubtasks({
                variables: { id: task.id }
              });
              return subtaskData?.taskSubtasks || [];
            } catch (error) {
              console.error(`Error fetching subtasks for task ${task.id}:`, error);
              return [];
            }
          });
          
          const subtaskArrays = await Promise.all(subtaskPromises);
          
          const allSubtasks = subtaskArrays.flat();

          setSubtasks(allSubtasks);
          
        } catch (error) {
          console.error("Error processing tasks:", error);
        } finally {
          setProcessingTasks(false);
        }
      } else if (error) {
        console.error("Error fetching tasks:", error);
        setProcessingTasks(false);
      } else {
        setSubtasks([]);
        setProcessingTasks(false);
      }
    };

    if (!queryLoading && data) {
      processData();
    }
  }, [data, error, queryLoading, getTaskSubtasks]);

  /**
   * Actualiza el estado de carga basado en el estado de la consulta y las tareas en procesamiento.
   */
  useEffect(() => {
    setIsLoading(queryLoading || processingTasks);
  }, [queryLoading, processingTasks]);
  
  /**
   * Función para obtener el color basado en el porcentaje de progreso de la tarea.
   * @param percentage - El porcentaje de progreso de la tarea.
   * @returns Color en formato RGBA basado en el porcentaje.
   */
  const getColor = (percentage: number) => {
    if (percentage === 100) return 'rgba(84, 184, 126, 0.5)';
    if (percentage > 30 && percentage < 100) return 'rgba(230, 183, 55, 0.5)'; 
    if (percentage === 0) return 'rgba(145, 154, 255, 0.6)';
    return 'rgba(230, 76, 55, 0.5)'; 
  };

  /**
   * Función para obtener los detalles de una tarea específica.
   * @param taskId - ID de la tarea a obtener.
   * @returns Detalles de la tarea o null si no se encuentra.
   */
  const getTaskDetails = async (taskId: string) => {
    try {
      const { data } = await getTask({ variables: { id: taskId } });
      return data?.task || null;
    }
    catch (error) {
      console.error("Error fetching task details:", error);
      return null;
    }
  }

  /**
   * Ajusta las fechas para asegurar que las tareas de 1 día se muestren correctamente
   * @param startDate - Fecha de inicio en formato YYYY-MM-DD
   * @param endDate - Fecha de fin en formato YYYY-MM-DD
   * @returns Objeto con fechas ajustadas
   */
  const adjustDatesForGantt = (startDate: string, endDate: string) => {
    let adjustedEndDate = endDate;
    
    // Si la tarea es de 1 día, extender un día para visualización
    if (startDate === endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      adjustedEndDate = end.toISOString().split('T')[0];
    }
    
    return {
      start: startDate,
      end: adjustedEndDate
    };
  };

  /**
   * Mapea las subtareas a un formato adecuado para el gráfico de Gantt.
   * Convierte las fechas a formato YYYY-MM-DD y ajusta tareas de 1 día.
   */
  const subtasks = useMemo(() => {
    return subTasks.map((subtask) => {
      const [startDateStr] = subtask.startDate.split('T'); 
      const [endDateStr] = subtask.endDate.split('T');     

      const { start, end } = adjustDatesForGantt(startDateStr, endDateStr);

      return {
        id: subtask.id,
        name: subtask.name,
        start,
        end,
        taskId: subtask.taskId,
        state: subtask.status.name,
        progress: subtask.status.percentage,
        color: getColor(subtask.status.percentage),
        color_progress: getColor(subtask.status.percentage),
      };
    });
  }, [subTasks]);


  return {
    loading: isLoading,
    isSidebarOpen,
    toggleSidebar,
    getColor,
    subtasks,
    getTaskDetails 
  };
}