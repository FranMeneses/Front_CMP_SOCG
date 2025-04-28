'use client';
import { BeneficiariesTableColumns } from "@/constants/tableConstants";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
import ContactForm from "./ContactForm";
import { useBeneficiaries } from "../hooks/useBeneficiaries";
import React from "react";
import BeneficiariesForm from "./BeneficiariesForm";

const BeneficiariesTable: React.FC = () => {
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
    } = useBeneficiaries();

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {BeneficiariesTableColumns.map((column, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {beneficiaries.map((beneficiary) => (
                        <React.Fragment key={beneficiary.id}>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">{beneficiary.legalName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{beneficiary.rut}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{beneficiary.address}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{beneficiary.entityType}</td>
                                <td
                                    className="px-6 py-4 whitespace-nowrap text-blue-500 cursor-pointer"
                                    onClick={() => toggleRow(beneficiary.id)}
                                >
                                    {beneficiary.representative}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {beneficiary.hasLegalPersonality ? "Si" : "No"}
                                </td>
                                <td>
                                    <Pencil
                                        className="ml-2 cursor-pointer"
                                        onClick={() => handleEditBeneficiary(beneficiary.id)}
                                    />
                                </td>
                            </tr>
                            {expandedRow === beneficiary.id && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 bg-gray-100 relative">
                                        <div>
                                            <h4 className="font-medium text-gray-700">Contactos:</h4>
                                            <ul className="list-disc pl-5">
                                                {beneficiary.contacts.map((contact) => (
                                                    <li key={contact.id} className="text-gray-600 flex flex-row mb-2">
                                                        <strong>{contact.name}</strong> - {contact.position} - {contact.email} - {contact.phone}
                                                        <Pencil className="ml-2 cursor-pointer" onClick={() => handleEditContact(contact)}/>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="absolute top-0 right-0 h-full flex justify-center items-center">
                                            <Button
                                                onClick={() => setIsPopupOpen(true)}
                                                variant="ghost"
                                                size="default"
                                                className="flex flex-row cursor-pointer bg-gray-100"
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
            >
                <ContactForm
                    onSave={handleAddContact} 
                    selectedBeneficiaryId={selectedBeneficiaryId}
                    onCancel={() => setIsPopupOpen(false)}
                />
            </Modal>

            <Modal
                isOpen={isEditContactModalOpen} 
                onClose={() => {
                    setIsEditContactModalOpen(false);
                    setSelectedContact(null);
                }}
            >
                {selectedContact && (
                    <ContactForm
                        initialValues={selectedContact}
                        selectedBeneficiaryId={selectedBeneficiaryId}
                        onSave={handleUpdateContact} 
                        onCancel={() => {
                            setIsEditContactModalOpen(false);
                            setSelectedContact(null);
                        }}
                    />
                )}
            </Modal>

            <Modal
                isOpen={isEditModalOpen} 
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedBeneficiary(null);
                }}
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
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default BeneficiariesTable;