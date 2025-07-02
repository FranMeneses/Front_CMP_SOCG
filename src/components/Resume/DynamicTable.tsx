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
  const [infoTask, setInfoTask] = useState<any>(null);
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
          {tasks.map((task) => (
            <React.Fragment key={task.id}>
              <tr
                className="hover:bg-gray-50 text-sm cursor-pointer"
                onClick={() => handleRowClick(task)}
              >
                <td className="text-center px-4 py-2 border-b border-gray-300">
                  {task.name}
                </td>
                <td className="px-4 py-2 text-center border-b border-gray-300">
                  {task.id ? (budgets[task.id] !== undefined ? budgets[task.id] : "-") : "-"}
                </td>
                <td className="px-4 py-2 text-center border-b border-gray-300">
                  {task.id ? (expenses[task.id] !== undefined ? expenses[task.id] : "-") : "-"}
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
                      task.status?.name === "En Cumplimiento" ? "bg-[#B4E0F7] text-[#128CCC]" :
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
                      {[1, 2, 3].includes(task.processId ?? -1) ? (
                        <>
                          <strong>Descripción:</strong> {infoTask.task?.description}<br />
                          <strong>Origen:</strong> {infoTaskNames.origin.find((info: IInfoTask) => info.id === infoTask.originId)?.name || "-"}<br />
                          <strong>Inversión:</strong> {infoTaskNames.investment.find((info: IInfoTask) => info.id === infoTask.investmentId)?.line || "-"}<br />
                          <strong>Tipo:</strong> {infoTaskNames.type.find((info: IInfoTask) => info.id === infoTask.typeId)?.name || "-"}<br />
                          <strong>Alcance:</strong> {infoTaskNames.scope.find((info: IInfoTask) => info.id === infoTask.scopeId)?.name || "-"}<br />
                          <strong>Interacción:</strong> {infoTaskNames.interaction.find((info: IInfoTask) => info.id === infoTask.interactionId)?.operation || "-"}<br />
                          <strong>Riesgo:</strong> {infoTaskNames.risk.find((info: IInfoTask) => info.id === infoTask.riskId)?.type || "-"}<br />
                        </>
                      ) : (
                        <>
                          <strong>Descripción:</strong> {infoTask.description}<br />
                          <strong>Porcentaje de avance:</strong> {task.id && taskProgressMap && taskProgressMap[task.id] !== undefined ? `${taskProgressMap[task.id]}%` : "-"}
                        </>
                      )}
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