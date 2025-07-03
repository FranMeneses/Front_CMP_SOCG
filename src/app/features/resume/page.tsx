'use client';
import { useState, useMemo, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Chart, registerables } from 'chart.js';
import { useHooks } from "../hooks/useHooks";
import React from "react";

Chart.register(...registerables);

// Lazy load de los componentes pesados
const ResumeCommunicationsLazy = React.lazy(() => import("./communications/page"));
const ResumeRelationshipLazy = React.lazy(() => import("./relationship/page"));

export default function Resume() {
    const [activeView, setActiveView] = useState("relationship");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const { userRole, handleLogout } = useHooks();
    
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    
    // Memoizar el nombre de usuario
    const userName = useMemo(() => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const userObj = JSON.parse(userStr);
                    return userObj.full_name || userObj.name || '';
                } catch {}
            }
        }
        return '';
    }, []);

    const layout = (content: React.ReactNode) => (
        <div className="h-screen flex flex-col overflow-hidden">
            <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} userName={userName} userRole={userRole} />
            <div className={`flex flex-1 overflow-hidden`}>
                {isSidebarOpen && (
                    <aside className="w-56 border-r bg-white flex-shrink-0">
                        <Sidebar userRole={userRole || ""} onNavClick={toggleSidebar} handleLogout={handleLogout}/>
                    </aside>
                )}
                <main className="flex-1 p-4 overflow-y-auto bg-[#F2F2F2] font-[Helvetica] min-w-0">
                    {content}
                </main>
            </div>
        </div>
    );
    
    if (userRole === "Superintendente Comunicaciones") {
        return layout(
            <Suspense fallback={<div>Cargando resumen de comunicaciones...</div>}>
                <ResumeCommunicationsLazy />
            </Suspense>
        );
    }
    
    else if (userRole === "Superintendente Relacionamiento") {
        return layout(
            <Suspense fallback={<div>Cargando resumen de relacionamiento...</div>}>
                <ResumeRelationshipLazy />
            </Suspense>
        );
    }
    
    else if (userRole === "Gerente" || userRole === "Encargado Cumplimiento" || userRole === "Admin") {
        return layout(
            <>
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
                    <Suspense fallback={<div>Cargando resumen...</div>}>
                        {activeView === "relationship" ? <ResumeRelationshipLazy /> : <ResumeCommunicationsLazy />}
                    </Suspense>
                </div>
            </>
        );
    }
    
    return layout(
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold mb-4 text-red-600">Acceso no autorizado</h1>
            <p className="text-gray-600">No tienes permisos para ver esta página o tu rol ({userRole}) no está configurado correctamente.</p>
            <Button
                className="mt-4 bg-[#0068D1] text-white hover:bg-[#0056b3]"
                onClick={() => window.location.href = '/'}
            >
                Volver al inicio
            </Button>
        </div>
    );
}