import { useState, useEffect } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { CREATE_TASK, GET_TASK_SUBTASKS } from "@/app/api/tasks";
import { Valleys } from "@/constants/valleys";
import { Faenas } from "@/constants/faenas";
import { GET_INFO_TASKS } from "@/app/api/infoTask";

export const usePlanification = () => {
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [tableOption, setTableOption] = useState<string>("Tareas");
    const [selectedForm, setSelectedForm] = useState<string | null>(null);
    const [subTasks, setSubtasks] = useState<any[]>([]);
    const [createTask] = useMutation(CREATE_TASK);
    const {data,loading,error} = useQuery(GET_INFO_TASKS);
    const [getSubtasks] = useLazyQuery(GET_TASK_SUBTASKS);



    const handleAddTask = () => {
        setIsPopupOpen(true);
    };

    const handleCancel = () => {
        setIsPopupOpen(false);
        setSelectedForm(null);
    }

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
            } catch (err) {
                console.error("Error creating task:", err);
            }
        } else {
            // Handle subtarea creation logic here
        }
        setSelectedForm(null);
        setIsPopupOpen(false);
    };

    const handleOnTaskClick = (taskId: string) => {
        console.log("Task clicked:", taskId);
        setSelectedTaskId((prev) => (prev === taskId ? null : taskId));
    };

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    useEffect(() => {
        const fetchSubtasks = async () => {
            if (data?.infoTasks) {
                try {
                    const allSubtasks = await Promise.all(
                        data.infoTasks.map(async (infoTask: any) => {
                            const { data: subtaskData } = await getSubtasks({
                                variables: { id: infoTask.taskId },
                            });
                            return subtaskData?.taskSubtasks || []; 
                        })
                    );
    
                    const flattenedSubtasks = allSubtasks.flat();
                    console.log("Subtasks fetched successfully:", flattenedSubtasks);
    
                    setSubtasks(flattenedSubtasks);
                } catch (error) {
                    console.error("Error fetching subtasks:", error);
                }
            }
        };
    
        if (!loading && data?.infoTasks) {
            fetchSubtasks();
        }
    }, [data, loading, getSubtasks]);

    const getRemainingDays = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    const formatDate = (isoDate: string): string => {
        const date = new Date(isoDate);
    
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); 
        const day = String(date.getDate() +1 ).padStart(2, "0");
    
        return `${day}-${month}-${year}`; 
    };

    const tasksWithDetails = data?.infoTasks.map((task: any) => {
        const associatedSubtasks = subTasks.filter((subtask) => subtask.taskId === task.taskId);
    
        const totalBudget = associatedSubtasks.reduce((sum, subtask) => sum + (subtask.budget || 0), 0);
    
        const startDate = associatedSubtasks.length
            ? new Date(Math.min(...associatedSubtasks.map((subtask) => new Date(subtask.startDate).getTime())))
            : null;
    
        const endDate = associatedSubtasks.length
            ? new Date(Math.max(...associatedSubtasks.map((subtask) => new Date(subtask.endDate).getTime())))
            : null;
    
        const finishDate = associatedSubtasks.length
            ? new Date(Math.max(...associatedSubtasks.map((subtask) => new Date(subtask.finalDate).getTime())))
            : null;
    
        return {
            ...task,
            budget: totalBudget,
            startDate: startDate ? startDate.toISOString() : null,
            endDate: endDate ? endDate.toISOString() : null,
            finishDate: finishDate ? finishDate.toISOString() : null,
        };
    });

    return {
        setTableOption,
        handleAddTask,
        handleSave,
        handleOnTaskClick,
        toggleSidebar,
        createTask,
        getRemainingDays,
        setIsPopupOpen,
        setSelectedTaskId,
        setIsSidebarOpen,
        setSelectedForm,
        handleCancel,
        formatDate,
        isPopupOpen,
        selectedTaskId,
        isSidebarOpen,
        tableOption,
        data,
        loading,
        error,
        subTasks,
        tasksWithDetails,
        selectedForm,
    };
};