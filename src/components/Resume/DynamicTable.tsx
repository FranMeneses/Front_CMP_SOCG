'use client';
import React from "react";
import { ManagementTableColumns } from "@/constants/tableConstants";
import { ITask } from "@/app/models/ITasks";
import { ISubtask } from "@/app/models/ISubtasks";
import { useDynamicTable } from "../../app/features/resume/hooks/useDynamicTable";

interface DynamicTableProps {
  tasks: ITask[];
  selectedTaskId: string | null;
  subtasks: ISubtask[]; 
  onTaskClick: (taskId: string) => void;
  userRole: string;
}

const DynamicTable: React.FC<DynamicTableProps> = ({
  tasks,
  selectedTaskId,
  subtasks,
  onTaskClick,
}) => {

  const { getColor, formatDate, calculateRemainingDays, getWidth, taskProgressMap } = useDynamicTable(tasks);

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
                onClick={() => onTaskClick(task.id ?? '')}
              >
                <td className="text-center px-4 py-2 border-b border-gray-300">
                  {`"` + task.name + `"`}
                </td>
                <td className="px-4 py-2 text-center border-b border-gray-300">
                  {" "}
                </td>
                <td className="px-4 py-2 text-center border-b border-gray-300">
                  {" "}
                </td>
                <td className="px-4 py-2 text-center border-b border-gray-300">
                    <div className="flex items-center text-end relative">
                      <div
                        className={`h-4 ${getColor(taskProgressMap[task.id ?? ''] || 0)} rounded ${getWidth(taskProgressMap[task.id ?? ''] || 0)}`}
                      ></div>
                      <h3
                        className={`absolute text-sm font-medium ml-2 ${
                          taskProgressMap[task.id ?? ''] == 0 ? "text-black" : "text-white"
                        }`}
                      >
                        {taskProgressMap[task.id ?? '']?.toFixed() || 0}%
                      </h3>
                    </div>
                </td>
              </tr>

              {selectedTaskId === task.id &&
                subtasks.filter(subtask => subtask.taskId === task.id).map((subtask) => (
                  <tr
                    key={subtask.id}
                    className="bg-gray-100 text-sm text-gray-700 font-medium"
                  >
                    <td className="text-center px-4 py-2 border-b border-gray-300 pl-8">
                      {subtask.name}
                    </td>
                    <td className="px-4 py-2 text-center border-b border-gray-300 pl-8">
                      {calculateRemainingDays(subtask)}
                    </td>
                    <td className="px-4 py-2 text-center border-b border-gray-300">
                      {formatDate(subtask.endDate)}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300 pl-8">
                      <div className="flex items-center text-end relative">
                        <div
                          className={`h-4 ${getColor(subtask.status.percentage)} rounded ${getWidth(subtask.status.percentage)}`}
                        ></div>
                        <h3
                          className={`absolute text-sm font-medium ${ subtask.status.percentage == 0 ? "text-black" : "text-white"} ml-2`}>{subtask.status.percentage}%
                        </h3>
                        </div>
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