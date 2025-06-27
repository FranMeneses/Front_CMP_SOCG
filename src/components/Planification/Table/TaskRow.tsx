import React from 'react';
import { ITaskDetails } from "@/app/models/ITasks";
import { ZoomIn, Trash  } from "lucide-react";

interface TaskRowProps {
  task: ITaskDetails;
  formatDate: (date: string) => string;
  getRemainingDays: (task: ITaskDetails) => string | number;
  handleOnTaskClick: (id: string) => void;
  handleSeeInformation: (id: string, userRole: string) => void;
  setIsDeleteTaskModalOpen: (value: boolean) => void;
  setItemToDeleteId: (id: string) => void;
  userRole: string;
}

const TaskRow: React.FC<TaskRowProps> = ({
  task,
  formatDate,
  getRemainingDays,
  handleOnTaskClick,
  handleSeeInformation,
  setIsDeleteTaskModalOpen,
  setItemToDeleteId,
  userRole
}) => {
  
  const handleDelete = () => {
    setItemToDeleteId(task.id || '');
    setIsDeleteTaskModalOpen(true);
  };
  
  return (
    <tr className='font-[Helvetica] border-b border-gray-200'>
      <td
        className={`px-4 py-2 text-left text-black font-semibold cursor-pointer border-r border-gray-200`}
        onClick={() => handleOnTaskClick(task.id ?? '')}
      >
        {task.name.toUpperCase()}
      </td>
      <td className="py-2 text-center border-r border-gray-200">{Intl.NumberFormat('es-CL', {
            maximumFractionDigits: 0
        }).format(task.budget || 0) || "-"}</td>
      <td className="py-2 px-2 text-center border-r border-gray-200">{task.startDate ? formatDate(task.startDate) : "-"}</td>
      <td className="py-2 px-2 text-center border-r border-gray-200">{task.endDate ? formatDate(task.endDate) : "-"}</td>
      <td className="py-2 text-center border-r border-gray-200">{getRemainingDays(task)}</td>
      <td className="py-2 px-2 text-center border-r border-gray-200">{task.finishedDate ? formatDate(task.finishedDate) : "-"}</td>
      <td className="py-2 text-center border-r border-gray-200">
        <span className={`px-2 py-1 rounded-full text-xs ${
          task.status?.name === "Completada" ? "bg-[#ABF9B6] text-green-800 font-medium" : 
          task.status?.name === "En Proceso" ? "bg-[#FDC28E] text-[#C95E00] font-medium" :
          task.status?.name === "En Espera" ? "bg-[#F7F7B5] text-yellow-800 font-medium" :
          task.status?.name === "Cancelada" ? "bg-[#FFB9BB] text-red-800 font-medium" :
          task.status?.name === "En Cumplimiento" ? "bg-[#B4E0F7] text-[#128CCC] font-medium" :
          "bg-[#EAE9E8] text-gray-800 font-medium"
        }`}>
          {task.status?.name || "NO iniciada"}
        </span>
      </td>
      <td className="px-4 py-2 text-center flex flex-row">
        <ZoomIn
          size={20}
          color="#082C4B"
          className="cursor-pointer mr-4"
          onClick={() => handleSeeInformation(task.id ?? '', userRole)}
        />
        { userRole === 'Admin' && (
          <Trash
              size={20}
              color="#082C4B"
              className="cursor-pointer"
              onClick={handleDelete}
          />
        )}
      </td>
    </tr>
  );
};

export default TaskRow;