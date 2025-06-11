import React from 'react';
import Modal from "@/components/Modal";
import ValleyTaskForm from "./forms/ValleyTaskForm";
import ValleySubtaskForm from "./forms/ValleySubtaskForm";
import CommunicationForm from "./forms/CommunicationForm";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { ISubtask } from "@/app/models/ISubtasks";
import { IInfoTask, ITask } from '@/app/models/ITasks';
import { Task } from '@/app/models/ITaskForm';
import { useHooks } from '../../hooks/useHooks';
import { IComplianceForm } from '@/app/models/ICompliance';
import { UploadPlanificationForm } from './forms/UploadPlanificationForm';

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
    handleUpdateSubtask: (subtask: ISubtask) => void;
    handleCreateSubtask: (subtask: ISubtask) => void;
    selectedTaskId: string | null;
    
    isCommunicationModalOpen: boolean;
    setIsCommunicationModalOpen: (isOpen: boolean) => void;
    handleSaveCommunication: (task: ITask) => void;
    handleUpdateCommunication: (task: ITask) => void;
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
    selectedCompliance?: IComplianceForm | undefined;
    isEditingCommunication?: boolean; 
}

const TaskModals: React.FC<TaskModalsProps> = ({
    isPopupOpen,
    setIsPopupOpen,
    selectedInfoTask,
    handleCancel,
    handleUpdateTask,
    handleSaveTask,
    isPopupSubtaskOpen,
    setIsPopupSubtaskOpen,
    selectedSubtask,
    handleCancelSubtask,
    handleUpdateSubtask,
    handleCreateSubtask,
    selectedTaskId,
    isCommunicationModalOpen,
    setIsCommunicationModalOpen,
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
    selectedCompliance,
    isPopupPlanificationOpen = false,
    setIsPopupPlanificationOpen = () => {},
}) => {

    const { isValleyManager, isCommunicationsManager } = useHooks();

    const isEditingCommunication = selectedTask !== undefined && selectedTask !== null;
    const isEditingCompliance = selectedCompliance !== undefined && selectedCompliance !== null;

    // Función para manejar el éxito de la carga
    const handlePlanificationSuccess = () => {
        console.log('Planificación cargada exitosamente');
        // Aquí puedes agregar lógica adicional como:
        // - Refrescar la lista de tareas
        // - Mostrar una notificación de éxito
        // - Actualizar el estado global
    };

    return (
        <>
            {/* Task Modal */}
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
                
            {/* Communication Modal */}
            {(isCommunicationsManager || userRole === 'encargado cumplimiento') && (
                <Modal isOpen={isCommunicationModalOpen} onClose={handleCancelCommunication}>
                    <CommunicationForm
                        onCancel={handleCancelCommunication}
                        onSave={isEditingCommunication ? handleUpdateCommunication : handleSaveCommunication}
                        isEditing={isEditingCommunication} 
                        selectedTask={selectedTask}
                        userRole={userRole}
                    />
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