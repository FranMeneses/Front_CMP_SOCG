import React, { useState } from 'react';
import Modal from "@/components/Modal";
import ValleyTaskForm from "./forms/ValleyTaskForm";
import ValleySubtaskForm from "./forms/ValleySubtaskForm";
import CommunicationForm from "./forms/CommunicationForm";
import TaskTypeSelectionForm from "./forms/TaskTypeSelectionForm";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { UploadPlanificationForm } from './forms/UploadPlanificationForm';
import { ISubtask } from "@/app/models/ISubtasks";
import { IInfoTask, ITask } from '@/app/models/ITasks';
import { Task } from '@/app/models/ITaskForm';
import { useHooks } from '@/app/features/hooks/useHooks';
import { ITaskForm } from '@/app/models/ICommunicationsForm';
import { ExtendedSubtaskValues } from '@/app/models/ISubtaskForm';

interface TaskModalsProps {
    isPopupOpen: boolean;
    setIsPopupOpen: (isOpen: boolean) => void;
    selectedInfoTask: IInfoTask | null;
    handleCancel: () => void;
    handleUpdateTask: (task: Task) => void;
    handleSaveTask: (task: Task) => void;
    
    isPopupSubtaskOpen: boolean;
    setIsPopupSubtaskOpen: (isOpen: boolean) => void;
    selectedSubtask: ISubtask | null;
    handleCancelSubtask: () => void;
    handleUpdateSubtask: (subtask: ExtendedSubtaskValues) => void;
    handleCreateSubtask: (subtask: ExtendedSubtaskValues) => void;
    selectedTaskId: string | null;
    
    isCommunicationModalOpen: boolean;
    setIsCommunicationModalOpen: (isOpen: boolean) => void;
    handleSaveCommunication: (task: Partial<ITaskForm> | ITask) => void | Promise<void>;
    handleUpdateCommunication: (task: Partial<ITaskForm> | ITask) => void | Promise<void>;
    handleCancelCommunication: () => void;

    isDeleteTaskModalOpen: boolean;
    isDeleteSubtaskModalOpen: boolean;
    setIsDeleteTaskModalOpen: (isOpen: boolean) => void;
    setIsDeleteSubtaskModalOpen: (isOpen: boolean) => void;
    handleDeleteTask: () => void;
    handleDeleteSubtask: () => void;
    
    isPopupPlanificationOpen?: boolean;
    setIsPopupPlanificationOpen?: (isOpen: boolean) => void;

    currentValleyName: string | null;
    userRole: string;
    selectedTask?: ITask | undefined; 
}

const TaskModals: React.FC<TaskModalsProps> = ({
    isPopupOpen,
    selectedInfoTask,
    handleCancel,
    handleUpdateTask,
    handleSaveTask,
    isPopupSubtaskOpen,
    selectedSubtask,
    handleCancelSubtask,
    handleUpdateSubtask,
    handleCreateSubtask,
    isCommunicationModalOpen,
    handleSaveCommunication,
    handleUpdateCommunication,
    handleCancelCommunication,
    isDeleteTaskModalOpen,
    isDeleteSubtaskModalOpen,
    setIsDeleteTaskModalOpen,
    setIsDeleteSubtaskModalOpen,
    handleDeleteTask,
    handleDeleteSubtask,
    currentValleyName,
    userRole,
    selectedTask,
    isPopupPlanificationOpen = false,
    setIsPopupPlanificationOpen = () => {},
}) => {

    const { isValleyManager, isCommunicationsManager } = useHooks();
    const [selectedTaskType, setSelectedTaskType] = useState<'communication' | 'relationship' | null>(null);

    const isEditingCommunication = selectedTask !== undefined && selectedTask !== null;

    const handlePlanificationSuccess = () => {
        console.log('Planificación cargada exitosamente');
    };

    const handleTaskTypeSelection = (type: 'communication' | 'relationship') => {
        setSelectedTaskType(type);
    };

    const handleTaskTypeCancel = () => {
        setSelectedTaskType(null);
        handleCancelCommunication();
    };

    const handleTaskFormCancel = () => {
        setSelectedTaskType(null);
        handleCancelCommunication();
    };

    const renderTaskCreationModal = () => {
        if (userRole === 'encargado cumplimiento' && !isEditingCommunication) {
            if (!selectedTaskType) {
                return (
                    <TaskTypeSelectionForm
                        onSelectType={handleTaskTypeSelection}
                        onCancel={handleTaskTypeCancel}
                    />
                );
            } else if (selectedTaskType === 'communication') {
                return (
                    <CommunicationForm
                        onCancel={handleTaskFormCancel}
                        onSave={handleSaveCommunication}
                        isEditing={false}
                        selectedTask={undefined}
                        userRole={userRole}
                    />
                );
            } else if (selectedTaskType === 'relationship') {
                return (
                    <ValleyTaskForm
                        onCancel={handleTaskFormCancel}
                        onSave={handleSaveTask}
                        valley={currentValleyName || ""}
                        data-test-id="task-form"
                    />
                );
            }
        }

        if (isEditingCommunication) {
            return (
                <CommunicationForm
                    onCancel={handleCancelCommunication}
                    onSave={handleUpdateCommunication}
                    isEditing={true}
                    selectedTask={selectedTask}
                    userRole={userRole}
                />
            );
        }

        if (isCommunicationsManager) {
            return (
                <CommunicationForm
                    onCancel={handleCancelCommunication}
                    onSave={handleSaveCommunication}
                    isEditing={false}
                    selectedTask={undefined}
                    userRole={userRole}
                />
            );
        }

        return null;
    };

    return (
        <>
            {/* Task Modal - Valley Manager */}
            {isValleyManager && (
                <Modal isOpen={isPopupOpen} onClose={handleCancel}>
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
            )}
                
            {/* Subtask Modal */}
            <Modal isOpen={isPopupSubtaskOpen} onClose={handleCancelSubtask}>
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
                        subtask={undefined}
                    />
                )}
            </Modal>
                
            {/* Communication/Task Selection Modal */}
            {(isCommunicationsManager || userRole === 'encargado cumplimiento') && (
                <Modal isOpen={isCommunicationModalOpen} onClose={handleCancelCommunication}>
                    {renderTaskCreationModal()}
                </Modal>
            )}

            {/* Upload Planification Modal */}
            <Modal isOpen={isPopupPlanificationOpen} onClose={() => setIsPopupPlanificationOpen(false)}>
                <UploadPlanificationForm 
                    onClose={() => setIsPopupPlanificationOpen(false)}
                    onSuccess={handlePlanificationSuccess}
                />
            </Modal>

            {/* Delete Confirmation Modals */}
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
        </>
    );
};

export default TaskModals;