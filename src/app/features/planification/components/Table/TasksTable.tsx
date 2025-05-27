'use client';
import React from "react";
import { ISubtask } from "@/app/models/ISubtasks";
import { usePlanification } from "../../hooks/usePlanification";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHooks } from "../../../hooks/useHooks";
import { ITaskDetails } from "@/app/models/ITasks";
import TaskRow from "./TaskRow";
import SubtasksTable from "./SubtasksTable";
import DropdownMenu from "@/components/Dropdown";
import TaskModals from "../TaskModalForms";

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
        setIsCommunicationModalOpen,
        handleFilterClick: hookHandleFilterClick,
        isPopupOpen, 
        activeFilter: hookActiveFilter,
        isPopupSubtaskOpen,
        selectedInfoTask,
        selectedTask,
        selectedSubtask,
        isCommunicationModalOpen,
        expandedRow,
        taskState,
        isDeleteTaskModalOpen,
        isDeleteSubtaskModalOpen,
        setIsDeleteTaskModalOpen,
        setIsDeleteSubtaskModalOpen,
        setItemToDeleteId,
        handleDeleteTask,
        handleDeleteSubtask,
        handleCreateTask,
        handleSaveCommunication,
        handleUpdateCommunication,
        handleCancelCommunication,
    } = usePlanification();

    const actualActiveFilter = propActiveFilter !== undefined ? propActiveFilter : hookActiveFilter;
    const actualHandleFilterClick = onFilterClick || hookHandleFilterClick;
    const actualTaskState = taskStates || taskState;

    const { currentValleyName, userRole } = useHooks();

    const dropdownValley = () => {
        return (
            <div className="mb-4">
                <DropdownMenu
                    buttonText="Seleccione departamento"
                    isInModal={true}
                    items={[]}
                    onSelect={(item) => console.log(item)}  //TODO: AGREGAR FUNCIONALIDAD PEDIR A FRANCISCO MODIFICAR LA FUNCIÓN DE PROCESS AND VALLEY 
                    selectedValue={""}
                    data-test-id="task-department-dropdown"
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
                    {userRole === "encargado cumplimiento" && dropdownValley()}
                </div>
                <Button 
                    onClick={() => handleCreateTask()}
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
                            <th className="py-2 text-center text-xs font-medium text-gray-500 truncate">Nombre</th>
                            <th className="py-2 text-center text-xs font-medium text-gray-500 truncate">Descripción</th>
                            <th className="py-2 text-center text-xs font-medium text-gray-500 truncate">Faena</th>
                            <th className="py-2 text-center text-xs font-medium text-gray-500 truncate">Presupuesto</th>
                            <th className="py-2 px-2 text-center text-xs font-medium text-gray-500 truncate">Fecha Inicio</th>
                            <th className="py-2 px-2 text-center text-xs font-medium text-gray-500 truncate">Fecha Finalización</th>
                            <th className="py-2 px-2 text-center text-xs font-medium text-gray-500 truncate">Días Restantes</th>
                            <th className="py-2 px-2 text-center text-xs font-medium text-gray-500 truncate">Fecha de Termino</th>
                            <th className="py-2 text-center text-xs font-medium text-gray-500 truncate">Estado</th>
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
            
            <TaskModals
                isPopupOpen={isPopupOpen}
                setIsPopupOpen={setIsPopupOpen}
                selectedInfoTask={selectedInfoTask}
                handleCancel={handleCancel}
                handleUpdateTask={handleUpdateTask}
                handleSaveTask={handleSaveTask}
                
                isPopupSubtaskOpen={isPopupSubtaskOpen}
                setIsPopupSubtaskOpen={setIsPopupSubtaskOpen}
                selectedSubtask={selectedSubtask}
                handleCancelSubtask={handleCancelSubtask}
                handleUpdateSubtask={handleUpdateSubtask}
                handleCreateSubtask={handleCreateSubtask}
                selectedTaskId={expandedRow}
                
                isCommunicationModalOpen={isCommunicationModalOpen}
                selectedTask={selectedTask}
                setIsCommunicationModalOpen={setIsCommunicationModalOpen}
                handleSaveCommunication={handleSaveCommunication}
                handleUpdateCommunication={handleUpdateCommunication}
                handleCancelCommunication={handleCancelCommunication}
                
                isDeleteTaskModalOpen={isDeleteTaskModalOpen}
                isDeleteSubtaskModalOpen={isDeleteSubtaskModalOpen}
                setIsDeleteTaskModalOpen={setIsDeleteTaskModalOpen}
                setIsDeleteSubtaskModalOpen={setIsDeleteSubtaskModalOpen}
                handleDeleteTask={handleDeleteTask}
                handleDeleteSubtask={handleDeleteSubtask}
                
                currentValleyName={currentValleyName}

                userRole={userRole}
            />
        </div>
    );
};

export default TasksTable;