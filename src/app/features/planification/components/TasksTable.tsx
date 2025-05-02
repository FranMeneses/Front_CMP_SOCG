'use client';
import React from "react";
import { ValleysTasksTableColumns, SubtaskTableColumns } from "@/constants/tableConstants";
import { IInfoTask } from "@/app/models/ITasks";
import { ISubtask } from "@/app/models/ISubtasks";
import { usePlanification } from "../hooks/usePlanification";

interface TasksTableProps {
    tasks: IInfoTask[];
    subtasks: ISubtask[];

    selectedTaskId: string | null;
    onTaskClick: (taskId: string) => void;
    tableOption: string;
}

const TasksTable: React.FC<TasksTableProps> = ({
    tasks,
    subtasks,
    selectedTaskId,
    onTaskClick,
    tableOption,
}) => {


    const {getRemainingDays,formatDate} = usePlanification();

    return (
        <div className="overflow-x-auto border border-[#041e3e] rounded-md">
            <table className="table-auto w-full ">
                <thead className="bg-[#2771CC]">
                    <tr className="text-sm text-white">
                        {(tableOption === "Tareas" ? ValleysTasksTableColumns : SubtaskTableColumns).map((column, index) => (
                            <th
                                key={index}
                                className="px-4 py-2 text-center font-medium truncate"
                            >
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white text-xs truncate divide-y divide-[#041e3e]">
                    {tasks.map((task) => (
                        <React.Fragment key={task.id}>
                            <tr
                                onClick={() => onTaskClick(task.taskId)}
                                className={`${selectedTaskId === task.taskId ? "bg-white" : ""} cursor-pointer`}
                            >
                                <td className="px-4 py-2 text-center">{task.task.name}</td>
                                <td className="px-4 py-2 text-center">{task.originId}</td>
                                <td className="px-4 py-2 text-center">{task.typeId}</td>
                                <td className="px-4 py-2 text-center">{task.scopeId}</td>
                                <td className="px-4 py-2 text-center">{task.interactionId}</td>
                                <td className="px-4 py-2 text-center">{task.riskId}</td>
                                <td className="px-4 py-2 text-center">{"task.budget"}</td>
                                <td className="px-4 py-2 text-center">{"task.startDate"}</td>
                                <td className="px-4 py-2 text-center">{"task.endDate"}</td>
                                <td className="px-4 py-2 text-center">{"task.remainingDays"}</td>
                                <td className="px-4 py-2 text-center">{"task.finishDate"}</td>
                            </tr>
                            {selectedTaskId === task.taskId &&
                                subtasks.filter((subtask) => subtask.taskId === task.taskId) 
                                    .map((subtask) => (
                                        <tr
                                            key={subtask.id}
                                            className="cursor-pointer bg-gray-200"
                                        >
                                            <td className="px-4 py-2 text-center">{subtask.name}</td>
                                            <td className="px-4 py-2 text-center">{"-"}</td>
                                            <td className="px-4 py-2 text-center">{"-"}</td>
                                            <td className="px-4 py-2 text-center">{"-"}</td>
                                            <td className="px-4 py-2 text-center">{"-"}</td>
                                            <td className="px-4 py-2 text-center">{"-"}</td>
                                            <td className="px-4 py-2 text-center">{subtask.budget}</td>
                                            <td className="px-4 py-2 text-center">{formatDate(subtask.startDate)}</td>
                                            <td className="px-4 py-2 text-center">{formatDate(subtask.endDate)}</td>
                                            <td className="px-4 py-2 text-center">{getRemainingDays(subtask.startDate,subtask.endDate)}</td>
                                            <td className="px-4 py-2 text-center">{formatDate(subtask.finalDate)}</td>
                                        </tr>
                                    ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default TasksTable;