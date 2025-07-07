import { useState, useEffect } from 'react';
import { ITaskDetails } from '@/app/models/ITasks';
import { IProcess } from "@/app/models/IProcess";

export const useTaskFilters = (
    tasks: ITaskDetails[], 
    allProcesses: IProcess[], 
    handleFilterByProcess: (processId: number) => Promise<ITaskDetails[] | undefined>,
    selectedProcess: {id: number, name: string} | null,
    setSelectedProcess: (process: {id: number, name: string} | null) => void
) => {
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
        // Si hay un proceso seleccionado, filtra por ese proceso
        if (selectedProcess) {
            result = result.filter(task => task.processId === selectedProcess.id);
        }
        if (activeStatusFilter) {
            result = result.filter(task => task.status?.name === activeStatusFilter);
        }
        if (isLateFilterActive) {
            const currentDate = new Date();
            result = result.filter(task => {
                if (!task.endDate) return false;
                const endDate = new Date(task.endDate);
                
                // Para tareas completadas, verificar si se terminaron después de la fecha límite
                if (task.status?.name === "Completada" && task.finishedDate) {
                    const finishedDate = new Date(task.finishedDate);
                    return finishedDate > endDate; // Se completó después de la fecha límite
                }
                
                // Para tareas pendientes, verificar si la fecha límite ya pasó
                return endDate <= currentDate && 
                    task.status?.name !== "Cancelada";
            });
        }
        // Ordenar por fecha de vencimiento más próxima (endDate ascendente)
        result = result.sort((a, b) => {
            const dateA = a.endDate && a.endDate !== '-' ? new Date(a.endDate).getTime() : Infinity;
            const dateB = b.endDate && b.endDate !== '-' ? new Date(b.endDate).getTime() : Infinity;
            return dateA - dateB;
        });
        setFilteredTasks(result);
    }, [tasks, selectedProcess, activeStatusFilter, isLateFilterActive]);
    
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
                    
                    // Para tareas completadas, verificar si se terminaron después de la fecha límite
                    if (task.status?.name === "Completada" && task.finishedDate) {
                        const finishedDate = new Date(task.finishedDate);
                        return finishedDate > endDate; // Se completó después de la fecha límite
                    }
                    
                    // Para tareas pendientes, verificar si la fecha límite ya pasó
                    return endDate < currentDate && 
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
                    
                    // Para tareas completadas, verificar si se terminaron después de la fecha límite
                    if (task.status?.name === "Completada" && task.finishedDate) {
                        const finishedDate = new Date(task.finishedDate);
                        return finishedDate > endDate; // Se completó después de la fecha límite
                    }
                    
                    // Para tareas pendientes, verificar si la fecha límite ya pasó
                    return endDate < currentDate && 
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