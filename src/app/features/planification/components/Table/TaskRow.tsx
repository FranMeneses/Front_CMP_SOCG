import React, { use } from 'react';
import { ITaskDetails } from "@/app/models/ITasks";
import { ZoomIn, Trash, Plus } from "lucide-react";
import { Button } from '@/components/ui/button';

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
    <tr className='font-[Helvetica]'>
      <td
        className={`px-4 py-2 text-left text-black font-semibold cursor-pointer`}
        onClick={() => handleOnTaskClick(task.id ?? '')}
      >
        {task.name.toUpperCase()}
      </td>
      <td className="py-2 text-center">{task.budget || "-"}</td>
      <td className="py-2 px-2 text-center">{task.startDate ? formatDate(task.startDate) : "-"}</td>
      <td className="py-2 px-2 text-center">{task.endDate ? formatDate(task.endDate) : "-"}</td>
      <td className="py-2 text-center">{getRemainingDays(task)}</td>
      <td className="py-2 px-2 text-center">{task.finishedDate ? formatDate(task.finishedDate) : "-"}</td>
      <td className="py-2 text-center">
        <span className={`px-2 py-1 rounded-full text-xs ${
          task.status?.name === "Completada" ? "bg-green-100 text-green-800" : 
          task.status?.name === "En Proceso" ? "bg-blue-100 text-blue-800" :
          task.status?.name === "En Espera" ? "bg-yellow-100 text-yellow-800" :
          task.status?.name === "Cancelada" ? "bg-red-100 text-red-800" :
          task.status?.name === "En Cumplimiento" ? "bg-purple-100 text-purple-800 font-medium" :
          "bg-gray-100 text-gray-800"
        }`}>
          {task.status?.name || "NO iniciada"}
        </span>
      </td>
      <td className="px-4 py-2 text-center flex flex-row">
        <ZoomIn
          size={20}
          color="#041e3e"
          className="cursor-pointer mr-4"
          onClick={() => handleSeeInformation(task.id ?? '', userRole)}
        />
        {userRole === 'encargado cumplimiento' && (
          <Trash
              size={20}
              color="#041e3e"
              className="cursor-pointer"
              onClick={handleDelete}
          />
        )}
      </td>
    </tr>
  );
};

export default TaskRow;