'use client'

import GanttChart from "@/components/Charts/GanttChart/GanttChart"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { ganttChartDataMock } from "../../../../mocks/chartDataSummaryMock"
import { useEffect, useState } from "react"
import LoadingSpinner from "@/components/LoadinSpinner"

export default function Schedule() {

    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); 

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
                <main className="flex-1 p-4">
                    <div>
                        <div className="flex flex-row justify-between">
                            <h1 className="text-2xl font-bold mb-4">Programación de iniciativas</h1>
                        </div>
                        <GanttChart data={ganttChartDataMock} />
                    </div>
                </main>
            </div>
            )}
        </div>
    );
}