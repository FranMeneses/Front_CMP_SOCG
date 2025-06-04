'use client'
import React from 'react';
import { Button } from "@/components/ui/button";

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
        <div className="flex gap-2 mb-4">
            {taskStates.map((filter: string) => (
                <Button
                    key={filter}
                    variant="outline"
                    className={`px-4 py-2 text-sm rounded-md hover:cursor-pointer ${
                        activeFilter === filter
                            ? filter === "Completada" ? "bg-green-100 text-green-800 font-medium" : 
                            filter === "En Proceso" ? "bg-blue-100 text-blue-800 font-medium" :
                            filter === "En Espera" ? "bg-yellow-100 text-yellow-800 font-medium" :
                            filter === "Cancelada" ? "bg-red-100 text-red-800 font-medium" :
                            filter === "En Cumplimiento" ? "bg-purple-100 text-purple-800 font-medium" :
                            "bg-gray-200 text-gray-800 font-medium"
                            : "bg-white hover:bg-gray-100"
                    }`}
                    onClick={() => {
                        handleFilterClick(filter);
                    }}
                >
                    {filter}
                </Button>
            ))}
            <div className='flex-1'>
                <Button
                    variant="outline"
                    className={`px-4 py-2 text-sm rounded-md hover:cursor-pointer ${
                        isLateFilterActive 
                            ? "bg-red-100 text-red-800 font-medium border-red-300" 
                            : "bg-white hover:bg-gray-100"
                    }`}
                    onClick={handleLateFilterClick}
                >
                    <span className="flex items-center">
                        {isLateFilterActive && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                        Tareas atrasadas
                    </span>
                </Button>
            </div>
        </div>
    );
};

export default TaskFilters;