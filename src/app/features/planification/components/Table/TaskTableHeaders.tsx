'use client';
import React from 'react';
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DropdownMenu from "@/components/Dropdown";
import { IProcess } from "@/app/models/IProcess";
import { useHooks } from '@/app/features/hooks/useHooks';

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
    const { isCommunicationsManager, isValleyManager } = useHooks();

    const renderProcessDropdown = () => {
        if (userRole === "encargado cumplimiento" || isCommunicationsManager) {
            return (
            <div className="mb-4 font-[Helvetica]">
                <DropdownMenu
                    buttonText="Seleccione proceso"
                    isInModal={false}
                    items={isCommunicationsManager ? ["Todos los procesos", ...allProcesses.filter((p: IProcess) => ['Comunicaciones Internas', 'Asuntos Públicos', 'Comunicaciones Externas','Transversales'].includes(p.name)).map((p: IProcess) => p.name)] : ["Todos los procesos", ...allProcesses.map((process: IProcess) => process.name)]}
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
        <div className="flex justify-between items-center mb-2 font-[Helvetica]">
            <div>
                {renderProcessDropdown()}
            </div>
            { (isValleyManager || isCommunicationsManager) && (
                <Button 
                    onClick={handleCreateTask}
                    className="bg-[#4f67b8e0] text-white flex items-center gap-1 hover:cursor-pointer"
                >
                    <Plus size={16} /> Añadir
                </Button>
                )}
        </div>
    );
};

export default TaskTableHeader;