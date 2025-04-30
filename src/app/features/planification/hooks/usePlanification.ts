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
    const [subTasks, setSubtasks] = useState<any[]>([]);
    const [createTask] = useMutation(CREATE_TASK);
    const {data,loading,error} = useQuery(GET_INFO_TASKS);
    const [getSubtasks] = useLazyQuery(GET_TASK_SUBTASKS);



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
            } catch (err) {
                console.error("Error creating task:", err);
            }
        } else {
            // Handle subtarea creation logic here
        }
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


    return {
        isPopupOpen,
        setIsPopupOpen,
        selectedTaskId,
        setSelectedTaskId,
        isSidebarOpen,
        setIsSidebarOpen,
        tableOption,
        setTableOption,
        handleAddTask,
        handleSave,
        handleOnTaskClick,
        toggleSidebar,
        createTask,
        data,
        loading,
        error,
        subTasks
    };
};