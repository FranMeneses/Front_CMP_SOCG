import React from "react";
import { TaskTableColumns } from "@/constants/tableConstants";

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
}

const TasksTable: React.FC<TasksTableProps> = ({
    tasks,
    selectedTaskId,
    onTaskClick,
}) => {
    return (
        <div className="overflow-y-scroll">
            <table className="table-auto w-[80%]">
                <thead className="bg-white">
                    <tr className="text-sm text-gray-700 border-b border-gray-200">
                        {TaskTableColumns.map((column, index) => (
                            <th
                                key={index}
                                className={`px-4 py-2 text-start font-bold text-black`}
                            >
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {tasks.map((task) => (
                        <tr
                            key={task.id}
                            onClick={() => onTaskClick(task.id)}
                            className={`${selectedTaskId === task.id ? "bg-[#E6F0FF]" : ""} cursor-pointer hover:bg-[#cbcbcb] border-b border-gray-200`}
                        >
                            <td className="px-4 py-2">{task.code}</td>
                            <td className="px-4 py-2">{task.name}</td>
                            <td className="px-4 py-2">{task.origin}</td>
                            <td className="px-4 py-2">{task.type}</td>
                            <td className="px-4 py-2">{task.scope}</td>
                            <td className="px-4 py-2">{task.operationalInteraction}</td>
                            <td className="px-4 py-2">{task.operationalRisk}</td>
                            <td className="px-4 py-2">{task.compliance}</td>
                            <td className="px-4 py-2">{task.priority}</td>
                            <td className="px-4 py-2">{task.status}</td>
                            <td className="px-4 py-2">{task.assigned}</td>
                            <td className="px-4 py-2">{task.budget}</td>
                            <td className="px-4 py-2">{task.actualExpense}</td>
                            <td className="px-4 py-2">{task.gcBudget}</td>
                            <td className="px-4 py-2">{task.difference}</td>
                            <td className="px-4 py-2">{task.accountingMonth}</td>
                            <td className="px-4 py-2">{task.startDate}</td>
                            <td className="px-4 py-2">{task.endDate}</td>
                            <td className="px-4 py-2">{task.remainingDays}</td>
                            <td className="px-4 py-2">{task.finishDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default TasksTable;