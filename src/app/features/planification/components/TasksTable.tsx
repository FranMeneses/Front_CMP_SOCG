'use client';
import React, { useState } from "react";
import { ValleysTasksTableColumns } from "@/constants/tableConstants";
import { ISubtask } from "@/app/models/ISubtasks";
import { usePlanification } from "../hooks/usePlanification";
import { Pen, Plus, ZoomIn } from "lucide-react";
import Modal from "@/components/Modal";
import ValleyTaskForm from "./ValleyTaskForm";
import { Button } from "@/components/ui/button";
import ValleySubtaskForm from "./ValleySubtaskForm";

interface TasksTableProps {
    tasks: any[];
    subtasks: ISubtask[];
}

const TasksTable: React.FC<TasksTableProps> = ({ tasks, subtasks }) => {
    const { 
        getRemainingDays, 
        formatDate,
        handleSeeInformation, 
        handleGetSubtask,
        setIsPopupOpen, 
        setIsPopupSubtaskOpen,
        handleCreateSubtask,
        handleOnTaskClick,
        handleUpdateTask,
        handleUpdateSubtask,
        handleCancel,
        handleCancelSubtask,
        isPopupOpen, 
        isPopupSubtaskOpen,
        selectedInfoTask,
        selectedSubtask,
        expandedRow,
     } = usePlanification();

    return (
        <div className="overflow-x-auto border border-[#041e3e] rounded-md">
            <table className="table-auto w-full">
                <thead className="bg-[#2771CC]">
                    <tr className="text-sm text-white">
                        {ValleysTasksTableColumns.map((column, index) => (
                            <th
                                key={index}
                                className="px-4 py-2 text-center font-medium truncate"
                            >
                                {column}
                            </th>
                        ))}
                        <th colSpan={11}></th>
                    </tr>
                </thead>
                <tbody className="bg-white text-xs truncate divide-y divide-[#041e3e]">
                    {tasks.map((task) => (
                        <React.Fragment key={task.id}>
                            <tr className="text-center">
                                <td
                                    className="px-4 py-2 text-center cursor-pointer text-blue-700 font-semibold"
                                    onClick={() => handleOnTaskClick(task.id)}
                                >
                                    {task.name}
                                </td>
                                <td className="px-4 py-2 text-center">{task.description}</td>
                                <td className="px-4 py-2 text-center">{task.faena.name}</td>
                                <td className="px-4 py-2 text-center">{task.budget || "-"}</td>
                                <td className="px-4 py-2 text-center">{task.startDate ? formatDate(task.startDate) : "-"}</td>
                                <td className="px-4 py-2 text-center">{task.endDate ? formatDate(task.endDate) : "-"}</td>
                                <td className="px-4 py-2 text-center">{getRemainingDays(task.startDate, task.endDate)}</td>
                                <td className="px-4 py-2 text-center">{task.finishDate ? formatDate(task.finishDate) : "-"}</td>
                                <td className="px-4 py-2 text-center">
                                    <ZoomIn
                                        size={20}
                                        color="#041e3e"
                                        className="cursor-pointer"
                                        onClick={() => handleSeeInformation(task.id)}
                                    />
                                </td>
                            </tr>
                            {expandedRow === task.id && (
                            <tr>
                                <td colSpan={9} className="bg-gray-200">
                                    <div className="flex flex-row justify-between items-center px-4">
                                        <h2 className="font-medium text-sm ml-4 text-black">Subtareas:</h2>
                                        <div className="h-full flex justify-center items-center">
                                                <Button
                                                    onClick={() => setIsPopupSubtaskOpen(true)}
                                                    variant="ghost"
                                                    size="default"
                                                    className="flex flex-row cursor-pointer bg-gray-200 hover:bg-gray-300"
                                                    data-test-id="add-contact-button"
                                                >
                                                    <Plus color="black" />
                                                </Button>
                                        </div>
                                    </div>
                                    <table className="w-full text-center">
                                        <thead className="">
                                            <tr>
                                                <th className="px-4 py-2">Nombre</th>
                                                <th className="px-4 py-2">Descripción</th>
                                                <th className="px-4 py-2">Faena</th>
                                                <th className="px-4 py-2">Presupuesto</th>
                                                <th className="px-4 py-2">Fecha Inicio</th>
                                                <th className="px-4 py-2">Fecha Finalización</th>
                                                <th className="px-4 py-2">Días Restantes</th>
                                                <th className="px-4 py-2">Fecha de Termino</th>
                                                <th className="px-4 py-2"> </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subtasks
                                                .filter((subtask) => subtask.taskId === task.id)
                                                .map((subtask) => (
                                                    <tr key={subtask.id}>
                                                        <td className="px-4 py-2">{subtask.name}</td>
                                                        <td className="px-4 py-2">{subtask.description}</td>
                                                        <td className="px-4 py-2">-</td>
                                                        <td className="px-4 py-2">{subtask.budget}</td>
                                                        <td className="px-4 py-2">{formatDate(subtask.startDate)}</td>
                                                        <td className="px-4 py-2">{formatDate(subtask.endDate)}</td>
                                                        <td className="px-4 py-2">{getRemainingDays(subtask.startDate, subtask.endDate)}</td>
                                                        <td className="px-4 py-2">{formatDate(subtask.finalDate)}</td>
                                                        <td className="px-4 py-2">
                                                            <Pen
                                                                size={20}
                                                                color="#041e3e"
                                                                className="cursor-pointer"
                                                                onClick={() => handleGetSubtask(subtask.id)}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            <Modal isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
                {selectedInfoTask ? (
                    <ValleyTaskForm
                        onCancel={handleCancel}
                        onSave={handleUpdateTask}
                        valley="Valle de Copiapó"
                        data-test-id="task-form"
                        details={true}
                        isEditing={true}
                        infoTask={selectedInfoTask}
                    />
                ) : (
                    <div className="p-4 text-center">Cargando...</div>
                )}
            </Modal>
            <Modal isOpen={isPopupSubtaskOpen} onClose={() => setIsPopupSubtaskOpen(false)}>
    {selectedSubtask ? (
        <ValleySubtaskForm
            onCancel={handleCancelSubtask}
            onSave={handleUpdateSubtask}
            valley="Valle de Copiapó"
            isEditing={true}
            data-test-id="subtask-form"
            subtask={selectedSubtask}
        />
    ) : (
        <ValleySubtaskForm
            onCancel={handleCancelSubtask}
            onSave={handleCreateSubtask}
            valley="Valle de Copiapó"
            data-test-id="subtask-form"
            subtask={{
                name: "",
                number: "",
                description: "",
                budget: "",
                expenses: "",
                startDate: "",
                endDate: "",
                finishDate: "",
                beneficiary: "",
                status: "",  
                priorityId: "",     
                taskId: expandedRow 
            }}
        />
    )}
</Modal>
        </div>
    );
};

export default TasksTable;