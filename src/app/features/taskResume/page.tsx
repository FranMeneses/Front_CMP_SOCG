'use client';
import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import DynamicTable from "@/components/Resume/DynamicTable";
import { useHooks } from "../hooks/useHooks";
import { useTasksData } from "../planification/hooks/useTaskData";
import { useDynamicTable } from "../resume/hooks/useDynamicTable";
import Image from "next/image";
import DropdownMenu from "@/components/Dropdown";
import { IProcess } from "@/app/models/IProcess";
import { Months } from "@/constants/months";
import { useLazyQuery } from "@apollo/client";
import { GET_TASKS_BY_MONTH_AND_PROCESS, GET_TASKS_BY_MONTH } from "@/app/api/tasks";
import { ITask } from "@/app/models/ITasks";

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
    
    // Hook para obtener las categorías de filtros
    const { infoTaskNames } = useDynamicTable(detailedTasks || []);
    
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    // Filtros existentes
    const [selectedProcess, setSelectedProcess] = React.useState<string>("Todos");
    const monthsWithAll = ["Todos", ...Months];
    const [selectedMonth, setSelectedMonth] = React.useState<string>(monthsWithAll[new Date().getMonth() + 1]);
    const [year] = React.useState<number>(new Date().getFullYear());
    
    // Nuevos filtros de categorías
    const [selectedOrigin, setSelectedOrigin] = React.useState<string>("Todos");
    const [selectedInvestment, setSelectedInvestment] = React.useState<string>("Todos");
    const [selectedType, setSelectedType] = React.useState<string>("Todos");
    const [selectedScope, setSelectedScope] = React.useState<string>("Todos");
    const [selectedInteraction, setSelectedInteraction] = React.useState<string>("Todos");
    const [selectedRisk, setSelectedRisk] = React.useState<string>("Todos");
    
    const [filteredTasks, setFilteredTasks] = React.useState<ITask[]>([]);
    const [fetchByMonthAndProcess, { data: dataByMonthAndProcess, loading: loadingByMonthAndProcess }] = useLazyQuery(GET_TASKS_BY_MONTH_AND_PROCESS);
    const [fetchByMonth, { data: dataByMonth, loading: loadingByMonth }] = useLazyQuery(GET_TASKS_BY_MONTH);

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

    // Función para aplicar filtros de categorías en el cliente
    const applyCategoryFilters = React.useCallback((tasks: ITask[]) => {
        return tasks.filter(task => {
            // Solo aplicar filtros de categorías a tareas de relacionamiento (procesos 1, 2, 3)
            const isRelationshipTask = typeof task.processId === 'number' && [1, 2, 3].includes(task.processId);
            
            if (!isRelationshipTask) {
                return true; // No filtrar tareas que no son de relacionamiento
            }

            // Aplicar filtros de categorías solo a tareas de relacionamiento
            if (selectedOrigin !== "Todos") {
                const originName = infoTaskNames.origin.find(info => info.id === task.originId)?.name;
                if (originName !== selectedOrigin) return false;
            }
            
            if (selectedInvestment !== "Todos") {
                const investmentName = infoTaskNames.investment.find(info => info.id === task.investmentId)?.line;
                if (investmentName !== selectedInvestment) return false;
            }
            
            if (selectedType !== "Todos") {
                const typeName = infoTaskNames.type.find(info => info.id === task.typeId)?.name;
                if (typeName !== selectedType) return false;
            }
            
            if (selectedScope !== "Todos") {
                const scopeName = infoTaskNames.scope.find(info => info.id === task.scopeId)?.name;
                if (scopeName !== selectedScope) return false;
            }
            
            if (selectedInteraction !== "Todos") {
                const interactionName = infoTaskNames.interaction.find(info => info.id === task.interactionId)?.operation;
                if (interactionName !== selectedInteraction) return false;
            }
            
            if (selectedRisk !== "Todos") {
                const riskName = infoTaskNames.risk.find(info => info.id === task.riskId)?.type;
                if (riskName !== selectedRisk) return false;
            }
            
            return true;
        });
    }, [selectedOrigin, selectedInvestment, selectedType, selectedScope, selectedInteraction, selectedRisk, infoTaskNames]);

    React.useEffect(() => {
        let baseTasks: ITask[] = [];
        
        if (selectedProcess === "Todos" && dataByMonth?.tasksByMonth) {
            baseTasks = dataByMonth.tasksByMonth;
        } else if (dataByMonthAndProcess?.tasksByMonthAndProcess) {
            baseTasks = dataByMonthAndProcess.tasksByMonthAndProcess;
        }
        
        // Aplicar filtros de categorías
        const categoryFilteredTasks = applyCategoryFilters(baseTasks);
        setFilteredTasks(categoryFilteredTasks);
    }, [dataByMonth, dataByMonthAndProcess, selectedProcess, applyCategoryFilters]);

    const handleProcessFilter = async (processName: string) => {
        setSelectedProcess(processName);
    };
    
    const handleMonthFilter = (month: string) => {
        setSelectedMonth(month);
    };
    
    // Handlers para filtros de categorías
    const handleOriginFilter = (origin: string) => setSelectedOrigin(origin);
    const handleInvestmentFilter = (investment: string) => setSelectedInvestment(investment);
    const handleTypeFilter = (type: string) => setSelectedType(type);
    const handleScopeFilter = (scope: string) => setSelectedScope(scope);
    const handleInteractionFilter = (interaction: string) => setSelectedInteraction(interaction);
    const handleRiskFilter = (risk: string) => setSelectedRisk(risk);

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
                            {/* Filtros principales */}
                            <div className="px-6 pt-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
                                {allProcesses && allProcesses.length > 0 && (
                                    <div className="mb-4 w-64 overflow-visible">
                                        <DropdownMenu
                                            buttonText="Filtrar por proceso"
                                            items={["Todos", ...allProcesses.map((p: IProcess) => p.name)]}
                                            onSelect={handleProcessFilter}
                                            selectedValue={selectedProcess}
                                        />
                                    </div>
                                )}
                                <div className="mb-4 w-64 overflow-visible">
                                    <DropdownMenu
                                        buttonText="Filtrar por mes"
                                        items={monthsWithAll}
                                        onSelect={handleMonthFilter}
                                        selectedValue={selectedMonth}
                                    />
                                </div>
                            </div>
                            
                            {/* Filtros de categorías para tareas de relacionamiento */}
                            <div className="px-6 pb-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Filtros para tareas de relacionamiento:</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2">
                                    <div className="w-full overflow-visible">
                                        <DropdownMenu
                                            buttonText="Origen"
                                            items={["Todos", ...(infoTaskNames.origin?.map(origin => origin.name) || [])]}
                                            onSelect={handleOriginFilter}
                                            selectedValue={selectedOrigin}
                                        />
                                    </div>
                                    <div className="w-full overflow-visible">
                                        <DropdownMenu
                                            buttonText="Inversión"
                                            items={["Todos", ...(infoTaskNames.investment?.map(investment => investment.line) || [])]}
                                            onSelect={handleInvestmentFilter}
                                            selectedValue={selectedInvestment}
                                        />
                                    </div>
                                    <div className="w-full overflow-visible">
                                        <DropdownMenu
                                            buttonText="Tipo"
                                            items={["Todos", ...(infoTaskNames.type?.map(type => type.name) || [])]}
                                            onSelect={handleTypeFilter}
                                            selectedValue={selectedType}
                                        />
                                    </div>
                                    <div className="w-full overflow-visible">
                                        <DropdownMenu
                                            buttonText="Alcance"
                                            items={["Todos", ...(infoTaskNames.scope?.map(scope => scope.name) || [])]}
                                            onSelect={handleScopeFilter}
                                            selectedValue={selectedScope}
                                        />
                                    </div>
                                    <div className="w-full overflow-visible">
                                        <DropdownMenu
                                            buttonText="Interacción"
                                            items={["Todos", ...(infoTaskNames.interaction?.map(interaction => interaction.operation) || [])]}
                                            onSelect={handleInteractionFilter}
                                            selectedValue={selectedInteraction}
                                        />
                                    </div>
                                    <div className="w-full overflow-visible">
                                        <DropdownMenu
                                            buttonText="Riesgo"
                                            items={["Todos", ...(infoTaskNames.risk?.map(risk => risk.type) || [])]}
                                            onSelect={handleRiskFilter}
                                            selectedValue={selectedRisk}
                                        />
                                    </div>
                                </div>
                                
                                {/* Botón para limpiar filtros de categorías */}
                                <div className="mt-3">
                                    <button
                                        onClick={() => {
                                            setSelectedOrigin("Todos");
                                            setSelectedInvestment("Todos");
                                            setSelectedType("Todos");
                                            setSelectedScope("Todos");
                                            setSelectedInteraction("Todos");
                                            setSelectedRisk("Todos");
                                        }}
                                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                                    >
                                        Limpiar filtros de categorías
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <DynamicTable
                                    tasks={filteredTasks || []}
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
