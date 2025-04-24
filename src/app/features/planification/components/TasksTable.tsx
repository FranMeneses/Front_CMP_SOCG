'use client';
import React from "react";
import { TaskTableColumns, SubtaskTableColumns } from "@/constants/tableConstants";

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

interface TasksTableProps {
    tasks: Task[];
    selectedTaskId: string | null;
    onTaskClick: (taskId: string) => void;
    tableOption: string;
}

const TasksTable: React.FC<TasksTableProps> = ({
    tasks,
    selectedTaskId,
    onTaskClick,
    tableOption,
}) => {
    return (
        <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-[#08203d]">
                <thead className="bg-[#0e70e884]">
                    <tr className="text-sm text-gray-700">
                        {(tableOption === "Tareas" ? TaskTableColumns : SubtaskTableColumns).map((column, index) => (
                            <th
                                key={index}
                                className="px-4 py-2 text-center font-bold border border-[#08203d]"
                            >
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white text-xs truncate">
                    {tableOption === "Tareas"
                        ? tasks.map((task) => (
                            <tr
                                key={task.id}
                                onClick={() => onTaskClick(task.id)}
                                className={`${selectedTaskId === task.id ? "bg-blue-100" : ""} cursor-pointer hover:odd:bg-[#6993c595] hover:even:bg-[#f8e1b0] border border-[#08203d] odd:bg-[#e0eeff] even:bg-[#fff2d5]`}
                            >
                                <td className="px-4 py-2 border border-[#08203d] text-center">{task.code}</td>
                                <td className="px-4 py-2 border border-[#08203d] text-center">{task.name}</td>
                                <td className="px-4 py-2 border border-[#08203d] text-center">{task.origin}</td>
                                <td className="px-4 py-2 border border-[#08203d] text-center">{task.type}</td>
                                <td className="px-4 py-2 border border-[#08203d] text-center">{task.scope}</td>
                                <td className="px-4 py-2 border border-[#08203d] text-center">{task.operationalInteraction}</td>
                                <td className="px-4 py-2 border border-[#08203d] text-center">{task.operationalRisk}</td>
                                <td className="px-4 py-2 border border-[#08203d] text-center">{task.compliance}</td>
                                <td className="px-4 py-2 border border-[#08203d] text-center">{task.priority}</td>
                                <td className="px-4 py-2 border border-[#08203d] text-center">{task.status}</td>
                                <td className="px-4 py-2 border border-[#08203d] text-center">{task.assigned}</td>
                                <td className="px-4 py-2 border border-[#08203d] text-center">{task.budget}</td>
                                <td className="px-4 py-2 border border-[#08203d] text-center">{task.actualExpense}</td>
                                <td className="px-4 py-2 border border-[#08203d] text-center">{task.gcBudget}</td>
                                <td className="px-4 py-2 border border-[#08203d] text-center">{task.difference}</td>
                                <td className="px-4 py-2 border border-[#08203d] text-center">{task.accountingMonth}</td>
                                <td className="px-4 py-2 border border-[#08203d] text-center">{task.startDate}</td>
                                <td className="px-4 py-2 border border-[#08203d] text-center">{task.endDate}</td>
                                <td className="px-4 py-2 border border-[#08203d] text-center">{task.remainingDays}</td>
                                <td className="px-4 py-2 border border-[#08203d] text-center">{task.finishDate}</td>
                            </tr>
                        ))
                        : tasks.flatMap((task) =>
                            task.subtasks.map((subtask) => (
                                <tr
                                    key={subtask.id}
                                    className="cursor-pointer hover:odd:bg-[#6993c595] hover:even:bg-[#f8e1b0] border border-[#08203d] odd:bg-[#e0eeff] even:bg-[#fff2d5]"
                                >
                                    <td className="px-4 py-2 border border-[#08203d] text-center">{subtask.code}</td>
                                    <td className="px-4 py-2 border border-[#08203d] text-center">{subtask.name}</td>
                                    <td className="px-4 py-2 border border-[#08203d] text-center">{subtask.startDate}</td>
                                    <td className="px-4 py-2 border border-[#08203d] text-center">{subtask.endDate}</td>
                                    <td className="px-4 py-2 border border-[#08203d] text-center">{subtask.progress}</td>
                                    <td className="px-4 py-2 border border-[#08203d] text-center">{subtask.complianceStatus}</td>
                                </tr>
                            ))
                        )}
                </tbody>
            </table>
        </div>
    );
}
export default TasksTable;