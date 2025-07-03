import { useState, useEffect } from 'react';
import { ITaskDetails } from '@/app/models/ITasks';
import { IProcess } from "@/app/models/IProcess";

export const useTaskFilters = (
    tasks: ITaskDetails[], 
    allProcesses: IProcess[], 
    handleFilterByProcess: (processId: number) => Promise<ITaskDetails[] | undefined>
) => {
    const [selectedProcess, setSelectedProcess] = useState<{id: number, name: string} | null>(null);
    const [filteredTasks, setFilteredTasks] = useState(tasks);
    const [activeStatusFilter, setActiveStatusFilter] = useState<string | null>(null);
    const [isLateFilterActive, setIsLateFilterActive] = useState<boolean>(false);
    const [processTasksCache, setProcessTasksCache] = useState<ITaskDetails[]>([]);
    
    /**
     * Hook para inicializar el estado de las tareas filtradas cuando no hay filtros activos.
     * @description Si no hay filtros activos, se inicializa el estado de las tareas filtradas con todas las tareas disponibles.
     */
    useEffect(() => {
        let result = [...tasks];
        if (activeStatusFilter) {
            result = result.filter(task => task.status?.name === activeStatusFilter);
        }
        if (isLateFilterActive) {
            const currentDate = new Date();
            result = result.filter(task => {
                if (!task.endDate) return false;
                const endDate = new Date(task.endDate);
                return endDate < currentDate && 
                    task.status?.name !== "Completada" && 
                    task.status?.name !== "Cancelada";
            });
        }
        setFilteredTasks(result);
    }, [tasks, activeStatusFilter, isLateFilterActive]);
    
    /**
     * Función para manejar el cambio de filtro de procesos.
     * @param item Proceso seleccionado.
     * @returns {Promise<void>}
     */
    const handleProcessFilterChange = async (item: string) => {
        try {
            setActiveStatusFilter(null);
            setIsLateFilterActive(false);
            
            if (item === "Todos los procesos") {
                setSelectedProcess(null);
                
                const allTasks = await handleFilterByProcess(0) || [];
                setProcessTasksCache(allTasks); 
                
                setFilteredTasks(allTasks); 
                return;
            }
            
            const process = allProcesses.find((p: IProcess) => p.name === item);
            
            if (process) {
                setSelectedProcess({id: Number(process.id), name: process.name});
                
                const processTasks = await handleFilterByProcess(Number(process.id)) || [];
                setProcessTasksCache(processTasks); 
                
                setFilteredTasks(processTasks); 
            }
        } catch (error) {
            console.error("Error filtering by process:", error);
        }
    };

    /**
     * Función para manejar el clic en el filtro de tareas atrasadas.
     * @description Filtra las tareas que están atrasadas (fecha de finalización pasada y no completadas).
     * @returns {Promise<void>}
     */
    const handleLateFilterClick = async () => {
        try {
            const newLateFilterState = !isLateFilterActive;
            setIsLateFilterActive(newLateFilterState);
            
            const tasksToFilter = processTasksCache.length > 0 
                ? [...processTasksCache] 
                : selectedProcess 
                    ? await handleFilterByProcess(selectedProcess.id) || [] 
                    : await handleFilterByProcess(0) || [];
            
            let result = [...tasksToFilter];
            
            if (activeStatusFilter) {
                result = result.filter(task => 
                    task.status?.name === activeStatusFilter
                );
            }
            
            if (newLateFilterState) {
                const currentDate = new Date();
                result = result.filter(task => {
                    if (!task.endDate) return false;
                    const endDate = new Date(task.endDate);
                    return endDate < currentDate && 
                        task.status?.name !== "Completada" && 
                        task.status?.name !== "Cancelada";
                });
            }
            
            setFilteredTasks(result);
        } catch (error) {
            console.error("Error in handleLateFilterClick:", error);
        }
    };

    /**
     * Función para manejar el cambio de filtro por estado.
     * @description Filtra las tareas por el estado seleccionado.
     * @param statusName Nombre del estado por el que se desea filtrar las tareas.
     */
    const handleStatusFilterChange = async (statusName: string) => {
        try {
            const newStatusFilter = activeStatusFilter === statusName ? null : statusName;
            setActiveStatusFilter(newStatusFilter);
            
            const tasksToFilter = processTasksCache.length > 0 
                ? [...processTasksCache] 
                : selectedProcess 
                    ? await handleFilterByProcess(selectedProcess.id) || [] 
                    : await handleFilterByProcess(0) || [];
            
            let result = [...tasksToFilter];
            
            if (newStatusFilter) {
                result = result.filter(task => 
                    task.status?.name === newStatusFilter
                );
            }
            
            if (isLateFilterActive) {
                const currentDate = new Date();
                result = result.filter(task => {
                    if (!task.endDate) return false;
                    const endDate = new Date(task.endDate);
                    return endDate < currentDate && 
                        task.status?.name !== "Completada" && 
                        task.status?.name !== "Cancelada";
                });
            }
            
            setFilteredTasks(result);
        } catch (error) {
            console.error("Error filtering by status:", error);
        }
    };

    return {
        filteredTasks,
        selectedProcess,
        activeStatusFilter,
        isLateFilterActive, 
        handleProcessFilterChange,
        handleStatusFilterChange,
        handleLateFilterClick 
    };
};