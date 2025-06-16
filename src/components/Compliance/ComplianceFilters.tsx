import React from 'react';
import { ICompliance } from '@/app/models/ICompliance';

interface ComplianceFiltersProps {
  compliance: ICompliance[];
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

const ComplianceFilters: React.FC<ComplianceFiltersProps> = ({
  compliance,
  selectedStatus,
  onStatusChange
}) => {
  const uniqueStatuses = React.useMemo(() => {
    const statuses = compliance.map(item => item.status?.name || "NO iniciado");
    const uniqueSet = Array.from(new Set(statuses));
    
    const statusOrder = [
      "NO iniciado",
      "Gestionando Carta Aporte", 
      "Gestionando Minuta",
      "Gestionando MEMORANDUM y/o SOLPED",
      "HEM/HES registradas",
      "Completado"
    ];
    
    return uniqueSet.sort((a, b) => {
      const indexA = statusOrder.indexOf(a);
      const indexB = statusOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [compliance]);


  const handleStatusClick = (status: string) => {
    if (selectedStatus === status) {
        onStatusChange('');
    } else {
        onStatusChange(status);
    }
  };


  const getButtonStyle = (status: string) => {
    const isSelected = selectedStatus === status;
    
    const baseStyle = "px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200";
    
    if (isSelected) {
      switch (status) {
        case "Completado":
          return `${baseStyle} bg-green-100 text-green-800 border border-green-200`;
        case "Gestionando Carta Aporte":
          return `${baseStyle} bg-[#90c2c9] text-[#0c3f46] border border-[#90c2c9]`;
        case "Gestionando Minuta":
          return `${baseStyle} bg-blue-100 text-blue-800 border border-blue-200`;
        case "Gestionando MEMORANDUM y/o SOLPED":
          return `${baseStyle} bg-purple-100 text-purple-800 border border-purple-200`;
        case "HEM/HES registradas":
          return `${baseStyle} bg-[#c590c9] text-[#6f0779] border border-[#c590c9]`;
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
        {uniqueStatuses.map((status) => (
          <button
            key={status}
            onClick={() => handleStatusClick(status)}
            className={getButtonStyle(status)}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ComplianceFilters;