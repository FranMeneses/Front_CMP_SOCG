'use client';
import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import DynamicTable from "@/components/Resume/DynamicTable";
import { useHooks } from "../hooks/useHooks";
import { useTasksData } from "../planification/hooks/useTaskData";
import Image from "next/image";
import DropdownMenu from "@/components/Dropdown";

export default function TaskResume() {
    const { userRole, handleLogout } = useHooks();
    // Obtener nombre de usuario desde localStorage
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
    // Usamos el hook de planificación para obtener tareas y subtareas
    const {
        detailedTasks,
        subTasks,
        loading,
        allProcesses,
        activeFilter,
        handleFilterByProcess,
    } = useTasksData(undefined, userRole);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    // Filtro de proceso
    const [selectedProcess, setSelectedProcess] = React.useState<string>("Todos");

    const handleProcessFilter = async (processName: string) => {
        setSelectedProcess(processName);
        const process = allProcesses.find((p: any) => p.name === processName);
        if (process) {
            await handleFilterByProcess(process.id);
        } else {
            await handleFilterByProcess(0);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full">
                <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} data-test-id="header" userName={userName} userRole={userRole} />
                <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
                    <LoadingSpinner data-test-id="loading-spinner" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#F2F2F2]">
            <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} data-test-id="header" userName={userName} userRole={userRole} />
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
                        data-test-id="sidebar"
                    >
                        <Sidebar userRole={userRole} onNavClick={toggleSidebar} handleLogout={handleLogout}/>
                    </aside>
                )}
                <main className="flex-1 bg-[#F2F2F2] font-[Helvetica] overflow-x-auto">
                    <div className="flex flex-col gap-6 w-full font-[Helvetica] min-w-0 px-8 lg:px-12 xl:px-16 py-6">
                        <div className="bg-white rounded-lg shadow">
                            <div className="flex flex-row gap-4 items-center px-6 pt-6 pb-4 border-b border-gray-200">
                                <Image
                                    src={'/Caja5GRP.png'}
                                    alt="TaskResume Icon"
                                    width={80}
                                    height={80}
                                />
                                <h1 className="text-3xl font-bold">RESUMEN DE TAREAS</h1>
                            </div>
                            {/* Filtro por proceso */}
                            <div className="px-6 pt-4">
                                {allProcesses && allProcesses.length > 0 && (
                                    <div className="mb-4 w-64 overflow-visible">
                                        <DropdownMenu
                                            buttonText="Filtrar por proceso"
                                            items={["Todos", ...allProcesses.map((p: any) => p.name)]}
                                            onSelect={handleProcessFilter}
                                            selectedValue={selectedProcess}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <DynamicTable
                                    tasks={detailedTasks || []}
                                    subtasks={subTasks || []}
                                    selectedTaskId={null}
                                    onTaskClick={() => {}}
                                    userRole={userRole}
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
