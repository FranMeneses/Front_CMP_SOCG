'use client'

import GanttChart from "@/components/Charts/Gantt/GanttChart"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { useEffect, useState } from "react"
import LoadingSpinner from "@/components/LoadinSpinner"

export default function Schedule() {
    const [loading, setLoading] = useState<boolean>(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); 

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
            <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen}/>
            {loading ? 
            (
                <div className="flex items-center justify-center">
                    <LoadingSpinner/>
                </div>
            ) 
            :
            (
            <div className={`grid h-screen overflow-hidden ${isSidebarOpen ? "grid-cols-[220px_1fr]" : "grid-cols-1"}`} style={{height: "calc(100vh - 5rem)"}} >
              {isSidebarOpen && (
                <aside
                  className={`border-r h-full ${
                    isSidebarOpen
                      ? "fixed top-[5rem] left-0 w-full h-[calc(100vh-5rem)] bg-white z-2000 sm:top-0 sm:left-0 sm:w-[220px] sm:relative sm:h-auto sm:bg-transparent"
                      : ""
                  }`}
                >
                  <Sidebar />
                </aside>
              )}
              <main className="flex-1 p-4 overflow-y-auto">
                    <div className="p-4 pb-2">
                        <h1 className="text-2xl font-bold">Programación de iniciativas</h1>
                    </div>
                    <div className="flex-1 px-4 pb-4 h-full">
                        <GanttChart/>
                    </div>
                </main>
            </div>
            )}
        </div>
    );
}