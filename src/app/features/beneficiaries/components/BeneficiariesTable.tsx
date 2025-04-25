'use client';
import { BeneficiariesTableColumns } from "@/constants/tableConstants";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
import ContactForm from "./ContactForm";
import { useBeneficiaries } from "../hooks/useBeneficiaries";
import React from "react";

const BeneficiariesTable: React.FC = () => {
    const {
        beneficiaries,
        isPopupOpen,
        setIsPopupOpen,
        expandedRow,
        toggleRow,
        handleAddContact,
        selectedBeneficiaryId,
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
                            </tr>
                            {expandedRow === beneficiary.id && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 bg-gray-100 relative">
                                        <div>
                                            <h4 className="font-medium text-gray-700">Contactos:</h4>
                                            <ul className="list-disc pl-5">
                                                {beneficiary.contacts.map((contact) => (
                                                    <li key={contact.id} className="text-gray-600">
                                                        <strong>{contact.name}</strong> - {contact.position} - {contact.email} - {contact.phone}
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
                children={
                    <ContactForm
                        onSave={handleAddContact}
                        selectedBeneficiaryId={selectedBeneficiaryId}
                        onCancel={() => setIsPopupOpen(false)}
                    />
                }
            />
        </div>
    );
};

export default BeneficiariesTable;