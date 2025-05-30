'use client';
import React from 'react';
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DropdownMenu from "@/components/Dropdown";
import { IProcess } from "@/app/models/IProcess";

interface TaskTableHeaderProps {
    userRole: string;
    allProcesses: IProcess[];
    selectedProcess: {id: number, name: string} | null;
    handleProcessFilterChange: (item: string) => void;
    handleCreateTask: () => void;
}

const TaskTableHeader: React.FC<TaskTableHeaderProps> = ({ 
    userRole, 
    allProcesses, 
    selectedProcess, 
    handleProcessFilterChange, 
    handleCreateTask 
}) => {
    
    const isCommunicationRole = userRole === "encargado asuntos públicos" || userRole === "encargado comunicaciones";

    const renderProcessDropdown = () => {
        if (userRole === "encargado cumplimiento" || isCommunicationRole) {
            return (
            <div className="mb-4">
                <DropdownMenu
                    buttonText="Seleccione proceso"
                    isInModal={false}
                    items={isCommunicationRole ? ["Todos los procesos", ...allProcesses.filter((p: IProcess) => ['Comunicaciones Internas', 'Asuntos Públicos', 'Comunicaciones Externas','Transversales'].includes(p.name)).map((p: IProcess) => p.name)] : ["Todos los procesos", ...allProcesses.map((process: IProcess) => process.name)]}
                    onSelect={handleProcessFilterChange}
                    selectedValue={selectedProcess?.name || "Todos los procesos"}
                    data-test-id="task-process-dropdown"
                />
            </div>
            );
        }
        else {
            return null;
        }
    };

    return (
        <div className="flex justify-between items-center mb-2">
            <div>
                {renderProcessDropdown()}
            </div>
            <Button 
                onClick={handleCreateTask}
                className="bg-[#4f67b8e0] text-white flex items-center gap-1 hover:cursor-pointer"
            >
                <Plus size={16} /> Añadir
            </Button>
        </div>
    );
};

export default TaskTableHeader;