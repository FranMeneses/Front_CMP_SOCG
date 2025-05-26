import { GET_VALLEY_SUBTASKS } from "@/app/api/subtasks";
import { ISubtask } from "@/app/models/ISubtasks";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useState, useEffect, useMemo } from "react";
import { useHooks } from "../../hooks/useHooks";
import { GET_TASK } from "@/app/api/tasks";

export function useSchedule() {
  const { currentValleyId } = useHooks();

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true); 
  
  const { data, loading: queryLoading, error } = useQuery(GET_VALLEY_SUBTASKS, {
    variables: { valleyId: currentValleyId },
    skip: !currentValleyId,
  });
  
  const [subTasks, setSubtasks] = useState<ISubtask[]>([]);
  const [processingTasks, setProcessingTasks] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  /**
   * Procesa los datos de subtareas obtenidos de la consulta GraphQL.
   */
  useEffect(() => {
    const processData = async () => {
      if (data?.valleySubtasks) {
        setProcessingTasks(true); 
        
        setSubtasks(data.valleySubtasks);
        
        setProcessingTasks(false); 
      } else if (error) {
        console.error("Error fetching subtasks:", error);
        setProcessingTasks(false);
      }
    };

    if (!queryLoading && data) {
      processData();
    }
  }, [data, error, queryLoading]);

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
   * Mapea las subtareas a un formato adecuado para el gráfico de Gantt.
   * Convierte las fechas a formato UTC y asigna colores basados en el progreso.
   */
  const subtasks = useMemo(() => {
    return subTasks.map((subtask) => {
      const [startDateStr] = subtask.startDate.split('T'); 
      const [endDateStr] = subtask.endDate.split('T');     
      
      const startUTC = `${startDateStr}T12:00:00.000Z`; 
      const endUTC = `${endDateStr}T12:00:00.000Z`;

      return {
        id: subtask.id,
        name: subtask.name,
        start: startUTC,
        end: endUTC,
        taskId: subtask.taskId,
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
  };
}