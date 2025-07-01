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
                    className={`px-4 py-2 text-sm rounded-md hover:cursor-pointer ${
                        activeFilter === filter
                            ? filter === "Completada" ? "bg-[#ABF9B6] text-green-800 font-medium" : 
                            filter === "En Proceso" ? "bg-[#FDC28E] text-[#C95E00] font-medium" :
                            filter === "En Espera" ? "bg-[#F7F7B5] text-yellow-800 font-medium" :
                            filter === "Cancelada" ? "bg-[#FFB9BB] text-red-800 font-medium" :
                            filter === "En Cumplimiento" ? "bg-[#B4E0F7] text-[#128CCC] font-medium" :
                            "bg-[#EAE9E8] text-gray-800 font-medium"
                            : "bg-white hover:bg-gray-100"
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
                className={`px-4 py-2 text-sm rounded-md hover:cursor-pointer ${
                    isLateFilterActive 
                        ? "bg-[#EBBAFB] text-[#A914DA] font-medium border-[#EBBAFB]" 
                        : "bg-white hover:bg-gray-100"
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