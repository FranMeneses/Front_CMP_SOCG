import React from 'react';
import { ISubtask } from "@/app/models/ISubtasks";
import { Pen, Trash, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubtasksTableProps {
  subtasks: ISubtask[];
  taskId: string;
  formatDate: (date: string) => string;
  getRemainingSubtaskDays: (subtask: ISubtask) => string | number;
  handleGetSubtask: (id: string) => void;
  setIsDeleteSubtaskModalOpen: (value: boolean) => void;
  setItemToDeleteId: (id: string) => void;
  setIsPopupSubtaskOpen: (value: boolean) => void;
  userRole: string;
}

const SubtasksTable: React.FC<SubtasksTableProps> = ({
  subtasks,
  taskId,
  formatDate,
  getRemainingSubtaskDays,
  handleGetSubtask,
  setIsDeleteSubtaskModalOpen,
  setItemToDeleteId,
  setIsPopupSubtaskOpen,
  userRole
}) => {
  
  const filteredSubtasks = subtasks.filter(subtask => subtask.taskId === taskId);
  
  const handleDelete = (id: string) => {
    setItemToDeleteId(id);
    setIsDeleteSubtaskModalOpen(true);
  };
  
  return (
    <td colSpan={10} className="bg-[#f8f8f8]">
      <div className="flex flex-row justify-between items-center px-4 py-2">
        <h2 className="font-medium text-sm ml-4 text-black">Subtareas:</h2>
        <Button
          onClick={() => setIsPopupSubtaskOpen(true)}
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 hover:bg-gray-200"
        >
          <Plus size={16} color="black" />
        </Button>
      </div>
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Nombre</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Descripción</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Faena</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Presupuesto</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Fecha Inicio</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Fecha Finalización</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Días Restantes</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Fecha de Termino</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#cacaca]">
          {filteredSubtasks.length > 0 ? (
            filteredSubtasks.map((subtask) => (
              <tr key={subtask.id}>
                <td className="px-4 py-2">{subtask.name}</td>
                <td className="px-4 py-2">{subtask.description}</td>
                <td className="px-4 py-2">-</td>
                <td className="px-4 py-2">{subtask.budget}</td>
                <td className="px-4 py-2">{formatDate(subtask.startDate)}</td>
                <td className="px-4 py-2">{formatDate(subtask.endDate)}</td>
                <td className="px-4 py-2">{getRemainingSubtaskDays(subtask)}</td>
                <td className="px-4 py-2">{formatDate(subtask.finalDate)}</td>
                <td className="px-4 py-2 flex flex-row">
                  <Pen
                    size={18}
                    color="#041e3e"
                    className="cursor-pointer mr-4"
                    onClick={() => handleGetSubtask(subtask.id)}
                  />
                  {userRole === "Admin" && (
                    <Trash
                      size={20}
                      color="#041e3e"
                      className="cursor-pointer"
                      onClick={() => handleDelete(subtask.id)}
                    />
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="px-4 py-2 text-center text-gray-500">
                No hay subtareas disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </td>
  );
};

export default SubtasksTable;