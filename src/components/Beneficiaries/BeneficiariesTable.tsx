'use client';
import { BeneficiariesTableColumns } from "@/constants/tableConstants";
import { Plus, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal"; // Agregar esta importación
import ContactForm from "./ContactForm";
import { useBeneficiaries } from "@/app/features/beneficiaries/hooks/useBeneficiaries";
import React, { useState } from "react"; // Agregar useState
import BeneficiariesForm from "./BeneficiariesForm";
import { useHooks } from "@/app/features/hooks/useHooks";

const BeneficiariesTable: React.FC = () => {
    // Estados para el modal de confirmación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteModalData, setDeleteModalData] = useState<{
        id: string;
        type: 'beneficiario' | 'contacto';
    } | null>(null);

    const {
        beneficiaries,
        isPopupOpen,
        setIsPopupOpen,
        expandedRow,
        toggleRow,
        handleAddContact,
        selectedBeneficiaryId,
        handleUpdateContact,
        handleUpdateBeneficiary,
        handleEditBeneficiary,
        setSelectedBeneficiary,
        selectedBeneficiary,
        setIsEditModalOpen,
        isEditModalOpen,
        handleEditContact,
        isEditContactModalOpen,
        setIsEditContactModalOpen,
        selectedContact,
        setSelectedContact,
        handleDeleteBeneficiary,
        handleDeleteContact,
    } = useBeneficiaries();

    const { userRole } = useHooks();

    // Funciones para manejar la confirmación de eliminación
    const handleDeleteBeneficiaryClick = (beneficiaryId: string) => {
        setDeleteModalData({ id: beneficiaryId, type: 'beneficiario' });
        setShowDeleteModal(true);
    };

    const handleDeleteContactClick = (contactId: string) => {
        setDeleteModalData({ id: contactId, type: 'contacto' });
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteModalData) {
            try {
                if (deleteModalData.type === 'beneficiario') {
                    await handleDeleteBeneficiary(deleteModalData.id);
                } else {
                    await handleDeleteContact(deleteModalData.id);
                }
                
                setShowDeleteModal(false);
                setDeleteModalData(null);
            } catch (error) {
                console.error('Error al eliminar:', error);
            }
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setDeleteModalData(null);
    };
    

    return (
    <div className="overflow-x-auto rounded-lg shadow font-[Helvetica]">
        <table className="w-full">
            <thead className="bg-gray-100">
                <tr className="text-sm text-gray-700">
                    {BeneficiariesTableColumns.map((column, index) => (
                        <th
                            key={index}
                            className="py-2 text-center text-xs font-medium text-gray-500"
                        >
                            {column}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-white text-xs truncate divide-y divide-[#e5e5e5]">
                {beneficiaries.map((beneficiary) => (
                        <React.Fragment key={beneficiary.id}>
                            <tr className="text-center">
                                <td className="px-6 py-4 whitespace-nowrap">{beneficiary.legalName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{beneficiary.rut}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{beneficiary.address}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{beneficiary.entityType}</td>
                                <td
                                    className="px-6 py-4 whitespace-nowrap cursor-pointer font-medium text-[#003474]"
                                    onClick={() => toggleRow(beneficiary.id)}
                                >
                                    {beneficiary.representative}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {beneficiary.hasLegalPersonality ? "Si" : "No"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap flex flex-row gap-2">
                                    <Pencil
                                        size={20}
                                        className="cursor-pointer"
                                        onClick={() => handleEditBeneficiary(beneficiary.id)}
                                        data-test-id="edit-beneficiary-button"
                                        color="gray"
                                    />
                                    { userRole === "encargado cumplimiento" && (
                                        <Trash
                                            size={20}
                                            color="gray"
                                            className="cursor-pointer ml-2"
                                            onClick={() => handleDeleteBeneficiaryClick(beneficiary.id)} 
                                        />
                                    )}

                                </td>
                            </tr>
                            {expandedRow === beneficiary.id && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 bg-gray-200 relative">
                                        <div>
                                            <h4 className="font-medium text-gray-700">Contactos:</h4>
                                            <ul className="list-disc pl-5">
                                                {beneficiary.contacts.map((contact) => (
                                                    <li key={contact.id} className="text-gray-600 flex flex-row mb-2">
                                                        <strong>{contact.name}</strong> - {contact.position} - {contact.email} - {contact.phone}
                                                        <Pencil 
                                                            className="ml-4 cursor-pointer" 
                                                            onClick={() => handleEditContact(contact)} data-test-id="edit-contact-button"
                                                        />
                                                        { userRole === "encargado cumplimiento" && (
                                                            <Trash
                                                                size={20}
                                                                className="cursor-pointer ml-2"
                                                                onClick={() => handleDeleteContactClick(contact.id)} 
                                                            />
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="absolute top-0 right-5 h-full flex justify-center items-center">
                                            <Button
                                                onClick={() => setIsPopupOpen(true)}
                                                variant="ghost"
                                                size="default"
                                                className="flex flex-row cursor-pointer bg-gray-200 hover:bg-gray-300"
                                                data-test-id="add-contact-button"
                                            >
                                                <Plus color="black" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            
            <Modal
                isOpen={isPopupOpen} 
                onClose={() => setIsPopupOpen(false)}
                data-test-id="add-contact-modal"
            >
                <h2 className="text-lg font-bold mb-4">Añadir Contacto</h2>
                <ContactForm
                    onSave={handleAddContact} 
                    selectedBeneficiaryId={selectedBeneficiaryId}
                    onCancel={() => setIsPopupOpen(false)}
                    data-test-id="contact-form"
                />
            </Modal>

            <Modal
                isOpen={isEditContactModalOpen} 
                onClose={() => {
                    setIsEditContactModalOpen(false);
                    setSelectedContact(null);
                }}
                data-test-id="edit-contact-modal"
            >
                <h2 className="text-lg font-bold mb-4">Editar Contacto</h2>
                {selectedContact && (
                <ContactForm
                        initialValues={selectedContact}
                        selectedBeneficiaryId={selectedBeneficiaryId}
                        onSave={handleUpdateContact} 
                        onCancel={() => {
                            setIsEditContactModalOpen(false);
                            setSelectedContact(null);
                        }}
                        data-test-id="edit-contact-form"
                    />
                )}
            </Modal>

            <Modal
                isOpen={isEditModalOpen} 
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedBeneficiary(null);
                }}
                data-test-id="edit-beneficiary-modal"
            >
                {selectedBeneficiary && (
                    <div className="p-4">
                        <h2 className="text-lg font-bold mb-4">Editar Beneficiario</h2>
                        <BeneficiariesForm
                            initialValues={selectedBeneficiary} 
                            onSave={(updatedBeneficiary) => {
                                const completeBeneficiary = {
                                    ...selectedBeneficiary,
                                    ...updatedBeneficiary,
                                };

                                handleUpdateBeneficiary(completeBeneficiary.id, completeBeneficiary);
                                setIsEditModalOpen(false);
                                setSelectedBeneficiary(null);
                            }}
                            onCancel={() => {
                                setIsEditModalOpen(false);
                                setSelectedBeneficiary(null);
                            }}
                            data-test-id="edit-beneficiary-form"
                        />
                    </div>
                )}
            </Modal>
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                itemType={deleteModalData?.type === 'beneficiario' ? 'beneficiario' : 'contacto'}
            />
        </div>
    );
};

export default BeneficiariesTable;