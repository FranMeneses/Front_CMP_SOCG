import React from 'react';
import Modal from "@/components/Modal";
import { ITask } from '@/app/models/ITasks';
import ComplianceForm from './forms/ComplianceForm';
import { IComplianceForm } from '@/app/models/ICompliance';

interface ComplianceModalsProps {     
    isComplianceModalOpen: boolean;
    setIsComplianceModalOpen: (isOpen: boolean) => void;
    handleUpdateCompliance: (compliance: Partial<IComplianceForm>) => void;
    handleCancelCompliance: () => void;
    currentValleyName: string | undefined;
    userRole: string;
    selectedTask?: ITask | undefined; 
    selectedCompliance?: IComplianceForm | undefined;
}

const ComplianceModals: React.FC<ComplianceModalsProps> = ({
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
        { (userRole === "Encargado Cumplimiento" || userRole === 'Admin') && (
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

export default ComplianceModals;