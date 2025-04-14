'use client'

import GanttChart from "@/components/GanttChart"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { ganttChartDataMock } from "../../../mocks/chartDataSummaryMock"
import { useState } from "react"
import { Modal } from "@/components/TaskModal"

export default function Schedule() {

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleAddTask = () => {
        setIsPopupOpen(true);
    };

    const handleSaveTask = (task: { title: string; description: string }) => {
        console.log('Nueva tarea:', task);
        setIsPopupOpen(false); // Cierra el modal después de guardar
    };

    return (
        <div className="overflow-x-hidden">
            <Header />
            <div className={`grid flex-1 md:grid-cols-[220px_1fr] text-black bg-white ${isPopupOpen ? 'blur-sm' : ''}`}>
                <aside className="hidden border-r md:block h-full">
                    <Sidebar />
                </aside>
                <main className="flex-1 p-4">
                    <div>
                        <div className="flex flex-row justify-between">
                            <h1 className="text-2xl font-bold mb-4">Programación de iniciativas</h1>
                            <button
                                onClick={handleAddTask}
                                className="px-4 py-2 bg-[#2771CC] text-white rounded mb-4 cursor-pointer hover:bg-[#08203d] ease-in-out duration-400"
                            >
                                Añadir Tarea
                            </button>
                        </div>
                        <GanttChart data={ganttChartDataMock} />
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