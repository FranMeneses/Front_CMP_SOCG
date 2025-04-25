import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_TASK } from "@/app/api/planification";
import { Valleys } from "@/constants/valleys";
import { Faenas } from "@/constants/faenas";

export const usePlanification = () => {
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [loadingTasks, setLoadingTasks] = useState<boolean>(true);
    const [tableOption, setTableOption] = useState<string>("Tareas");
    const [createTask, { data, loading, error }] = useMutation(CREATE_TASK);

    const handleAddTask = () => {
        setIsPopupOpen(true);
    };

    const handleSave = async (task: { title: string; description: string; type: string; valley: string; faena: string }) => {
        if (task.type === "Tarea") {
            try {
                const { data } = await createTask({
                    variables: {
                        input: {
                            name: task.title,
                            description: task.description,
                            valleyId: Valleys.indexOf(task.valley) + 1,
                            faenaId: Faenas.indexOf(task.faena) + 1,
                            statusId: 1,
                        },
                    },
                });
                console.log("Task created successfully:", data.createTask);
                // setTasks((prevTasks) => [...prevTasks, data.createTask]);
            } catch (err) {
                console.error("Error creating task:", err);
            }
        } else {
            // Handle subtarea creation logic here
        }
        setIsPopupOpen(false);
    };

    const handleonTaskClick = (taskId: string) => {
        setSelectedTaskId((prev) => (prev === taskId ? null : taskId));
    };

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoadingTasks(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return {
        isPopupOpen,
        setIsPopupOpen,
        selectedTaskId,
        setSelectedTaskId,
        isSidebarOpen,
        setIsSidebarOpen,
        loadingTasks,
        setLoadingTasks,
        tableOption,
        setTableOption,
        handleAddTask,
        handleSave,
        handleonTaskClick,
        toggleSidebar,
        createTask,
        data,
        loading,
        error,
    };
};