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
    handleUploadPlanification?: () => void;
    handleCreateComplianceManager?: () => void;
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
    handleCreateTask,
    handleUploadPlanification,
    handleCreateComplianceManager,
}) => {
    const { isCommunicationsManager, isManager } = useHooks();

    const getFilteredProcesses = () => {
        const defaultProcesses = [...PROCESS_FILTERS.DEFAULT];
        
        if (isCommunicationsManager) {
            const communicationProcesses = allProcesses
                .filter((p: IProcess) => PROCESS_FILTERS.COMMUNICATIONS.includes(p.name))
                .map((p: IProcess) => p.name);
            
            return [...defaultProcesses, ...communicationProcesses];
        } 
        
        if (userRole.toLowerCase() === "Superintendente Relacionamiento") {
            const relationshipProcesses = allProcesses
                .filter((p: IProcess) => PROCESS_FILTERS.RELATIONSHIP.includes(p.name))
                .map((p: IProcess) => p.name);
            
            return [...defaultProcesses, ...relationshipProcesses];
        }
        
        return [
            ...defaultProcesses, 
            ...allProcesses.map((process: IProcess) => process.name)
        ];
    };

    const renderProcessDropdown = () => {
        if (isManager || isCommunicationsManager || userRole === "Encargado Cumplimiento" || userRole === 'Admin') {
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

    const handleAddButtonClick = () => {
        if (userRole === "Admin") {
            handleCreateComplianceManager?.();
        } else if (isCommunicationsManager) {
            handleCreateTask();
        }
    };
    
    return (
        <div className="flex justify-between items-center mb-2 font-[Helvetica]">
            <div>
                {renderProcessDropdown()}
            </div>
            <div className=' flex flex-row gap-2'>
                 {((isCommunicationsManager || userRole === "Admin") && !isManager) && (
                <Button 
                    onClick={handleAddButtonClick}
                    className="bg-[#0068D1] hover:bg-[#0056a3] text-white flex items-center gap-1 hover:cursor-pointer"
                >
                    <Plus size={16} /> Añadir
                </Button>
            )}
            {((userRole === "Admin") && !isManager) && (
                <Button 
                    onClick={handleUploadPlanification}
                    className="bg-[#0068D1] hover:bg-[#0056a3] text-white flex items-center gap-1 hover:cursor-pointer"
                >
                    <Plus size={16} /> Cargar planificación
                </Button>
            )}
            </div>
        </div>
    );
};

export default TaskTableHeader;