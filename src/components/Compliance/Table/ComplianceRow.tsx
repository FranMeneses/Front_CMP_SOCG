import React from 'react';
import { ZoomIn } from "lucide-react";
import { ICompliance } from '@/app/models/ICompliance';

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

  // const { handleRemainingDays } = useComplianceTable();
  
  return (
    <tr className='font-[Helvetica] hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200'>
      <td
        className={`px-4 py-2 text-left text-black font-semibold border-r border-gray-200 ${(userRole === "Encargado Cumplimiento" || userRole === 'Admin') ? "" : "cursor-pointer"}`}
        onClick={() => handleOnTaskClick(compliance.id ?? '')}
      >
        {compliance.task.name.toUpperCase()}
      </td>
      <td className="py-2 text-center border-r border-gray-200">
        <span className={`px-2 py-1 rounded-full text-xs ${
          compliance.status?.name === "Completado" ? "bg-green-100 text-green-800" :
          compliance.status?.name === "Ingreso solicitud(formulario donaciones)" ? "bg-yellow-100 text-yellow-800" :
          compliance.status?.name === "Carta conductora" ? "bg-blue-100 text-blue-800" :
          compliance.status?.name === "Minuta/Acta comité donaciones" ? "bg-purple-100 text-purple-800" :
          compliance.status?.name === "Autorización (GG, CD o Directorio)" ? "bg-pink-100 text-pink-800" :
          compliance.status?.name === "Transferencia recursos/Orden compra" ? "bg-orange-100 text-orange-800" :
          compliance.status?.name === "Pago (HEM/HES/Comprobante transferencia)" ? "bg-indigo-100 text-indigo-800" :
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