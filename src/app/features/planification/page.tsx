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

export default function Planification() {
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); 
    const [loading, setLoading] = useState<boolean>(true);

    const handleAddTask = () => {
        setIsPopupOpen(true);
    };

    const handleSaveTask = (task: { title: string; description: string }) => {
        console.log('Nueva tarea:', task);
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
            setLoading(false); 
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="overflow-x-hidden">
            <Header toggleSidebar={toggleSidebar} />
            {loading ? (
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
                                <button
                                    onClick={handleAddTask}
                                    className="px-4 py-2 bg-[#2771CC] text-white rounded mb-4 cursor-pointer hover:bg-[#08203d] ease-in-out duration-400 flex flex-row"
                                >
                                    <Plus size={25} color="white" />
                                     <span className="ml-2">Añadir Tarea</span>
                                </button>
                                <div className={`${isSidebarOpen ? 'w-[60%]' : 'w-full'}`}>
                                    <TasksTable
                                        tasks={tasksMock}
                                        selectedTaskId={selectedTaskId}
                                        onTaskClick={handleonTaskClick}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Modal
                isOpen={isPopupOpen}
                children={<TaskForm onSave={handleSaveTask}/>}
                onClose={() => setIsPopupOpen(false)} 
            />
            </>
            )}
        </div>
    );
}