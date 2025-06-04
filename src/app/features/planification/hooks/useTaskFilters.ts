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
    
    const handleProcessFilterChange = async (item: string) => {
        if (item === "Todos los procesos") {
            setSelectedProcess(null);
            
            if (activeStatusFilter) {
                const filteredByStatus = tasks.filter(task => 
                    task.status?.name === activeStatusFilter
                );
                setFilteredTasks(filteredByStatus);
            } else {
                setFilteredTasks(tasks);
            }
            return;
        }
        
        const process = allProcesses.find((p: IProcess) => p.name === item);
        
        if (process) {
            setSelectedProcess({id: Number(process.id), name: process.name});
            
            const processTasks = await handleFilterByProcess(Number(process.id)) || [];
            
            if (activeStatusFilter) {
                const filteredByStatus = processTasks.filter(task => 
                    task.status?.name === activeStatusFilter
                );
                setFilteredTasks(filteredByStatus);
            } else {
                setFilteredTasks(processTasks);
            }
        }
    };

        const handleLateFilterClick = () => {
        setIsLateFilterActive(!isLateFilterActive);
        
        if (!isLateFilterActive) {
            const currentDate = new Date();
            
            const delayedTasks = tasks.filter(task => {
                if (!task.endDate) return false;
                
                const endDate = new Date(task.endDate);
                return endDate < currentDate && 
                       task.status?.name !== "Completada" && 
                       task.status?.name !== "Cancelada";
            });
            
            setFilteredTasks(delayedTasks);
            setActiveStatusFilter(null); 
        } else {
            if (selectedProcess) {
                handleFilterByProcess(selectedProcess.id).then(processTasks => {
                    setFilteredTasks(processTasks || []);
                });
            } else {
                setFilteredTasks(tasks);
            }
        }
    };

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