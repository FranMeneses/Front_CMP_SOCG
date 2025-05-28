'use client'
import React from 'react';
import { Button } from "@/components/ui/button";

interface TaskFiltersProps {
    taskStates: string[];
    activeFilter: string | null;
    handleFilterClick: (filter: string) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ taskStates, activeFilter, handleFilterClick }) => {
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
                            "bg-gray-200 text-gray-800 font-medium"
                            : "bg-white hover:bg-gray-100"
                    }`}
                    onClick={() => handleFilterClick(filter)}
                >
                    {filter}
                </Button>
            ))}
        </div>
    );
};

export default TaskFilters;