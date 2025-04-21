'use client';
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import LoadingSpinner from "@/components/LoadinSpinner";
import { useState, useEffect } from "react";
import { Modal } from "@/components/TaskModal";
import { Plus } from 'lucide-react';
import TasksTable from "./components/TasksTable";
import { tasksMock } from "../../../../mocks/tasksMock";

export default function Planification() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="h-screen w-screen overflow-x-hidden">
            <Header toggleSidebar={toggleSidebar} />
            <div className={`grid h-full text-black bg-white ${isSidebarOpen ? 'md:grid-cols-[220px_1fr]' : 'grid-cols-1'}`}>
                {isSidebarOpen && ( 
                    <aside className="border-r md:block h-full">
                        <Sidebar />
                    </aside>
                )}
                <main className="p-4 h-full">
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
                onClose={() => setIsPopupOpen(false)}
                onSave={handleSaveTask}
            />
        </div>
    );
}