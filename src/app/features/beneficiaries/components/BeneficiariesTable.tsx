'use client';
import { BeneficiariesTableColumns } from "@/constants/tableConstants";
import { IBeneficiary } from "@/app/models/IBeneficiary";
import React, { useState } from "react";;

interface BeneficiariesTableProps {
    beneficiaries: IBeneficiary[];
}

const BeneficiariesTable: React.FC<BeneficiariesTableProps> = ({
    beneficiaries,
}) => {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    const toggleRow = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

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
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {beneficiary.legalName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {beneficiary.rut}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {beneficiary.address}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {beneficiary.entityType}
                                </td>
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
                                    <td colSpan={6} className="px-6 py-4 bg-gray-100">
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
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BeneficiariesTable;