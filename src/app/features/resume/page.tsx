'use client';
import { useHooks } from "../hooks/useHooks";
import { useState } from "react";
import ResumeCommunications from "./communications/page";
import ResumeRelationship from "./relationship/page";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function Resume() {
    const { userRole } = useHooks();
    const [activeView, setActiveView] = useState("relationship");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    
    if (userRole === "superintendente de comunicaciones") {
        return (
            <div className="h-screen flex flex-col overflow-hidden">
                <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
                <div className={`flex flex-1 overflow-hidden ${isSidebarOpen ? "" : ""}`}>
                    {isSidebarOpen && (
                        <aside className="w-56 border-r bg-white flex-shrink-0">
                            <Sidebar userRole={userRole} onNavClick={toggleSidebar} />
                        </aside>
                    )}
                    <main className="flex-1 p-4 overflow-y-auto bg-[#F2F2F2] font-[Helvetica] min-w-0">
                        <ResumeCommunications />
                    </main>
                </div>
            </div>
        );
    }

    else if (userRole === "superintendente de relacionamiento") {
        return (
            <div className="h-screen flex flex-col overflow-hidden">
                <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
                <div className={`flex flex-1 overflow-hidden ${isSidebarOpen ? "" : ""}`}>
                    {isSidebarOpen && (
                        <aside className="w-56 border-r bg-white flex-shrink-0">
                            <Sidebar userRole={userRole} onNavClick={toggleSidebar} />
                        </aside>
                    )}
                    <main className="flex-1 p-4 overflow-y-auto bg-[#F2F2F2] font-[Helvetica] min-w-0">
                        <ResumeRelationship />
                    </main>
                </div>
            </div>
        );
    }

    else if (userRole === "gerente" || userRole === "encargado cumplimiento") {
        return (
            <div className="h-screen flex flex-col overflow-hidden">
                <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
                <div className={`flex flex-1 overflow-hidden ${isSidebarOpen ? "" : ""}`}>
                    {isSidebarOpen && (
                        <aside className="w-56 border-r bg-white flex-shrink-0">
                            <Sidebar userRole={userRole} onNavClick={toggleSidebar} />
                        </aside>
                    )}
                    <main className="flex-1 p-4 overflow-y-auto bg-[#F2F2F2] font-[Helvetica] min-w-0">
                        <div className="flex justify-start space-x-4 mb-4 flex-shrink-0">
                            <Button
                                onClick={() => setActiveView("relationship")}
                                className={`px-4 py-2 rounded-md text-lg ${
                                    activeView === "relationship" 
                                    ? "bg-[#0068D1] text-white text-lg hover:bg-[#0068D1]" 
                                    : "bg-gray-200 text-gray-800 hover:bg-[#0056b3] hover:text-white hover:text-lg cursor-pointer"
                                }`}
                            >
                                Resumen Relacionamiento
                            </Button>
                            <Button
                                onClick={() => setActiveView("communications")}
                                className={`px-4 py-2 rounded-md text-lg ${
                                    activeView === "communications" 
                                    ? "bg-[#0068D1] text-white text-lg hover:bg-[#0068D1]" 
                                    : "bg-gray-200 text-gray-800 hover:bg-[#0056b3] hover:text-white hover:text-lg cursor-pointer"
                                }`}
                            >
                                Resumen Comunicaciones
                            </Button>
                        </div>
                        
                        <div className="min-w-0">
                            {activeView === "relationship" ? <ResumeRelationship /> : <ResumeCommunications />}
                        </div>
                    </main>
                </div>
            </div>
        );
    }
}