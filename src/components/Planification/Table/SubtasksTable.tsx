import React, { useEffect, useState } from 'react';
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
  const [localSubtasks, setLocalSubtasks] = useState<ISubtask[]>([]);
  const [animatingRowIds, setAnimatingRowIds] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const filtered = subtasks.filter(subtask => subtask.taskId === taskId);
    
    const currentIds = new Set(localSubtasks.map(s => s.id));
    const newSubtasks = filtered.filter(s => !currentIds.has(s.id));
    
    if (newSubtasks.length > 0) {
      const newAnimations: Record<string, string> = {};
      newSubtasks.forEach(s => {
        newAnimations[s.id] = 'new';
      });
      setAnimatingRowIds(newAnimations);
      
      setTimeout(() => {
        setAnimatingRowIds({});
      }, 1000);
    }
    
    setLocalSubtasks(filtered);
  }, [subtasks, taskId]);
  
  const handleDelete = (id: string) => {
    setItemToDeleteId(id);
    setIsDeleteSubtaskModalOpen(true);
  };
  
  return (
    <td colSpan={10} className="bg-[#f8f8f8] font-[Helvetica]">
      <div className="flex flex-row justify-between items-center px-4 py-2">
        <h2 className="font-medium text-sm ml-4 text-black">Subtareas: {localSubtasks.length}</h2>
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
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Presupuesto (USD)</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Gasto (USD)</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Fecha Inicio</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Fecha Finalización</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Días Restantes</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Fecha de Término</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Estado</th> 
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#cacaca]">
          {localSubtasks.length > 0 ? (
            localSubtasks.map((subtask) => (
              <tr 
                key={subtask.id} 
                className={`${animatingRowIds[subtask.id] ? 'bg-[#f8f8f8] transition-colors duration-1000' : ''}`}
              >
                <td className="px-4 py-2">{subtask.name}</td>
                <td className="px-4 py-2">{Intl.NumberFormat('es-CL', {maximumFractionDigits: 0}).format(subtask.budget || 0) || "-"}</td>
                <td className="px-4 py-2">{Intl.NumberFormat('es-CL', {maximumFractionDigits: 0}).format(subtask.expense || 0) || "-"}</td>
                <td className="px-4 py-2">{formatDate(subtask.startDate)}</td>
                <td className="px-4 py-2">{formatDate(subtask.endDate)}</td>
                <td className="px-4 py-2">{getRemainingSubtaskDays(subtask)}</td>
                <td className="px-4 py-2">{formatDate(subtask.finalDate)}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    subtask.status?.name === "Completada" ? "bg-green-100 text-green-800" : 
                    subtask.status?.name === "En Proceso" ? "bg-blue-100 text-blue-800" :
                    subtask.status?.name === "En Espera" ? "bg-yellow-100 text-yellow-800" :
                    subtask.status?.name === "Cancelada" ? "bg-red-100 text-red-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {subtask.status?.name || "NO iniciada"}
                  </span>
                </td>
                <td className="px-4 py-2 flex flex-row">
                  <Pen
                    size={18}
                    color="#041e3e"
                    className="cursor-pointer mr-4"
                    onClick={() => handleGetSubtask(subtask.id)}
                  />
                  {userRole === "encargado cumplimiento" && (
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
                No hay subtareas creadas para esta tarea.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </td>
  );
};

export default SubtasksTable;