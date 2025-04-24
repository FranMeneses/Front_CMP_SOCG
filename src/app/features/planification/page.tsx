'use client';
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import LoadingSpinner from "@/components/LoadinSpinner";
import { useState, useEffect } from "react";
import { Plus } from 'lucide-react';
import TasksTable from "./components/TasksTable";
import { tasksMock } from "../../../../mocks/tasksMock";
import Modal from "@/components/Modal";
import TaskForm from "./components/TaskForm";
import DropdownMenu from "@/components/Dropdown";
import { Valleys } from "@/constants/valleys";
import { Faenas } from "@/constants/faenas";
import { useMutation } from "@apollo/client";
import { CREATE_TASK } from "@/app/api/planification";

export default function Planification() {
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); 
    const [loadingTasks, setLoadingTasks] = useState<boolean>(true);
    const [tableOption, setTableOption] = useState<string>("Tareas");
    const [createTask, { data, loading, error }] = useMutation(CREATE_TASK);

    const handleAddTask = () => {
        setIsPopupOpen(true);
    };

    const handleSave = async (task: { title: string; description: string, type: string, valley: string, faena:string }) => {
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
            }
            catch (err) {
                console.error("Error creating task:", err);
            }
        }
        else{
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

    return (
        <div className="overflow-x-hidden">
            <Header toggleSidebar={toggleSidebar} />
            {loadingTasks ? (
            <div className="flex items-center justify-center">
                <LoadingSpinner/>
            </div>
            )
            :
            (
            <>
            <div className={`grid h-screen overflow-hidden ${isSidebarOpen ? "grid-cols-[220px_1fr]" : "grid-cols-1"}`} style={{height: "calc(100vh - 5rem)"}} >
                {isSidebarOpen && (
                    <aside
                    className={`border-r h-full ${
                        isSidebarOpen
                        ? "fixed top-[5rem] left-0 w-full h-[calc(100vh-5rem)] bg-white z-2000 sm:top-0 sm:left-0 sm:w-[220px] sm:relative sm:h-auto sm:bg-transparent"
                        : ""
                    }`}
                    >
                        <Sidebar/>
                    </aside>
                )}
                <main className="p-4 h-full overflow-y-auto">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-2xl font-bold">Planificación</h1>
                        <div className="">
                            <div className="ml-4 flex-1">
                                <div className="flex flex-row justify-between items-center mb-4">
                                    <button
                                        onClick={handleAddTask}
                                        className="px-4 py-2 bg-[#2771CC] text-white rounded cursor-pointer hover:bg-[#08203d] ease-in-out duration-400 flex flex-row"
                                    >
                                        <Plus size={25} color="white" />
                                        <span className="ml-2">Añadir</span>
                                    </button>
                                </div>
                                <div className="mb-4 w-full">
                                    <DropdownMenu
                                        items={["Tareas","Subtareas"]}
                                        onSelect={(item) => setTableOption(item)}
                                        buttonText="Tareas"
                                    />
                                </div>
                                <div>
                                    <TasksTable
                                        tasks={tasksMock}
                                        selectedTaskId={selectedTaskId}
                                        onTaskClick={handleonTaskClick}
                                        tableOption={tableOption}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Modal
                isOpen={isPopupOpen}
                children={<TaskForm onSave={handleSave} onCancel={() =>setIsPopupOpen(false)}/>}
                onClose={() => setIsPopupOpen(false)} 
            />
            </>
            )}
        </div>
    );
}