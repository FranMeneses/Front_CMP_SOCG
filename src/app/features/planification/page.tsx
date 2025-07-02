'use client';
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import TasksTable from "@/components/Planification/Table/TasksTable";
import { usePlanification } from "./hooks/usePlanification";
import { useHooks } from "../hooks/useHooks";
import Image from "next/image";
import { ITaskDetails } from "@/app/models/ITasks";
import { ISubtask } from "@/app/models/ISubtasks";

export default function Planification() {
    const {
        toggleSidebar,
        loading,
        subTasks,
        isSidebarOpen,
        detailedTasks,
        taskState,         
        localSubtasks,
        handleFilterClick, 
        activeFilter,      
    } = usePlanification();

    const { userRole, handleLogout } = useHooks();

    const subtasksToUse = localSubtasks && localSubtasks.length > 0 ? localSubtasks : subTasks;    

    if (loading) {
        return (
            <div className="min-h-screen w-full">
                <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} data-test-id="header" />
                <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
                    <LoadingSpinner data-test-id="loading-spinner" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#F2F2F2]">
            <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} data-test-id="header" />
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
                                    src={'/Caja3GRP.png'}
                                    alt="Planificación Icon"
                                    width={80}
                                    height={80}
                                />
                                <h1 className="text-3xl font-bold">PLANIFICACIÓN</h1>
                            </div>
                            <TasksTable
                            key={`tasks-table-${detailedTasks.length}-${subtasksToUse.length}-${JSON.stringify(detailedTasks.map((t: ITaskDetails) => t.id))}-${JSON.stringify(subtasksToUse.map((s: ISubtask) => s.id))}`}
                            subtasks={subtasksToUse}
                            taskStates={taskState}
                            onFilterClick={handleFilterClick}
                            activeFilter={activeFilter}
                            data-test-id="tasks-table"
                        />
                    </div>
                </div>
            </main>
        </div>
    </div>
    );
}