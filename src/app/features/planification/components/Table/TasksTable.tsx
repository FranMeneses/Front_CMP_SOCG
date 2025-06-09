'use client';
import React from "react";
import { ISubtask } from "@/app/models/ISubtasks";
import { usePlanification } from "../../hooks/usePlanification";
import { useHooks } from "../../../hooks/useHooks";
import { ITaskDetails } from "@/app/models/ITasks";
import TaskRow from "./TaskRow";
import SubtasksTable from "./SubtasksTable";
import TaskFilters from "./TaskFilters";
import TaskTableHeader from "./TaskTableHeaders";
import TaskModals from "../TaskModalForms";
import { useTaskFilters } from "../../hooks/useTaskFilters";

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
        allProcesses,

        handleFilterByProcess,
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

    const { currentValleyName, userRole } = useHooks();
    
    const { 
        filteredTasks, 
        selectedProcess,
        activeStatusFilter,
        isLateFilterActive,
        handleProcessFilterChange,
        handleStatusFilterChange,
        handleLateFilterClick
    } = useTaskFilters(tasks, allProcesses, handleFilterByProcess);

    const actualActiveFilter = propActiveFilter !== undefined ? propActiveFilter : hookActiveFilter;
    const actualTaskState = taskStates || taskState;
    const handleLocalFilterClick = (filter: string) => {
        handleStatusFilterChange(filter);
    };
    

    return (
        <div>
            <TaskTableHeader 
                userRole={userRole}
                allProcesses={allProcesses}
                selectedProcess={selectedProcess}
                handleProcessFilterChange={handleProcessFilterChange}
                handleCreateTask={handleCreateTask}
            />

            <TaskFilters 
                taskStates={actualTaskState}
                activeFilter={activeStatusFilter} 
                handleFilterClick={handleLocalFilterClick} 
                isLateFilterActive={isLateFilterActive}
                handleLateFilterClick={handleLateFilterClick} 
            />
            
            <div className="overflow-x-auto rounded-lg shadow font-[Helvetica]">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr className="text-sm text-gray-700">
                            <th className="py-2 text-center text-xs font-medium text-gray-500 truncate">Nombre</th>
                            <th className="py-2 text-center text-xs font-medium text-gray-500 truncate">Presupuesto</th>
                            <th className="py-2 px-2 text-center text-xs font-medium text-gray-500 truncate">Fecha Inicio</th>
                            <th className="py-2 px-2 text-center text-xs font-medium text-gray-500 truncate">Fecha Finalización</th>
                            <th className="py-2 px-2 text-center text-xs font-medium text-gray-500 truncate">Días Restantes</th>
                            <th className="py-2 px-2 text-center text-xs font-medium text-gray-500 truncate">Fecha de Termino</th>
                            <th className="py-2 text-center text-xs font-medium text-gray-500 truncate">Estado</th>
                            <th colSpan={3}/>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-xs truncate divide-y divide-[#e5e5e5]">
                        {filteredTasks.map((task) => (
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
                                
                                {expandedRow === task.id && userRole.toLowerCase() !== "encargado cumplimiento" && (
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