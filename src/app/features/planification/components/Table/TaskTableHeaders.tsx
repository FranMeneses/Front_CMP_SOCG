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

const PROCESS_FILTERS = {
    COMMUNICATIONS: ['Comunicaciones Internas', 'Asuntos Públicos', 'Comunicaciones Externas', 'Transversales'],
    RELATIONSHIP: ['Relacionamiento VC', 'Relacionamiento VH', 'Relacionamiento VE'],
    DEFAULT: ["Todos los procesos"]
};

const TaskTableHeader: React.FC<TaskTableHeaderProps> = ({ 
    userRole, 
    allProcesses, 
    selectedProcess, 
    handleProcessFilterChange, 
    handleCreateTask 
}) => {
    const { isCommunicationsManager, isValleyManager, isManager } = useHooks();

    const getFilteredProcesses = () => {
        const defaultProcesses = [...PROCESS_FILTERS.DEFAULT];
        
        if (isCommunicationsManager) {
            const communicationProcesses = allProcesses
                .filter((p: IProcess) => PROCESS_FILTERS.COMMUNICATIONS.includes(p.name))
                .map((p: IProcess) => p.name);
            
            return [...defaultProcesses, ...communicationProcesses];
        } 
        
        if (userRole.toLowerCase() === "superintendente de relacionamiento") {
            const relationshipProcesses = allProcesses
                .filter((p: IProcess) => PROCESS_FILTERS.RELATIONSHIP.includes(p.name))
                .map((p: IProcess) => p.name);
            
            return [...defaultProcesses, ...relationshipProcesses];
        }
        
        // For other managers, show all processes
        return [
            ...defaultProcesses, 
            ...allProcesses.map((process: IProcess) => process.name)
        ];
    };

    const renderProcessDropdown = () => {
        if (isManager || isCommunicationsManager) {
            const filteredProcesses = getFilteredProcesses();

            return (
                <div className="mb-4 font-[Helvetica]">
                    <DropdownMenu
                        buttonText="Seleccione proceso"
                        isInModal={false}
                        items={filteredProcesses}
                        onSelect={handleProcessFilterChange}
                        selectedValue={selectedProcess?.name || "Todos los procesos"}
                        data-test-id="task-process-dropdown"
                    />
                </div>
            );
        } else {
            return null;
        }
    };
    
    return (
        <div className="flex justify-between items-center mb-2 font-[Helvetica]">
            <div>
                {renderProcessDropdown()}
            </div>
            { ((isValleyManager || isCommunicationsManager) && !isManager) && (
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