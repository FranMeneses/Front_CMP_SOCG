import { useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_TASKS } from "@/app/api/tasks";
import { GET_TASK_SUBTASKS } from "@/app/api/tasks";
import { ISubtask } from "@/app/models/ISubtasks";

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

    return {
        loading,
        data,
        isSidebarOpen,
        selectedLegend,
        selectedTaskId,
        subtasks,
        subtasksLoading,
        handleLegendClick,
        handleTaskClick,
        toggleSidebar,
    };
}