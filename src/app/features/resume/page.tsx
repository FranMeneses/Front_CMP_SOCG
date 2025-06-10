'use client';
import { useHooks } from "../hooks/useHooks";
import { useState } from "react";
import ResumeCommunications from "./communications/page";
import ResumeRelationship from "./relationship/page";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

export default function Resume() {
    const { userRole } = useHooks();
    const [activeView, setActiveView] = useState("relationship");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    
    if (userRole === "superintendente de comunicaciones") {
        return (
            <div className="overflow-x-hidden">
                <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
                <div className={`grid h-screen overflow-hidden ${isSidebarOpen ? "grid-cols-[220px_1fr]" : "grid-cols-1"}`} 
                     style={{ height: "calc(100vh - 5rem)" }}>
                    {isSidebarOpen && (
                        <aside className={`border-r h-full ${
                            isSidebarOpen
                            ? "fixed top-[5rem] left-0 w-full h-[calc(100vh-5rem)] bg-white z-2000 sm:top-0 sm:left-0 sm:w-[220px] sm:relative sm:h-auto sm:bg-transparent"
                            : ""
                        }`}>
                            <Sidebar userRole={userRole} onNavClick={toggleSidebar} />
                        </aside>
                    )}
                    <main className="flex-1 p-6 overflow-y-auto bg-gray-50 font-[Helvetica]">
                        <ResumeCommunications />
                    </main>
                </div>
            </div>
        );
    }

    else if (userRole === "superintendente de relacionamiento") {
        return (
            <div className="overflow-x-hidden">
                <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
                <div className={`grid h-screen overflow-hidden ${isSidebarOpen ? "grid-cols-[220px_1fr]" : "grid-cols-1"}`} 
                     style={{ height: "calc(100vh - 5rem)" }}>
                    {isSidebarOpen && (
                        <aside className={`border-r h-full ${
                            isSidebarOpen
                            ? "fixed top-[5rem] left-0 w-full h-[calc(100vh-5rem)] bg-white z-2000 sm:top-0 sm:left-0 sm:w-[220px] sm:relative sm:h-auto sm:bg-transparent"
                            : ""
                        }`}>
                            <Sidebar userRole={userRole} onNavClick={toggleSidebar} />
                        </aside>
                    )}
                    <main className="flex-1 p-6 overflow-y-auto bg-gray-50 font-[Helvetica]">
                        <ResumeRelationship />
                    </main>
                </div>
            </div>
        );
    }

    else if (userRole === "gerente" || userRole === "encargado cumplimiento") {
        return (
            <div className="overflow-x-hidden">
                <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
                <div className={`grid h-screen overflow-hidden ${isSidebarOpen ? "grid-cols-[220px_1fr]" : "grid-cols-1"}`} 
                     style={{ height: "calc(100vh - 5rem)" }}>
                    {isSidebarOpen && (
                        <aside className={`border-r h-full ${
                            isSidebarOpen
                            ? "fixed top-[5rem] left-0 w-full h-[calc(100vh-5rem)] bg-white z-2000 sm:top-0 sm:left-0 sm:w-[220px] sm:relative sm:h-auto sm:bg-transparent"
                            : ""
                        }`}>
                            <Sidebar userRole={userRole} onNavClick={toggleSidebar} />
                        </aside>
                    )}
                    <main className="flex-1 p-6 overflow-y-auto bg-gray-50 font-[Helvetica]">
                        <div className="flex justify-start space-x-4 mb-4">
                            <Button
                                onClick={() => setActiveView("relationship")}
                                className={`px-4 py-2 rounded-md ${
                                    activeView === "relationship" 
                                    ? "bg-[#367acd] text-white hover:bg-[#08203d]" 
                                    : "bg-gray-200 text-gray-800 hover:bg-[#08203d]  hover:text-white cursor-pointer"
                                }`}
                            >
                                Resumen Relacionamiento
                            </Button>
                            <Button
                                onClick={() => setActiveView("communications")}
                                className={`px-4 py-2 rounded-md ${
                                    activeView === "communications" 
                                    ? "bg-[#367acd] text-white hover:bg-[#08203d]" 
                                    : "bg-gray-200 text-gray-800 hover:bg-[#08203d] hover:text-white cursor-pointer"
                                }`}
                            >
                                Resumen Comunicaciones
                            </Button>
                        </div>
                        
                        {activeView === "relationship" ? <ResumeRelationship /> : <ResumeCommunications />}
                    </main>
                </div>
            </div>
        );
    }
}