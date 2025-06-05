import React from 'react';
import { ZoomIn, Plus } from "lucide-react";
import { Button } from '@/components/ui/button';
import { ICompliance } from '@/app/models/ICompliance';

interface TaskRowProps {
  compliance: ICompliance;
  handleOnTaskClick: (id: string) => void;
  handleSeeInformation: (id: string, userRole: string) => void;
  userRole: string;
}

const TaskRow: React.FC<TaskRowProps> = ({
  compliance,
  handleOnTaskClick,
  handleSeeInformation,
  userRole
}) => {

  
  return (
    <tr>
      <td
        className={`px-4 py-2 text-left text-black font-semibold ${userRole.toLowerCase() === "encargado cumplimiento" ? "" : "curor-pointer"}`}
        onClick={() => handleOnTaskClick(compliance.id ?? '')}
      >
        {compliance.task.name.toUpperCase()}
      </td>
      <td className="py-2 text-center">
        <span className={`px-2 py-1 rounded-full text-xs ${
          compliance.status?.name === "Completada" ? "bg-green-100 text-green-800" : 
          compliance.status?.name === "En Proceso" ? "bg-blue-100 text-blue-800" :
          compliance.status?.name === "En Espera" ? "bg-yellow-100 text-yellow-800" :
          compliance.status?.name === "Cancelada" ? "bg-red-100 text-red-800" :
          compliance.status?.name === "En Cumplimiento" ? "bg-purple-100 text-purple-800 font-medium" :
          "bg-gray-100 text-gray-800"
        }`}>
          {compliance.status?.name || "NO iniciado"}
        </span>
      </td>
      <td className="px-4 py-2 text-center flex flex-row">
        <ZoomIn
          size={20}
          color="#041e3e"
          className="cursor-pointer mr-4"
          onClick={() => handleSeeInformation(compliance.id ?? '', userRole)}
        />
      </td>
    </tr>
  );
};

export default TaskRow;