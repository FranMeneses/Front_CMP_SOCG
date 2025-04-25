import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_BENEFICIARY, CREATE_CONTACT, GET_BENEFICIARIES } from "@/app/api/beneficiaries";
import { IBeneficiary } from "@/app/models/IBeneficiary";

export const useBeneficiaries = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string | null>(null);
    const [localBeneficiaries, setLocalBeneficiaries] = useState<IBeneficiary[]>([]);

    const { data, loading: queryLoading } = useQuery(GET_BENEFICIARIES);
    const [createContact] = useMutation(CREATE_CONTACT);
    const [createBeneficiary] = useMutation(CREATE_BENEFICIARY);

    useEffect(() => {
        if (data?.beneficiaries) {
            setLocalBeneficiaries(data.beneficiaries);
        }
    }, [data]);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const toggleRow = (id: string) => {
        setSelectedBeneficiaryId(id);
        setExpandedRow(expandedRow === id ? null : id);
    };

    const handleAddContact = async (contact: { name: string; position: string; email: string; phone: string }) => {
        try {
            const { data } = await createContact({
                variables: {
                    input: {
                        beneficiaryId: selectedBeneficiaryId,
                        name: contact.name,
                        position: contact.position,
                        email: contact.email,
                        phone: contact.phone,
                    },
                },
            });

            const newContact = data.createContact;
            setIsPopupOpen(false);
            return newContact;
        } catch (err) {
            console.error("Error creating contact:", err);
        }
    };

    const handleAddBeneficiary = async (beneficiary: { legalName: string; rut: string; address: string; entityType: string; representative: string; hasLegalPersonality: boolean }) => {
        try {
            const { data } = await createBeneficiary({
                variables: {
                    input: {
                        legalName: beneficiary.legalName,
                        rut: beneficiary.rut,
                        address: beneficiary.address,
                        entityType: beneficiary.entityType,
                        representative: beneficiary.representative,
                        hasLegalPersonality: beneficiary.hasLegalPersonality,
                    },
                },
            });
            const newBeneficiary = data.createBeneficiary;

            // Add the new beneficiary to the local state
            setLocalBeneficiaries((prev) => [...prev, newBeneficiary]);

            setIsPopupOpen(false);
            return newBeneficiary;
        } catch (err) {
            console.error("Error creating beneficiary:", err);
        }
    };

    return {
        isSidebarOpen,
        toggleSidebar,
        isPopupOpen,
        setIsPopupOpen,
        expandedRow,
        toggleRow,
        selectedBeneficiaryId,
        setSelectedBeneficiaryId,
        beneficiaries: localBeneficiaries, 
        queryLoading,
        handleAddContact,
        handleAddBeneficiary,
    };
};