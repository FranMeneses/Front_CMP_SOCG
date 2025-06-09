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

    
    useEffect(() => {
        setFilteredTasks(tasks);
    }, [tasks]);
    
    /**
     * Función para manejar el cambio de filtro de procesos.
     * @param item Proceso seleccionado.
     * @returns {Promise<void>}
     */
    const handleProcessFilterChange = async (item: string) => {
        setActiveStatusFilter(null);
        setIsLateFilterActive(false);
        
        if (item === "Todos los procesos") {
            setSelectedProcess(null);
            setFilteredTasks(tasks);
            return;
        }
        
        const process = allProcesses.find((p: IProcess) => p.name === item);
        
        if (process) {
            setSelectedProcess({id: Number(process.id), name: process.name});
            
            const processTasks = await handleFilterByProcess(Number(process.id)) || [];
            setFilteredTasks(processTasks);
        }
    };

    /**
     * Función para manejar el clic en el filtro de tareas atrasadas.
     * @description Filtra las tareas que están atrasadas (fecha de finalización pasada y no completadas).
     * @returns {void}
     */
    const handleLateFilterClick = () => {
        setIsLateFilterActive(!isLateFilterActive);
        
        if (!isLateFilterActive) {
            const currentDate = new Date();
            
            const tasksToFilter = selectedProcess 
                ? filteredTasks 
                : tasks;       
            
            const delayedTasks = tasksToFilter.filter(task => {
                if (!task.endDate) return false;
                
                const endDate = new Date(task.endDate);
                return endDate < currentDate && 
                    task.status?.name !== "Completada" && 
                    task.status?.name !== "Cancelada";
            });
            
            setFilteredTasks(delayedTasks);
        } else {
            if (selectedProcess) {
                handleFilterByProcess(selectedProcess.id).then(processTasks => {
                    if (activeStatusFilter) {
                        const filteredByStatus = (processTasks || []).filter(task => 
                            task.status?.name === activeStatusFilter
                        );
                        setFilteredTasks(filteredByStatus);
                    } else {
                        setFilteredTasks(processTasks || []);
                    }
                });
            } else {
                if (activeStatusFilter) {
                    const filteredByStatus = tasks.filter(task => 
                        task.status?.name === activeStatusFilter
                    );
                    setFilteredTasks(filteredByStatus);
                } else {
                    setFilteredTasks(tasks);
                }
            }
        }
    };

    /**
     * Función para manejar el cambio de filtro por estado.
     * @description Filtra las tareas por el estado seleccionado.
     * @param statusName Nombre del estado por el que se desea filtrar las tareas.
     */
    const handleStatusFilterChange = (statusName: string) => {
        if (activeStatusFilter === statusName) {
            setActiveStatusFilter(null);
            
            if (selectedProcess) {
                handleFilterByProcess(selectedProcess.id).then(processTasks => {
                    setFilteredTasks(processTasks || []);
                });
            } else {
                setFilteredTasks(tasks);
            }
        } else {
            setActiveStatusFilter(statusName);
            
            const tasksToFilter = selectedProcess 
                ? filteredTasks  
                : tasks;         
            
            const filteredByStatus = tasksToFilter.filter(task => 
                task.status?.name === statusName
            );
            setFilteredTasks(filteredByStatus);
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