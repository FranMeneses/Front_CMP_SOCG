'use client'

import { Header } from "@/components/Header"
import { useState } from "react"
import { useHooks } from "../hooks/useHooks"

export default function NoAccessPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { userRole } = useHooks();
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
        <div className="min-h-screen w-full bg-[#F2F2F2]">
            <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} userName={userName} userRole={userRole} data-test-id="header" />
            <main className="flex-1 bg-[#F2F2F2] font-[Helvetica]">
                <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">BIENVENIDO</h1>
                        <p className="text-lg">Está en espera de que le asignen un rol.</p>
                    </div>
                </div>
            </main>
        </div>
    )
}