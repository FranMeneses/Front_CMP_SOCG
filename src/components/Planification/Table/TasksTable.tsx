'use client';
import React from "react";
import { ISubtask } from "@/app/models/ISubtasks";
import { usePlanification } from "@/app/features/planification/hooks/usePlanification";
import { useHooks } from "@/app/features/hooks/useHooks";
import { ITask, ITaskDetails } from "@/app/models/ITasks";
import TaskRow from "./TaskRow";
import SubtasksTable from "./SubtasksTable";
import TaskFilters from "./TaskFilters";
import TaskTableHeader from "./TaskTableHeaders";
import TaskModals from "../TaskModalForms";
import { useTaskFilters } from "@/app/features/planification/hooks/useTaskFilters";
import { ITaskForm } from "@/app/models/ICommunicationsForm";
import { ExtendedSubtaskValues } from "@/app/models/ISubtaskForm";

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
        setIsPopupPlanificationOpen,

        isPopupOpen, 
        isPopupPlanificationOpen,
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
        localSubtasks,

        handleFilterByProcess,
        setIsDeleteTaskModalOpen,
        setIsDeleteSubtaskModalOpen,
        setItemToDeleteId,
        handleDeleteTask,
        handleDeleteSubtask,

        handleCreateTask,
        handleUploadPlanification,

        handleSaveCommunication,
        handleUpdateCommunication,
        handleCancelCommunication,

        handleCreateComplianceManager,
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

    const actualTaskState = taskStates || taskState;
    const handleLocalFilterClick = (filter: string) => {
        handleStatusFilterChange(filter);
    };

    // Adaptador para comunicaciones
    const saveCommunicationAdapter = (task: Partial<ITaskForm> | ITask) => {
        return handleSaveCommunication(task as ITask);
    };

    const updateCommunicationAdapter = (task: Partial<ITaskForm> | ITask) => {
        return handleUpdateCommunication(task as ITask);
    };

    // Adaptadores para subtareas
    const updateSubtaskAdapter = (subtask: ExtendedSubtaskValues) => {
        const convertedSubtask: ISubtask = {
            id: selectedSubtask?.id || '',
            taskId: expandedRow || '',
            name: subtask.name || '',
            description: subtask.description || '',
            budget: Number(subtask.budget) || 0,
            expense: Number(subtask.expense) || 0,
            startDate: subtask.startDate || '',
            endDate: subtask.endDate || '',
            finalDate: subtask.finalDate || '',
            statusId: Number(subtask.status) || 1,
            priorityId: Number(subtask.priority) || 1,
            status: { id: Number(subtask.status) || 1, name: '', percentage: 0 },
            priority: { id: Number(subtask.priority) || 1, name: '' }
        };
        
        return handleUpdateSubtask(convertedSubtask);
    };

    const createSubtaskAdapter = (subtask: ExtendedSubtaskValues) => {
        const convertedSubtask: ISubtask = {
            id: '',
            taskId: expandedRow || '',
            name: subtask.name || '',
            description: subtask.description || '',
            budget: Number(subtask.budget) || 0,
            expense: Number(subtask.expense) || 0,
            startDate: subtask.startDate || '',
            endDate: subtask.endDate || '',
            finalDate: subtask.finalDate || '',
            statusId: Number(subtask.status) || 1,
            priorityId: Number(subtask.priority) || 1,
            status: { id: Number(subtask.status) || 1, name: '', percentage: 0 },
            priority: { id: Number(subtask.priority) || 1, name: '' }
        };
        
        return handleCreateSubtask(convertedSubtask);
    };

    const subtasksToUse = localSubtasks && localSubtasks.length > 0 ? localSubtasks : subtasks;

    return (
        <div>
            <div className="p-4 border-b border-gray-200">
                <TaskTableHeader 
                    userRole={userRole}
                    allProcesses={allProcesses}
                    selectedProcess={selectedProcess}
                    handleProcessFilterChange={handleProcessFilterChange}
                    handleCreateTask={handleCreateTask}
                    handleUploadPlanification={handleUploadPlanification}
                    handleCreateComplianceManager={handleCreateComplianceManager}
                />

                <TaskFilters 
                    taskStates={actualTaskState}
                    activeFilter={activeStatusFilter} 
                    handleFilterClick={handleLocalFilterClick} 
                    isLateFilterActive={isLateFilterActive}
                    handleLateFilterClick={handleLateFilterClick} 
                />
            </div>
            <div className="p-4">
                <div className="overflow-x-auto rounded-lg shadow font-[Helvetica] border border-gray-200">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-100">
                            <tr className="text-sm text-gray-700">
                                <th className="py-2 text-center text-xs font-medium text-gray-500 truncate border-r border-gray-200">Nombre</th>
                                <th className="py-2 text-center text-xs font-medium text-gray-500 truncate border-r border-gray-200">Presupuesto (USD)</th>
                                <th className="py-2 px-2 text-center text-xs font-medium text-gray-500 truncate border-r border-gray-200">Fecha Inicio</th>
                                <th className="py-2 px-2 text-center text-xs font-medium text-gray-500 truncate border-r border-gray-200">Fecha Finalización</th>
                                <th className="py-2 px-2 text-center text-xs font-medium text-gray-500 truncate border-r border-gray-200">Días Restantes</th>
                                <th className="py-2 px-2 text-center text-xs font-medium text-gray-500 truncate border-r border-gray-200">Fecha de Término</th>
                                <th className="py-2 text-center text-xs font-medium text-gray-500 truncate border-r border-gray-200">Estado</th>
                                <th colSpan={3} className="py-2 text-center text-xs font-medium text-gray-500 truncate"/>
                            </tr>
                        </thead>
                        <tbody className="bg-white text-xs truncate divide-y divide-gray-200">
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
                                    
                                    {expandedRow === task.id && (
                                        <tr>
                                            <SubtasksTable 
                                                subtasks={subtasksToUse}
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
                handleUpdateSubtask={updateSubtaskAdapter}
                handleCreateSubtask={createSubtaskAdapter}
                selectedTaskId={expandedRow}
                
                isCommunicationModalOpen={isCommunicationModalOpen}
                selectedTask={selectedTask}
                setIsCommunicationModalOpen={setIsCommunicationModalOpen}
                handleSaveCommunication={saveCommunicationAdapter}
                handleUpdateCommunication={updateCommunicationAdapter}
                handleCancelCommunication={handleCancelCommunication}
                
                isDeleteTaskModalOpen={isDeleteTaskModalOpen}
                isDeleteSubtaskModalOpen={isDeleteSubtaskModalOpen}
                setIsDeleteTaskModalOpen={setIsDeleteTaskModalOpen}
                setIsDeleteSubtaskModalOpen={setIsDeleteSubtaskModalOpen}
                handleDeleteTask={handleDeleteTask}
                handleDeleteSubtask={handleDeleteSubtask}

                isPopupPlanificationOpen={isPopupPlanificationOpen}
                setIsPopupPlanificationOpen={setIsPopupPlanificationOpen}
                
                currentValleyName={currentValleyName}
                userRole={userRole}
            />
        </div>
    );
};

export default TasksTable;