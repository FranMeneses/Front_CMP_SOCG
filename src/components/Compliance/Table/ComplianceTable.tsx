'use client';
import React from "react";
import { useCompliance } from "../../../app/features/compliance/hooks/useCompliance";
import { useHooks } from "../../../app/features/hooks/useHooks";
import ComplianceRow from "./ComplianceRow";
import ComplianceModals from "../ComplianceModalForms";
import ComplianceFilters from "../ComplianceFilters";
import { ICompliance } from "@/app/models/ICompliance";

interface ComplianceTableProps {
    compliance: ICompliance[];
}

const ComplianceTable: React.FC<ComplianceTableProps> = ({ 
    compliance, 
}) => {
    const { 
        handleSeeInformation, 
        handleOnTaskClick,
        setIsComplianceModalOpen,
        activeFilter: hookActiveFilter,
        selectedCompliance,
        isComplianceModalOpen,
        handleUpdateCompliance,
        handleCancelCompliance,
        selectedStatusFilter,
        filteredCompliance,
        handleStatusFilterChange,
    } = useCompliance();

    const { currentValleyName, userRole } = useHooks();

    return (
        <div>
            <ComplianceFilters
                compliance={compliance}
                selectedStatus={selectedStatusFilter}
                onStatusChange={handleStatusFilterChange}
            />
            
            <div className="overflow-x-auto rounded-lg shadow font-[Helvetica]">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr className="text-sm text-gray-700">
                            <th className="py-2 text-center text-xs font-medium text-gray-500 truncate">Nombre</th>
                            <th className="py-2 px-2 text-center text-xs font-medium text-gray-500 truncate">Fecha Inicio</th>
                            <th className="py-2 px-2 text-center text-xs font-medium text-gray-500 truncate">Fecha Finalización</th>
                            <th className="py-2 px-2 text-center text-xs font-medium text-gray-500 truncate">Días Restantes</th>
                            <th className="py-2 text-center text-xs font-medium text-gray-500 truncate">Estado</th>
                            <th colSpan={3}/>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-xs truncate divide-y divide-[#e5e5e5]">
                        {filteredCompliance.map((compliance) => (
                            <React.Fragment key={compliance.id}>
                                <ComplianceRow 
                                    compliance={compliance}
                                    handleOnTaskClick={handleOnTaskClick}
                                    handleSeeInformation={handleSeeInformation}
                                    userRole={userRole}
                                />
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                
                {filteredCompliance.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No se encontraron registros para el estado seleccionado.
                    </div>
                )}
            </div>
            
            <ComplianceModals
                isComplianceModalOpen={isComplianceModalOpen}
                selectedCompliance={selectedCompliance}
                setIsComplianceModalOpen={setIsComplianceModalOpen}
                handleUpdateCompliance={handleUpdateCompliance}
                handleCancelCompliance={handleCancelCompliance}
                currentValleyName={currentValleyName}
                userRole={userRole}
            />
        </div>
    );
};

export default ComplianceTable;