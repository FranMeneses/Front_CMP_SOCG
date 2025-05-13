'use client';
import React from "react";
import { ValleysTasksTableColumns } from "@/constants/tableConstants";
import { ISubtask } from "@/app/models/ISubtasks";
import { usePlanification } from "../hooks/usePlanification";
import { Pen, Plus, ZoomIn } from "lucide-react";
import Modal from "@/components/Modal";
import ValleyTaskForm from "./ValleyTaskForm";
import { Button } from "@/components/ui/button";
import ValleySubtaskForm from "./ValleySubtaskForm";
import { useHooks } from "../../hooks/useHooks";
import { ITaskDetails } from "@/app/models/ITasks";

interface TasksTableProps {
    tasks: ITaskDetails[];
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
        handleSaveTask,
        isPopupOpen, 
        isPopupSubtaskOpen,
        selectedInfoTask,
        selectedSubtask,
        expandedRow,
        taskState,
     } = usePlanification();

     const { currentValleyName } = useHooks();
     // Estado para el filtro activo
     const [activeFilter, setActiveFilter] = React.useState("NO iniciada"); {/*TODO: Agregar filtro para la tabla y mover al hook*/}

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <div>
                </div>
                <Button 
                    onClick={() => setIsPopupOpen(true)}
                    className="bg-blue-500 text-white flex items-center gap-1"
                >
                    <Plus size={16} /> Añadir
                </Button>
            </div>
            
            <div className="flex gap-2 mb-4">
                {taskState.map((filter:string) => (
                    <Button
                        key={filter}
                        variant="outline"
                        className={`px-4 py-2 text-sm rounded-md hover:cursor-pointer ${
                            activeFilter === filter
                                ? filter === "Completada" ? "bg-green-100 text-green-800 font-medium" : 
                                filter === "En Proceso" ? "bg-blue-100 text-blue-800 font-medium" :
                                filter === "En Espera" ? "bg-yellow-100 text-yellow-800 font-medium" :
                                filter === "Cancelada" ? "bg-red-100 text-red-800 font-medium" :
                                "bg-gray-200 text-gray-800 font-medium"
                                : "bg-white hover:bg-gray-100"
                        }`}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {filter}
                    </Button>
                ))}
            </div>
            
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr className="text-sm text-gray-700">
                            <th className="py-2 text-center text-xs font-medium text-gray-500">Nombre</th>
                            <th className="py-2 text-center text-xs font-medium text-gray-500">Descripción</th>
                            <th className="py-2 text-center text-xs font-medium text-gray-500">Faena</th>
                            <th className="py-2 text-center text-xs font-medium text-gray-500">Presupuesto</th>
                            <th className="py-2 text-center text-xs font-medium text-gray-500">Fecha Inicio</th>
                            <th className="py-2 text-center text-xs font-medium text-gray-500">Fecha Finalización</th>
                            <th className="py-2 text-center text-xs font-medium text-gray-500">Días Restantes</th>
                            <th className="py-2 text-center text-xs font-medium text-gray-500">Fecha de Termino</th>
                            <th className="py-2 text-center text-xs font-medium text-gray-500">Estado</th>
                            <th colSpan={1}/>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-xs truncate divide-y divide-[#e5e5e5]">
                        {tasks.map((task) => (
                            <React.Fragment key={task.id}>
                                <tr>
                                    <td
                                        className="px-4 py-2 text-left cursor-pointer text-black font-semibold"
                                        onClick={() => handleOnTaskClick(task.id ?? '')}
                                    >
                                        {task.name}
                                    </td>
                                    <td className="py-2 text-left">{task.description}</td>
                                    <td className="py-2 text-center">{task.faena.name}</td>
                                    <td className="py-2 text-center">{task.budget || "-"}</td>
                                    <td className="py-2 text-center">{task.startDate ? formatDate(task.startDate) : "-"}</td>
                                    <td className="py-2 text-center">{task.endDate ? formatDate(task.endDate) : "-"}</td>
                                    <td className="py-2 text-center">{getRemainingDays(task.startDate, task.endDate)}</td>
                                    <td className="py-2 text-center">{task.finishedDate ? formatDate(task.finishedDate) : "-"}</td>
                                    <td className="py-2 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            task.status.name === "Completada" ? "bg-green-100 text-green-800" : 
                                            task.status.name === "En Proceso" ? "bg-blue-100 text-blue-800" :
                                            task.status.name === "En Espera" ? "bg-yellow-100 text-yellow-800" :
                                            task.status.name === "Cancelada" ? "bg-red-100 text-red-800" :
                                            "bg-gray-100 text-gray-800"
                                        }`}>
                                            {task.status.name || "NO iniciada"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <ZoomIn
                                            size={20}
                                            color="#041e3e"
                                            className="cursor-pointer"
                                            onClick={() => handleSeeInformation(task.id ?? '')}
                                        />
                                    </td>
                                </tr>
                                {expandedRow === task.id && (
                                <tr>
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
                                                                    size={18}
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
            </div>
            
            <Modal isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
                {selectedInfoTask ? (
                    <ValleyTaskForm
                        onCancel={handleCancel}
                        onSave={handleUpdateTask}
                        valley={currentValleyName ? currentValleyName : ""}
                        data-test-id="task-form"
                        details={true}
                        isEditing={true}
                        infoTask={selectedInfoTask}
                    />
                ) : (
                        <ValleyTaskForm
                            onCancel={handleCancel}
                            onSave={handleSaveTask}
                            valley={currentValleyName ? currentValleyName : ""}
                            data-test-id="task-form"
                        />
                )}
            </Modal>
            <Modal isOpen={isPopupSubtaskOpen} onClose={() => setIsPopupSubtaskOpen(false)}>
                {selectedSubtask ? (
                    <ValleySubtaskForm
                        onCancel={handleCancelSubtask}
                        onSave={handleUpdateSubtask}
                        valley={currentValleyName ? currentValleyName : ""}
                        isEditing={true}
                        data-test-id="subtask-form"
                        subtask={selectedSubtask}
                    />
                ) : (
                    <ValleySubtaskForm
                        onCancel={handleCancelSubtask}
                        onSave={handleCreateSubtask}
                        valley={currentValleyName ? currentValleyName : ""}
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