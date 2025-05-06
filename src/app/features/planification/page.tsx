'use client';
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import LoadingSpinner from "@/components/LoadinSpinner";
import { Plus } from "lucide-react";
import TasksTable from "./components/TasksTable";
import Modal from "@/components/Modal";
import ValleyTaskForm from "./components/ValleyTaskForm";
import { Button } from "@/components/ui/button";
import { usePlanification } from "./hooks/usePlanification";
import { useHooks } from "../hooks/useHooks";


export default function Planification() {
    const {
        handleCancel,
        setIsPopupOpen,
        handleAddTask,
        handleSaveTask,
        toggleSidebar,
        isPopupOpen,
        loading,
        subTasks,
        isSidebarOpen,
        detailedTasks,
    } = usePlanification();

    const { userRole } = useHooks();

    return (
        <div className="overflow-x-hidden">
            <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} data-test-id="header" />
            {loading ? (
                <div className="flex items-center justify-center" data-test-id="loading-spinner">
                    <LoadingSpinner />
                </div>
            ) : (
                <>
                    <div
                        className={`grid h-screen overflow-hidden ${
                            isSidebarOpen ? "grid-cols-[220px_1fr]" : "grid-cols-1"
                        }`}
                        style={{ height: "calc(100vh - 5rem)" }}
                    >
                        {isSidebarOpen && (
                            <aside
                                className={`border-r h-full ${
                                    isSidebarOpen
                                        ? "fixed top-[5rem] left-0 w-full h-[calc(100vh-5rem)] bg-white z-2000 sm:top-0 sm:left-0 sm:w-[220px] sm:relative sm:h-auto sm:bg-transparent"
                                        : ""
                                }`}
                                data-test-id="sidebar"
                            >
                                <Sidebar userRole={userRole} onNavClick={toggleSidebar} />
                            </aside>
                        )}
                        <main className="p-4 h-full overflow-y-auto">
                            <div className="flex flex-col gap-4">
                                <h1 className="text-2xl font-bold">Planificación</h1>
                                <div className="">
                                    <div className="ml-4 flex-1">
                                        <div className="flex flex-row justify-between items-center mb-4">
                                            <Button
                                                onClick={handleAddTask}
                                                variant="ghost"
                                                size="default"
                                                className="flex flex-row cursor-pointer "
                                                data-test-id="add-task-button"
                                            >
                                                <Plus size={25} color="black" />
                                                <span className="ml-2">Añadir</span>
                                            </Button>
                                        </div>
                                        <div>
                                            <TasksTable
                                                tasks={detailedTasks}
                                                subtasks={subTasks}
                                                data-test-id="tasks-table"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                    <Modal isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
                        <ValleyTaskForm
                            onCancel={handleCancel}
                            onSave={handleSaveTask}
                            valley="Valle de Copiapó"
                            data-test-id="task-form"
                        />
                    </Modal>
                </>
            )}
        </div>
    );
}