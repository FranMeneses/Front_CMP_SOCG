'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import { Clock } from 'lucide-react';

interface TaskFiltersProps {
    taskStates: string[];
    activeFilter: string | null;
    handleFilterClick: (filter: string) => void;
    isLateFilterActive: boolean; 
    handleLateFilterClick: () => void; 
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ 
    taskStates, 
    activeFilter, 
    handleFilterClick,
    isLateFilterActive,
    handleLateFilterClick
}) => {
    return (
        <div className="flex flex-wrap gap-2 mb-4 font-[Helvetica]">
            {taskStates.map((filter: string) => (
                <Button
                    key={filter}
                    variant="outline"
                    className={`px-4 py-2 text-sm rounded-md hover:cursor-pointer transition-all duration-200 ${
                        filter === "Completada" ? 
                            activeFilter === filter ? "bg-[#ABF9B6] text-green-800 font-bold border-green-400" : "bg-[#ABF9B6] text-black font-medium border-green-300 hover:border-green-400" :
                        filter === "En Proceso" ? 
                            activeFilter === filter ? "bg-[#FDC28E] text-[#C95E00] font-bold border-orange-400" : "bg-[#FDC28E] text-black font-medium border-orange-300 hover:border-orange-400" :
                        filter === "En Espera" ? 
                            activeFilter === filter ? "bg-[#F7F7B5] text-yellow-800 font-bold border-yellow-400" : "bg-[#F7F7B5] text-black font-medium border-yellow-300 hover:border-yellow-400" :
                        filter === "Cancelada" ? 
                            activeFilter === filter ? "bg-[#FFB9BB] text-red-800 font-bold border-red-400" : "bg-[#FFB9BB] text-black font-medium border-red-300 hover:border-red-400" :
                        filter === "Due Diligence" ? 
                            activeFilter === filter ? "bg-[#B4E0F7] text-[#128CCC] font-bold border-blue-400" : "bg-[#B4E0F7] text-black font-medium border-blue-300 hover:border-blue-400" :
                        filter === "No Iniciada" ? 
                            activeFilter === filter ? "bg-[#EAE9E8] text-gray-800 font-bold border-gray-400" : "bg-[#EAE9E8] text-black font-medium border-gray-300 hover:border-gray-400" :
                        // Fallback para cualquier otro estado
                        activeFilter === filter ? "bg-[#EAE9E8] text-gray-800 font-bold border-gray-400" : "bg-[#EAE9E8] text-black font-medium border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => {
                        handleFilterClick(filter);
                    }}
                >
                    {filter.toUpperCase()}
                </Button>
            ))}
            <Button
                variant="outline"
                className={`px-4 py-2 text-sm rounded-md hover:cursor-pointer transition-all duration-200 ${
                    isLateFilterActive 
                        ? "bg-[#EBBAFB] text-[#A914DA] font-bold border-purple-400" 
                        : "bg-[#EBBAFB] text-black font-medium border-purple-300 hover:border-purple-400"
                }`}
                onClick={handleLateFilterClick}
            >
                <span className="flex items-center">
                    {isLateFilterActive && (
                        <Clock/>
                    )}
                    TAREAS ATRASADAS
                </span>
            </Button>
        </div>
    );
};

export default TaskFilters;