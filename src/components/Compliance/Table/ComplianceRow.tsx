import React from 'react';
import { ZoomIn } from "lucide-react";
import { ICompliance } from '@/app/models/ICompliance';
import { useComplianceTable } from '../../../app/features/compliance/hooks/useComplianceTable';

interface ComplianceRowProps {
  compliance: ICompliance;
  handleOnTaskClick: (id: string) => void;
  handleSeeInformation: (id: string, userRole: string) => void;
  userRole: string;
}

const ComplianceRow: React.FC<ComplianceRowProps> = ({
  compliance,
  handleOnTaskClick,
  handleSeeInformation,
  userRole
}) => {

  const { handleRemainingDays } = useComplianceTable();
  
  return (
    <tr className='font-[Helvetica] hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200'>
      <td
        className={`px-4 py-2 text-left text-black font-semibold border-r border-gray-200 ${userRole.toLowerCase() === "encargado cumplimiento" ? "" : "cursor-pointer"}`}
        onClick={() => handleOnTaskClick(compliance.id ?? '')}
      >
        {compliance.task.name.toUpperCase()}
      </td>
      <td className="px-2 py-2 text-center border-r border-gray-200">
        {compliance.registries[0].startDate ? 
          new Date(compliance.registries[0].startDate).toLocaleDateString('es-CL', {
            timeZone: 'UTC'
          }) : '-'
        }
      </td>
      <td className="px-2 py-2 text-center border-r border-gray-200">
        {compliance.registries[0].endDate ? 
          new Date(compliance.registries[0].endDate).toLocaleDateString('es-CL', {
            timeZone: 'UTC'
          }) : '-'
        }
      </td>
      <td className='px-2 py-2 text-center border-r border-gray-200'>
        {handleRemainingDays(compliance)}
      </td>
      <td className="py-2 text-center border-r border-gray-200">
        <span className={`px-2 py-1 rounded-full text-xs ${
          compliance.status?.name === "Completado" ? "bg-green-100 text-green-800" : 
          compliance.status?.name === "Gestionando Carta Aporte" ? "bg-[#90c2c9] text-[#0c3f46] " :
          compliance.status?.name === "Gestionando Minuta" ? "bg-blue-100 text-blue-800" :
          compliance.status?.name === "Gestionando MEMORANDUM y/o SOLPED" ? " bg-purple-100 text-purple-800" :
          compliance.status?.name === "HEM/HES registradas" ? "bg-[#c590c9] text-[#6f0779]" :
          "bg-gray-100 text-gray-800"
        }`}>
          {compliance.status?.name || "NO iniciado"}
        </span>
      </td>

      <td className="px-4 py-2 text-center flex flex-row">
        <ZoomIn
          size={20}
          color="#082C4B"
          className="cursor-pointer mr-4"
          onClick={() => handleSeeInformation(compliance.id ?? '', userRole)}
        />
      </td>
    </tr>
  );
};

export default ComplianceRow;