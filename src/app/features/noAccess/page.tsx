'use client'

import { Header } from "@/components/Header"
import { useState } from "react"

export default function NoAccessPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <div className="min-h-screen w-full bg-[#F2F2F2]">
            <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} data-test-id="header" />
            <main className="flex-1 bg-[#F2F2F2] font-[Helvetica]">
                <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Bienvenido</h1>
                        <p className="text-lg">Está en espera de que le asignen un rol.</p>
                    </div>
                </div>
            </main>
        </div>
    )
}