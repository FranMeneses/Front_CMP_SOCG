import React from 'react';
import Modal from "@/components/Modal";
import { ITask } from '@/app/models/ITasks';
import ComplianceForm from './forms/ComplianceForm';
import { IComplianceForm } from '@/app/models/ICompliance';

interface TaskModalsProps {

    
    isComplianceModalOpen: boolean;
    setIsComplianceModalOpen: (isOpen: boolean) => void;
    handleUpdateCompliance: (compliance: IComplianceForm) => void;
    handleCancelCompliance: () => void;
    currentValleyName: string | null;
    userRole: string;
    selectedTask?: ITask | undefined; 
    selectedCompliance?: IComplianceForm | undefined;
}

const TaskModals: React.FC<TaskModalsProps> = ({
    isComplianceModalOpen,
    setIsComplianceModalOpen,
    handleUpdateCompliance,
    handleCancelCompliance,

    userRole,
    selectedCompliance,
}) => {

    const isEditingCompliance = selectedCompliance !== undefined && selectedCompliance !== null;

    return (
    <>
        {userRole === "encargado cumplimiento" && (
            <Modal isOpen={isComplianceModalOpen} onClose={() => setIsComplianceModalOpen(false)}>
            <ComplianceForm
                onCancel={handleCancelCompliance}
                onSave={handleUpdateCompliance}
                isEditing={isEditingCompliance} 
                selectedCompliance={selectedCompliance}
                userRole={userRole}
            />
            </Modal>
        )}
    </>
  );
};

export default TaskModals;