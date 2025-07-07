'use client';
import React, { useEffect, useState } from "react";
import { ManagementTableColumns } from "@/constants/tableConstants";
import { IInfoTask, ITask } from "@/app/models/ITasks";
import { ISubtask } from "@/app/models/ISubtasks";
import { useDynamicTable } from "../../app/features/resume/hooks/useDynamicTable";
import { useLazyQuery } from '@apollo/client';
import { GET_TASK_INFO } from '@/app/api/infoTask';

interface DynamicTableProps {
  tasks: ITask[];
  selectedTaskId: string | null;
  subtasks: ISubtask[]; 
  onTaskClick: (taskId: string) => void;
  userRole: string;
}

const DynamicTable: React.FC<DynamicTableProps> = ({
  tasks,

}) => {

  const { handleGetTaskBudget, handleGetTaskExpenses, handleGetComplianceStatus, taskProgressMap, infoTaskNames } = useDynamicTable(tasks);

  const [budgets, setBudgets] = useState<Record<string, number | null>>({});
  const [expenses, setExpenses] = useState<Record<string, number | null>>({});
  const [complianceStatuses, setComplianceStatuses] = useState<Record<string, string>>({});
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [infoTask, setInfoTask] = useState<IInfoTask | { description: string } | null>(null);
  const [getTaskInfo] = useLazyQuery(GET_TASK_INFO);

  useEffect(() => {
    const fetchData = async () => {
      const newBudgets: Record<string, number | null> = { ...budgets };
      const newExpenses: Record<string, number | null> = { ...expenses };
      const newComplianceStatuses: Record<string, string> = { ...complianceStatuses };
      const tasksToFetch: string[] = [];
      for (const task of tasks) {
        if (task.id) {
          if (newBudgets[task.id] === undefined) {
            tasksToFetch.push(task.id);
          }
        }
      }
      await Promise.all(tasksToFetch.map(async (taskId) => {
        newBudgets[taskId] = await handleGetTaskBudget(taskId);
        newExpenses[taskId] = await handleGetTaskExpenses(taskId);
        newComplianceStatuses[taskId] = await handleGetComplianceStatus(taskId);
      }));
      setBudgets({ ...newBudgets });
      setExpenses({ ...newExpenses });
      setComplianceStatuses({ ...newComplianceStatuses });
    };
    if (tasks.length > 0) {
      fetchData();
    }
  }, [tasks]);

  /**
   * Función para manejar la apertura de las filas
   * @param task 
   */
  const handleRowClick = async (task: ITask) => {
    if ([1, 2, 3].includes(task.processId ?? -1)) {
      if (expandedTaskId === task.id) {
        setExpandedTaskId(null);
        setInfoTask(null);
      } else {
        setExpandedTaskId(task.id!);
        const { data } = await getTaskInfo({ variables: { id: task.id } });
        setInfoTask(data?.taskInfo || null);
      }
    } else {
      if (expandedTaskId === task.id) {
        setExpandedTaskId(null);
        setInfoTask(null);
      } else {
        setExpandedTaskId(task.id!);
        setInfoTask({ description: task.description });
      }
    }
  };

  /**
   * Función para formatear valores númericos a forma chilena
   * @param value Monto a formatear
   * @returns 
   */
  function formatCLP(value: number | null | undefined): string {
    if (value === null || value === undefined) return "-";
    return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(value);
  }

  // Orden de prioridad de los estados
  const statusOrder = [
    'Completada',
    'En Proceso',
    'Due Diligence',
    'En Espera',
    'No Iniciada',
    undefined,
    null
  ];

  // Función para obtener el índice de orden
  function getStatusOrder(statusName?: string | null): number {
    if (!statusName) return statusOrder.length;
    const idx = statusOrder.findIndex(s => s?.toLowerCase() === statusName.toLowerCase());
    return idx === -1 ? statusOrder.length : idx;
  }

  // Ordenar las tareas según el estado
  const sortedTasks = [...tasks].sort((a, b) => {
    const aStatus = a.status?.name || (a.statusId === undefined ? 'No Iniciada' : undefined);
    const bStatus = b.status?.name || (b.statusId === undefined ? 'No Iniciada' : undefined);
    return getStatusOrder(aStatus) - getStatusOrder(bStatus);
  });

  if (!tasks || tasks.length === 0) {
    return (
      <div className="w-full text-center text-gray-500 py-8">
        No hay tareas planificadas.
      </div>
    );
  }

  return (
    <div className="overflow-y-scroll md:h-82 2xl:h-170 font-[Helvetica]">
      <table className="table-auto w-full">
        <thead className="bg-white">
          <tr className="text-sm">
            {(
              ManagementTableColumns.map((column, index) => (
                <th
                  key={index}
                  className={`px-4 py-2 text-center font-medium text-[#7D7D7D] border-b border-gray-300 truncate`}
                >
                  {column.toUpperCase()}
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody className="font-medium">
          {sortedTasks.map((task) => (
            <React.Fragment key={task.id}>
              <tr
                className="hover:bg-gray-50 text-sm cursor-pointer"
                onClick={() => handleRowClick(task)}
              >
                <td className="text-left px-4 py-2 border-b border-gray-300">
                  {task.name}
                </td>
                <td className="px-4 py-2 text-center border-b border-gray-300">
                  {task.id ? (budgets[task.id] !== undefined ? formatCLP(budgets[task.id]) : "-") : "-"}
                </td>
                <td className="px-4 py-2 text-center border-b border-gray-300">
                  {task.id ? (expenses[task.id] !== undefined ? formatCLP(expenses[task.id]) : "-") : "-"}
                </td>
                <td className="px-4 py-2 text-center border-b border-gray-300">
                  {task.id ? (
                    <span
                      className={
                        complianceStatuses[task.id] === "Completado"
                          ? "inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-200 text-green-800"
                          : complianceStatuses[task.id] === "No Aplica"
                          ? "inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800"
                          : "inline-block px-3 py-1 rounded-full text-xs font-medium bg-red-200 text-red-800"
                      }
                    >
                      {complianceStatuses[task.id] ? complianceStatuses[task.id].toUpperCase() : "-"}
                    </span>
                  ) : "-"}
                </td>
                <td className="px-4 py-2 text-center border-b border-gray-300">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${task.status?.name === "Completada" ? "bg-[#ABF9B6] text-green-800" :
                      task.status?.name === "En Proceso" ? "bg-[#FDC28E] text-[#C95E00]" :
                      task.status?.name === "En Espera" ? "bg-[#F7F7B5] text-yellow-800" :
                      task.status?.name === "Cancelada" ? "bg-[#FFB9BB] text-red-800" :
                      task.status?.name === "Due Diligence" ? "bg-[#B4E0F7] text-[#128CCC]" :
                      "bg-[#EAE9E8] text-gray-800"}`}
                  >
                    {task.status?.name?.toUpperCase() || "NO INICIADA"}
                  </span>
                </td>
              </tr>
              {expandedTaskId === task.id && infoTask && (
                <tr>
                  <td colSpan={ManagementTableColumns.length} className="bg-gray-50 p-4 border-b border-gray-300">
                    <div>
                      {(() => {
                        const isRelationshipTask = typeof task.processId === 'number' && [1, 2, 3].includes(task.processId) && 'task' in infoTask;
                        
                                                 if (isRelationshipTask) {
                           // Obtener descripción de forma segura
                           let description = '-';
                           if ('task' in infoTask && infoTask.task?.description) {
                             description = infoTask.task.description;
                           } else if ('description' in infoTask && infoTask.description && typeof infoTask.description === 'string') {
                             description = infoTask.description;
                           }
                          
                          return (
                            <>
                              <div className="mb-3">
                                <strong>Descripción:</strong> {description}
                              </div>
                              <div className="mb-3">
                                <strong>Porcentaje de avance:</strong> {task.id && taskProgressMap && taskProgressMap[task.id] !== undefined ? `${Number(taskProgressMap[task.id]).toFixed(2)}%` : "-"}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  <strong>Origen:</strong> {infoTaskNames.origin.find((info: IInfoTask) => Number(info.id) === Number((infoTask as IInfoTask).originId))?.name || "-"}
                                </div>
                                <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <strong>Inversión:</strong> {infoTaskNames.investment.find((info: IInfoTask) => Number(info.id) === Number((infoTask as IInfoTask).investmentId))?.line || "-"}
                                </div>
                                <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  <strong>Tipo:</strong> {infoTaskNames.type.find((info: IInfoTask) => Number(info.id) === Number((infoTask as IInfoTask).typeId))?.name || "-"}
                                </div>
                                <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  <strong>Alcance:</strong> {infoTaskNames.scope.find((info: IInfoTask) => Number(info.id) === Number((infoTask as IInfoTask).scopeId))?.name || "-"}
                                </div>
                                <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                  <strong>Interacción:</strong> {infoTaskNames.interaction.find((info: IInfoTask) => Number(info.id) === Number((infoTask as IInfoTask).interactionId))?.operation || "-"}
                                </div>
                                <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  <strong>Riesgo:</strong> {infoTaskNames.risk.find((info: IInfoTask) => Number(info.id) === Number((infoTask as IInfoTask).riskId))?.type || "-"}
                                </div>
                              </div>
                            </>
                          );
                        } else {
                          return (
                            <>
                              <strong>Descripción:</strong> {infoTask && 'description' in infoTask ? infoTask.description : "-"}<br />
                              <strong>Porcentaje de avance:</strong> {task.id && taskProgressMap && taskProgressMap[task.id] !== undefined ? `${Number(taskProgressMap[task.id]).toFixed(2)}%` : "-"}
                            </>
                          );
                        }
                      })()}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;