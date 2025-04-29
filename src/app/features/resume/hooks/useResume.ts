import { useState, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_TASKS } from "@/app/api/tasks";
import { GET_TASK_SUBTASKS } from "@/app/api/tasks";
import { ISubtask } from "@/app/models/ITasks";

export function useResume() {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [selectedLegend, setSelectedLegend] = useState<string | null>(null);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [subtasks, setSubtasks] = useState<ISubtask[]>([]);
    const { data, loading, error } = useQuery(GET_TASKS);
    const [getSubtasks, { data: subtasksData, loading: subtasksLoading } ]= useLazyQuery(GET_TASK_SUBTASKS);

    const handleLegendClick = (legend: string) => {
        setSelectedLegend((prev) => (prev === legend ? null : legend));
    };

    const handleTaskClick = async (taskId: string) => {
        if (selectedTaskId === taskId) {
            setSelectedTaskId(null);
            setSubtasks([]);
        } else {
            setSelectedTaskId(taskId);
            await handleGetSubtasks(taskId);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const handleGetSubtasks = async (selectedTaskId: string) => {
        try {
            console.log("Fetching subtasks for task ID:", selectedTaskId);
            const { data } = await getSubtasks({
                variables: { id: selectedTaskId }, 
            });
            if (data && data.taskSubtasks) {
                console.log("Subtasks data:", data.taskSubtasks);
                setSubtasks(data.taskSubtasks);
            } else {
                console.warn("No subtasks found for task ID:", selectedTaskId);
                setSubtasks([]);
            }
        } catch (error) {
            setSubtasks([]);
            console.error("Error fetching subtasks:", error);
        }
    };

    const calculateRemainingDays = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const formatDate = (isoDate: string): string => {
        const date = new Date(isoDate);
    
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); 
        const day = String(date.getDate() +1 ).padStart(2, "0");
    
        return `${day}-${month}-${year}`; 
    };

    const getColor = (percentage: number) => {
        if (percentage === 100) return "bg-green-500";
        if (percentage > 30 && percentage < 100) return "bg-yellow-500";
        return "bg-red-500";
    };

    return {
        loading,
        data,
        error,
        isSidebarOpen,
        selectedLegend,
        selectedTaskId,
        subtasks,
        subtasksLoading,
        handleLegendClick,
        handleTaskClick,
        toggleSidebar,
        calculateRemainingDays,
        formatDate,
        getColor,
    };
}