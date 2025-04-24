'use client'
import React from "react";
import { ManagementTableColumns,specialistTableColums } from "@/constants/tableConstants";

export interface Subtask {
  id: string;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  complianceStatus: string;
}

export interface Task {
  id: string;
  code: string;
  name: string;
  origin: string;
  type: string;
  scope: string;
  operationalInteraction: string;
  operationalRisk: string;
  compliance: string;
  priority: string;
  status: string;
  assigned: string;
  budget: number;
  actualExpense: number;
  gcBudget: number;
  difference: number;
  accountingMonth: string;
  startDate: string;
  endDate: string;
  remainingDays: number;
  finishDate: string;
  progress: number;
  subtasks: Subtask[];
}

interface DynamicTableProps {
  tasks: Task[];
  selectedTaskId: string | null;
  onTaskClick: (taskId: string) => void;
  userRole: "manager" | "specialist";
}

const getColor = (percentage: number) => {
  if (percentage === 100) return "bg-green-500";
  if (percentage > 30 && percentage < 100) return "bg-yellow-500";
  return "bg-red-500";
};

const DynamicTable: React.FC<DynamicTableProps> = ({
  tasks,
  selectedTaskId,
  onTaskClick,
  userRole,
}) => {
  return (
    <div className="overflow-y-scroll md:h-82 2xl:h-170">
      <table className="table-auto w-full">
        <thead className="bg-white">
          <tr className="text-sm">
            {userRole === "manager" ? (
              ManagementTableColumns.map((column,index) => (
                <th
                  key={index}
                  className={`px-4 py-2 text-start font-bold text-[#7D7D7D]`}
                >
                  {column}
                </th>
              ))
            ) : (
              specialistTableColums.map((column, index) => (
                <th
                  key={index}
                  className={`px-4 py-2 text-center font-bold text-[#7D7D7D]`}
                >
                  {column}
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
                onClick={() => onTaskClick(task.id)}
              >
                <td className="text-center px-4 py-2 border-b border-gray-300">
                  {`"`+ task.name +`"`}
                </td>
                <td className="px-4 py-2 text-center border-b border-gray-300">
                  {task.remainingDays}
                </td>
                <td className="px-4 py-2 text-center border-b border-gray-300">
                  {task.endDate}
                </td>
                <td className="px-4 py-2 text-center border-b border-gray-300">
                  {userRole === "manager" ? (
                    <div className="flex items-center text-end relative">
                    <div
                      className={`h-4 ${getColor(task.progress)} rounded`}
                      style={{ width: `${task.progress}%` }}>
                    </div>
                    <h3 className="absolute text-sm font-medium text-white ml-2">
                      {task.progress}%
                    </h3>
                  </div> ): ('')
                  }
                </td>
              </tr>

              {selectedTaskId === task.id &&
                task.subtasks.map((subtask) => (
                  <tr
                    key={subtask.id}
                    className="bg-gray-100 text-sm text-gray-700 font-medium"
                  >
                    <td className="text-center px-4 py-2 border-b border-gray-300 pl-8">
                      {subtask.name}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300 pl-8"/>
                    <td
                      className="px-4 py-2 text-center border-b border-gray-300"
                    >
                      {subtask.endDate}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300 pl-8">
                      {userRole === "manager" ? (
                        <div className="flex items-center text-end relative">
                          <div 
                            className={`h-4 ${getColor(subtask.progress)} rounded`}
                            style={{ width: `${subtask.progress}%` }}>
                          </div>
                          <h3 className="absolute text-sm font-medium text-white ml-2">
                            {subtask.progress}%
                          </h3>
                        </div>): 
                        (<h3 className="text-sm font-medium text-gray-700 text-center">
                          {subtask.complianceStatus}
                        </h3>)
                      }
                    </td>
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;