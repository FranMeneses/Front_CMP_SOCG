'use client'

import { Header } from "@/components/Header"
import { useState } from "react"
import { useHooks } from "../hooks/useHooks"
import { Sidebar } from "@/components/Sidebar"

export default function NoAccessPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { userRole, handleLogout } = useHooks();
    let userName = '';
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userObj = JSON.parse(userStr);
                userName = userObj.full_name || userObj.name || '';
            } catch {}
        }
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <div className="min-h-screen w-full bg-[#F2F2F2] overflow-x-hidden">
            <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} userName={userName} userRole={userRole} data-test-id="header" />
            <div
                className={`grid ${
                    isSidebarOpen ? "grid-cols-[220px_1fr]" : "grid-cols-1"
                }`}
            >
                {isSidebarOpen && (
                    <aside
                        className={`border-r ${
                            isSidebarOpen
                                ? "fixed top-[5rem] left-0 w-full h-[calc(100vh-5rem)] bg-white z-1000 sm:top-0 sm:left-0 sm:w-[220px] sm:relative sm:h-auto sm:bg-transparent overflow-y-auto"
                                : ""
                        }`}
                    >
                        <Sidebar userRole={userRole} onNavClick={toggleSidebar} handleLogout={handleLogout}/>
                    </aside>
                )}
                <main className="flex-1 bg-[#F2F2F2] font-[Helvetica]">
                    <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold mb-4">BIENVENIDO</h1>
                            <p className="text-lg">Está en espera de que le asignen un rol.</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}