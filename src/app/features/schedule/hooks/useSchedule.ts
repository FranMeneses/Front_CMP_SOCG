import { GET_SUBTASKS, GET_VALLEY_SUBTASKS } from "@/app/api/subtasks";
import { ISubtask } from "@/app/models/ISubtasks";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { useHooks } from "../../hooks/useHooks";

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

  useEffect(() => {
    setIsLoading(queryLoading || processingTasks);
  }, [queryLoading, processingTasks]);
  
  const getColor = (percentage: number) => {
    if (percentage === 100) return 'rgba(84, 184, 126, 0.5)';
    if (percentage > 30 && percentage < 100) return 'rgba(230, 183, 55, 0.5)'; 
    if (percentage === 0) return 'rgba(145, 154, 255, 0.6)';
    return 'rgba(230, 76, 55, 0.5)'; 
  };

  const tasks = subTasks.map((task) => {
    const [startDateStr] = task.startDate.split('T'); 
    const [endDateStr] = task.endDate.split('T');     
    
    const startUTC = `${startDateStr}T12:00:00.000Z`; 
    const endUTC = `${endDateStr}T12:00:00.000Z`;

    return {
      id: task.id,
      name: task.name,
      start: startUTC,
      end: endUTC,
      progress: task.status.percentage,
      color: getColor(task.status.percentage),
      color_progress: getColor(task.status.percentage),
    };
  });

  return {
    loading: isLoading,
    isSidebarOpen,
    toggleSidebar,
    getColor,
    tasks
  };
}