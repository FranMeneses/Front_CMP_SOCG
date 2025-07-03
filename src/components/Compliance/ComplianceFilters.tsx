import React from 'react';
import { ICompliance, IComplianceStatus } from '@/app/models/ICompliance';
import { Button } from '../ui/button';
import { useQuery } from '@apollo/client';
import { GET_COMPLIANCE_STATUSES } from '@/app/api/compliance';

interface ComplianceFiltersProps {
  compliance: ICompliance[];
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

const ComplianceFilters: React.FC<ComplianceFiltersProps> = ({
  selectedStatus,
  onStatusChange
}) => {
    
    const { data: StatusData, loading, error } = useQuery(GET_COMPLIANCE_STATUSES);

    // Manejar estados de carga y error
    if (loading) {
        return (
            <div className="mb-4 p-4 bg-white rounded-lg">
                <div className="flex flex-wrap gap-2 items-center">
                    <div className="animate-pulse bg-gray-200 h-10 w-24 rounded-md"></div>
                    <div className="animate-pulse bg-gray-200 h-10 w-32 rounded-md"></div>
                    <div className="animate-pulse bg-gray-200 h-10 w-28 rounded-md"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">Error al cargar los estados de cumplimiento</p>
            </div>
        );
    }

    // Verificar que StatusData existe y tiene la propiedad esperada
    const statuses = StatusData?.getAllComplianceStatuses?.map((status: IComplianceStatus) => status.name) || [];

    const handleStatusClick = (status: string) => {
        if (selectedStatus === status) {
            onStatusChange('');
        } else {
            onStatusChange(status);
        }
    };


    const getButtonStyle = (status: string) => {
        const isSelected = selectedStatus === status;
        
        const baseStyle = "px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer";
        
        if (isSelected) {
        switch (status) {
            case "Completado":
            return `${baseStyle} bg-green-100 text-green-800 border border-green-200`;
            case "Ingreso solicitud(formulario donaciones)":
            return `${baseStyle} bg-yellow-100 text-yellow-800 border border-yellow-200`;
            case "Carta conductora":
            return `${baseStyle} bg-blue-100 text-blue-800 border border-blue-200`;
            case "Minuta/Acta comité donaciones":
            return `${baseStyle} bg-purple-100 text-purple-800 border border-purple-200`;
            case "Autorización (GG, CD o Directorio)":
            return `${baseStyle} bg-pink-100 text-pink-800 border border-pink-200`;
            case "Transferencia recursos/Orden compra":
            return `${baseStyle} bg-orange-100 text-orange-800 border border-orange-200`;
            case "Pago (HEM/HES/Comprobante transferencia)":
            return `${baseStyle} bg-indigo-100 text-indigo-800 border border-indigo-200`;
            case "NO iniciado":
            return `${baseStyle} bg-gray-100 text-gray-800 border border-gray-200`;
            case "Cancelada":
            return `${baseStyle} bg-red-100 text-red-800 border border-red-200`;
            default:
            return `${baseStyle} bg-gray-100 text-gray-800 border border-gray-200`;
        }
        } else {
        return `${baseStyle} bg-white text-gray-700 border border-gray-300 hover:bg-gray-50`;
        }
    };

    return (
        <div className="mb-4 p-4 bg-white rounded-lg ">
        <div className="flex flex-wrap gap-2 items-center">
            {statuses.map((status: string) => (
            <Button
                variant={"outline"}
                key={status}
                onClick={() => handleStatusClick(status)}
                className={getButtonStyle(status)}
            >
                {status.toUpperCase()}
            </Button>
            ))}
        </div>
        </div>
    );
};

export default ComplianceFilters;