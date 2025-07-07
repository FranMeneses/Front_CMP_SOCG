'use client';
import React from "react";
import { useHooks } from "../../../app/features/hooks/useHooks";
import ComplianceRow from "./ComplianceRow";
import ComplianceModals from "../ComplianceModalForms";
import ComplianceFilters from "../ComplianceFilters";
import { ComplianceFormState, ICompliance, IComplianceForm } from "@/app/models/ICompliance";

interface ComplianceTableProps {
    compliance: ICompliance[];
    handleSeeInformation: (id: string) => void;
    handleOnTaskClick: (id: string) => void;
    setIsComplianceModalOpen: (open: boolean) => void;
    selectedCompliance: IComplianceForm | undefined;
    isComplianceModalOpen: boolean;
    handleUpdateCompliance: (compliance: ComplianceFormState) => void;
    handleCancelCompliance: () => void;
    selectedStatusFilter: string;
    filteredCompliance: ICompliance[];
    handleStatusFilterChange: (status: string) => void;
}

const ComplianceTable: React.FC<ComplianceTableProps> = ({ 
    compliance,
    handleSeeInformation,
    handleOnTaskClick,
    setIsComplianceModalOpen,
    selectedCompliance,
    isComplianceModalOpen,
    handleUpdateCompliance,
    handleCancelCompliance,
    selectedStatusFilter,
    filteredCompliance,
    handleStatusFilterChange,
}) => {
    const { currentValley, userRole } = useHooks();

    const handleUpdateComplianceWrapper = (partialCompliance: Partial<ComplianceFormState>) => {
        if (selectedCompliance) {
            const fullCompliance = {
                ...selectedCompliance,
                ...partialCompliance,
                id: selectedCompliance.id,
                name: selectedCompliance.task.name,
                description: selectedCompliance.task.description,
                task: selectedCompliance.task,
                statusId: partialCompliance.statusId ?? selectedCompliance.statusId,
            };
            handleUpdateCompliance(fullCompliance);
        } else {
            console.error("No hay un cumplimiento seleccionado para actualizar");
        }
    };

    return (
        <>
            {/* Filtros con padding reducido */}
            <div className="p-2 border-b border-gray-100">
                <ComplianceFilters
                    compliance={compliance}
                    selectedStatus={selectedStatusFilter}
                    onStatusChange={handleStatusFilterChange}
                />
            </div>
            {/* Tabla compacta y centrada con padding superior */}
            <div className="max-w-3xl mx-auto pt-8 mb-8">
                <div className="overflow-x-auto rounded-lg shadow font-[Helvetica] border border-gray-100">
                    <table className="w-full border-collapse text-sm">
                        <thead className="bg-gray-50">
                            <tr className="text-xs text-gray-700">
                                <th className="py-1 text-center font-medium text-gray-500 truncate border-r border-gray-100">{("Nombre").toUpperCase()}</th>
                                <th className="py-1 text-center font-medium text-gray-500 truncate border-r border-gray-100">{("Estado").toUpperCase()}</th>
                                <th colSpan={3} className="py-1 text-center font-medium text-gray-500 truncate"/>
                            </tr>
                        </thead>
                        <tbody className="bg-white text-xs divide-y divide-gray-100">
                            {filteredCompliance.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center py-6 text-gray-400">
                                        No hay registros de cumplimiento. ¡Agrega uno nuevo!
                                    </td>
                                </tr>
                            ) : (
                                filteredCompliance.map((compliance) => (
                                    <React.Fragment key={compliance.id}>
                                        <ComplianceRow 
                                            compliance={compliance}
                                            handleOnTaskClick={handleOnTaskClick}
                                            handleSeeInformation={handleSeeInformation}
                                            userRole={userRole}
                                        />
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <ComplianceModals
                isComplianceModalOpen={isComplianceModalOpen}
                selectedCompliance={selectedCompliance}
                setIsComplianceModalOpen={setIsComplianceModalOpen}
                handleUpdateCompliance={handleUpdateComplianceWrapper}
                handleCancelCompliance={handleCancelCompliance}
                currentValleyName={currentValley?.name}
                userRole={userRole}
            />
        </>
    );
};

export default ComplianceTable;