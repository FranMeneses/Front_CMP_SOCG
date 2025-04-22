'use client'

import GanttChart from "@/components/Charts/Gantt/GanttChart"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { useEffect, useState } from "react"
import LoadingSpinner from "@/components/LoadinSpinner"

export default function Schedule() {
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

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
        <div className="overflow-x-hidden max-h-screen w-full">
            <Header toggleSidebar={toggleSidebar}/>
            {loading ? 
            (
                <div className="flex items-center justify-center h-screen">
                    <LoadingSpinner/>
                </div>
            ) 
            :
            (
            <div className={`grid h-full text-black bg-white ${isSidebarOpen ? 'md:grid-cols-[220px_1fr]' : 'grid-cols-1'}`}>
                {isSidebarOpen && ( 
                  <aside className="border-r md:block h-full">
                    <Sidebar />
                  </aside>
                )}
                <main className="flex flex-col overflow-hidden">
                    <div className="p-4 pb-2">
                        <h1 className="text-2xl font-bold">Programación de iniciativas</h1>
                    </div>
                    <div className="flex-1 px-4 pb-4">
                        <GanttChart/>
                    </div>
                </main>
            </div>
            )}
        </div>
    );
}