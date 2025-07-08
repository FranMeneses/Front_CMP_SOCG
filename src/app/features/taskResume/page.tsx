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
import { IProcess } from "@/app/models/IProcess";
import { Months } from "@/constants/months";
import { useLazyQuery } from "@apollo/client";
import { GET_TASKS_BY_MONTH_AND_PROCESS, GET_TASKS_BY_MONTH } from "@/app/api/tasks";
import { ITask } from "@/app/models/ITasks";
import CategoryDropdowns from "@/components/Resume/CategoryDropdowns";
import { useTaskInfoFilters } from "./hooks/useTaskInfoFilters";

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
    } = useTasksData(undefined, userRole);
    
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    // Filtros
    const [selectedProcess, setSelectedProcess] = React.useState<string>("Todos");
    const monthsWithAll = ["Todos", ...Months];
    const [selectedMonth, setSelectedMonth] = React.useState<string>(monthsWithAll[new Date().getMonth() + 1]);
    const [year] = React.useState<number>(new Date().getFullYear());
    
    const [filteredTasks, setFilteredTasks] = React.useState<ITask[]>([]);
    const [fetchByMonthAndProcess, { data: dataByMonthAndProcess, loading: loadingByMonthAndProcess }] = useLazyQuery(GET_TASKS_BY_MONTH_AND_PROCESS);
    const [fetchByMonth, { data: dataByMonth, loading: loadingByMonth }] = useLazyQuery(GET_TASKS_BY_MONTH);

    // Hook para filtros de información de tareas
    const {
        origins,
        investments,
        types,
        scopes,
        interactions,
        risks,
        activeFilter: infoActiveFilter,
        filteredTasks: infoFilteredTasks,
        handleFilterClick: handleInfoFilterClick,
        clearFilters: clearInfoFilters
    } = useTaskInfoFilters(filteredTasks);



    React.useEffect(() => {
        if (selectedMonth === "Todos") {
            setFilteredTasks(detailedTasks || []);
            return;
        }
        if (selectedProcess === "Todos") {
            fetchByMonth({ variables: { monthName: selectedMonth, year } });
        } else {
            const process = allProcesses.find((p: IProcess) => p.name === selectedProcess);
            if (process) {
                fetchByMonthAndProcess({ variables: { monthName: selectedMonth, year, processId: Number(process.id) } });
            }
        }
    }, [selectedProcess, selectedMonth, year, allProcesses, detailedTasks]);

    React.useEffect(() => {
        if (selectedProcess === "Todos" && dataByMonth?.tasksByMonth) {
            setFilteredTasks(dataByMonth.tasksByMonth);
        } else if (dataByMonthAndProcess?.tasksByMonthAndProcess) {
            setFilteredTasks(dataByMonthAndProcess.tasksByMonthAndProcess);
        }
    }, [dataByMonth, dataByMonthAndProcess, selectedProcess]);

    const handleProcessFilter = async (processName: string) => {
        setSelectedProcess(processName);
    };
    
    const handleMonthFilter = (month: string) => {
        setSelectedMonth(month);
    };

    if (loading || loadingByMonth || loadingByMonthAndProcess) {
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
                            {/* Filtros */}
                            <div className="px-6 pt-4 space-y-4">
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
                                    {allProcesses && allProcesses.length > 0 && (
                                        <div className="w-64 overflow-visible">
                                            <DropdownMenu
                                                buttonText="Filtrar por proceso"
                                                items={["Todos", ...allProcesses.map((p: IProcess) => p.name)]}
                                                onSelect={handleProcessFilter}
                                                selectedValue={selectedProcess}
                                            />
                                        </div>
                                    )}
                                    <div className="w-64 overflow-visible">
                                        <DropdownMenu
                                            buttonText="Filtrar por mes"
                                            items={monthsWithAll}
                                            onSelect={handleMonthFilter}
                                            selectedValue={selectedMonth}
                                        />
                                    </div>
                                    {/* Contador de tareas */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-md h-9 px-4 shadow-sm flex items-center justify-center">
                                        <span className="text-sm font-medium text-blue-800 leading-none">
                                            Tareas encontradas: <span className="font-bold">{(infoActiveFilter.category ? infoFilteredTasks : filteredTasks || []).length}</span>
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Filtros de Categorías */}
                                <div className="border-t pt-4">
                                    <CategoryDropdowns
                                        origins={origins}
                                        investments={investments}
                                        types={types}
                                        scopes={scopes}
                                        interactions={interactions}
                                        risks={risks}
                                        activeFilter={infoActiveFilter}
                                        handleFilterClick={handleInfoFilterClick}
                                        clearFilters={clearInfoFilters}
                                    />
                                </div>
                            </div>
                            <div className="p-4">
                                <DynamicTable
                                    tasks={infoActiveFilter.category ? infoFilteredTasks : filteredTasks || []}
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
