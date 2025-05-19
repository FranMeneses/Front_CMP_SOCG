'use client';
import React from "react";
import { ISubtask } from "@/app/models/ISubtasks";
import { usePlanification } from "../hooks/usePlanification";
import { Plus } from "lucide-react";
import Modal from "@/components/Modal";
import ValleyTaskForm from "./forms/ValleyTaskForm";
import { Button } from "@/components/ui/button";
import ValleySubtaskForm from "./forms/ValleySubtaskForm";
import { useHooks } from "../../hooks/useHooks";
import { ITaskDetails } from "@/app/models/ITasks";
import TaskRow from "./TaskRow";
import SubtasksTable from "./SubtasksTable";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import DropdownMenu from "@/components/Dropdown";

interface TasksTableProps {
    tasks: ITaskDetails[];
    subtasks: ISubtask[];
    taskStates?: string[];  
    onFilterClick?: (filter: string) => void;  
    activeFilter?: string | null; 
}

const TasksTable: React.FC<TasksTableProps> = ({ 
    tasks, 
    subtasks,
    taskStates,
    onFilterClick,
    activeFilter: propActiveFilter
}) => {
    
    const { 
        getRemainingDays,
        getRemainingSubtaskDays,
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
        handleFilterClick: hookHandleFilterClick,
        isPopupOpen, 
        activeFilter: hookActiveFilter,
        isPopupSubtaskOpen,
        selectedInfoTask,
        selectedSubtask,
        expandedRow,
        taskState,
        isDeleteTaskModalOpen,
        isDeleteSubtaskModalOpen,
        setIsDeleteTaskModalOpen,
        setIsDeleteSubtaskModalOpen,
        setItemToDeleteId,
        handleDeleteTask,
        handleDeleteSubtask
    } = usePlanification();

    const actualActiveFilter = propActiveFilter !== undefined ? propActiveFilter : hookActiveFilter;
    const actualHandleFilterClick = onFilterClick || hookHandleFilterClick;
    const actualTaskState = taskStates || taskState;

    const { currentValleyName, userRole, valleysName } = useHooks();

    const dropdownValley = () => {
        return (
            <div className="mb-4">
                <DropdownMenu
                    buttonText="Seleccione valle"
                    isInModal={true}
                    items={valleysName}
                    onSelect={(item) => console.log(item)}
                    selectedValue={currentValleyName ?? ""}
                    data-test-id="task-valley-dropdown"
                />
            </div>
        )
    };

    const renderFilterButtons = () => (
        <div className="flex gap-2 mb-4">
            {actualTaskState.map((filter: string) => (
                <Button
                    key={filter}
                    variant="outline"
                    className={`px-4 py-2 text-sm rounded-md hover:cursor-pointer ${
                        actualActiveFilter === filter
                            ? filter === "Completada" ? "bg-green-100 text-green-800 font-medium" : 
                            filter === "En Proceso" ? "bg-blue-100 text-blue-800 font-medium" :
                            filter === "En Espera" ? "bg-yellow-100 text-yellow-800 font-medium" :
                            filter === "Cancelada" ? "bg-red-100 text-red-800 font-medium" :
                            "bg-gray-200 text-gray-800 font-medium"
                            : "bg-white hover:bg-gray-100"
                    }`}
                    onClick={() => actualHandleFilterClick(filter)}
                >
                    {filter}
                </Button>
            ))}
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <div>
                    {userRole != "encargado copiapó" && userRole != "encargado huasco" && userRole != "encargado valle elqui" && dropdownValley()}
                </div>
                <Button 
                    onClick={() => setIsPopupOpen(true)}
                    className="bg-[#4f67b8e0] text-white flex items-center gap-1 hover:cursor-pointer"
                >
                    <Plus size={16} /> Añadir
                </Button>
            </div>

            {renderFilterButtons()}
            
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
                                <TaskRow 
                                    task={task}
                                    formatDate={formatDate}
                                    getRemainingDays={getRemainingDays}
                                    handleOnTaskClick={handleOnTaskClick}
                                    handleSeeInformation={handleSeeInformation}
                                    setIsDeleteTaskModalOpen={setIsDeleteTaskModalOpen}
                                    setItemToDeleteId={setItemToDeleteId}
                                    userRole={userRole}
                                />
                                
                                {expandedRow === task.id && (
                                    <tr>
                                        <SubtasksTable 
                                            subtasks={subtasks}
                                            taskId={task.id || ''}
                                            formatDate={formatDate}
                                            getRemainingSubtaskDays={getRemainingSubtaskDays}
                                            handleGetSubtask={handleGetSubtask}
                                            setIsDeleteSubtaskModalOpen={setIsDeleteSubtaskModalOpen}
                                            setItemToDeleteId={setItemToDeleteId}
                                            setIsPopupSubtaskOpen={setIsPopupSubtaskOpen}
                                            userRole={userRole}
                                        />
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
                        valley={currentValleyName || ""}
                        data-test-id="task-form"
                        details={true}
                        isEditing={true}
                        infoTask={selectedInfoTask}
                    />
                ) : (
                    <ValleyTaskForm
                        onCancel={handleCancel}
                        onSave={handleSaveTask}
                        valley={currentValleyName || ""}
                        data-test-id="task-form"
                    />
                )}
            </Modal>
            
            <Modal isOpen={isPopupSubtaskOpen} onClose={() => setIsPopupSubtaskOpen(false)}>
                {selectedSubtask ? (
                    <ValleySubtaskForm
                        onCancel={handleCancelSubtask}
                        onSave={handleUpdateSubtask}
                        valley={currentValleyName || ""}
                        isEditing={true}
                        data-test-id="subtask-form"
                        subtask={selectedSubtask}
                    />
                ) : (
                    <ValleySubtaskForm
                        onCancel={handleCancelSubtask}
                        onSave={handleCreateSubtask}
                        valley={currentValleyName || ""}
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
            
            <DeleteConfirmationModal 
                isOpen={isDeleteTaskModalOpen}
                onClose={() => setIsDeleteTaskModalOpen(false)}
                onConfirm={handleDeleteTask}
                itemType="tarea"
            />
            
            <DeleteConfirmationModal 
                isOpen={isDeleteSubtaskModalOpen}
                onClose={() => setIsDeleteSubtaskModalOpen(false)}
                onConfirm={handleDeleteSubtask}
                itemType="subtarea"
            />
        </div>
    );
};

export default TasksTable;