import { GET_SUBTASKS } from "@/app/api/subtasks";
import { ISubtask } from "@/app/models/ISubtasks";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";

export function useSchedule() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const {data, loading, error} = useQuery(GET_SUBTASKS);
  const [subTasks, setSubtasks] = useState<ISubtask[]>([]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (data?.subtasks) {
        setSubtasks(data.subtasks);
    } else if (error) {
      console.error("Error fetching subtasks:", error);
    }
  }, [data, error]);
  
  const getColor = (percentage: number) => {
    if (percentage === 100) return 'rgba(84, 184, 126, 0.5)';
    if (percentage > 30 && percentage < 100) return 'rgba(230, 183, 55, 0.5)'; 
    return 'rgba(230, 76, 55, 0.5)'; 
  };

    const tasks = subTasks.map((task) => ({
      id: task.id,
      name: task.name,
      start: new Date(task.startDate).toISOString(),
      end: new Date(task.endDate).toISOString(),
      progress: task.status.percentage,
      color: getColor(task.status.percentage),
      color_progress: getColor(task.status.percentage),
    }));

  return {
    loading,
    isSidebarOpen,
    toggleSidebar,
    getColor,
    tasks
  };
}