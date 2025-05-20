import { useState, useEffect } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { CREATE_BENEFICIARY, CREATE_CONTACT, GET_BENEFICIARIES, GET_BENEFICIARY, UPDATE_BENEFICIARY, UPDATE_CONTACT } from "@/app/api/beneficiaries";
import { IBeneficiary, IContact } from "@/app/models/IBeneficiary";

export const useBeneficiaries = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string | null>(null);
    const [selectedBeneficiary, setSelectedBeneficiary] = useState<IBeneficiary | null>(null);
    const [selectedContact,setSelectedContact] = useState<IContact | null>(null);
    const [localBeneficiaries, setLocalBeneficiaries] = useState<IBeneficiary[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isEditContactModalOpen, setIsEditContactModalOpen] = useState<boolean>(false);

    const { data, loading: queryLoading, refetch } = useQuery(GET_BENEFICIARIES);
    const [getBeneficiary, { data: beneficiaryData, loading }] = useLazyQuery(GET_BENEFICIARY);
    const [createContact] = useMutation(CREATE_CONTACT);
    const [createBeneficiary] = useMutation(CREATE_BENEFICIARY);
    const [updateContact] = useMutation(UPDATE_CONTACT);
    const [updateBeneficiary] = useMutation(UPDATE_BENEFICIARY);

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

    const handleGetBeneficiary = async (beneficiaryId: string) => {
        try {
            const { data } = await getBeneficiary({
                variables: { id: beneficiaryId },
            });
            return data.beneficiary;
        } catch (err) {
            console.error("Error fetching beneficiary:", err);
        }
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

            await refetch();

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

            setLocalBeneficiaries((prev) => [...prev, newBeneficiary]);

            setIsPopupOpen(false);

            await refetch();

            return newBeneficiary;
        } catch (err) {
            console.error("Error creating beneficiary:", err);
        }
    };

    const handleUpdateContact = async (contact: { id?: string; name: string; position: string; email: string; phone: string }) => {
        try {
            if (!contact.id) {
                throw new Error("El ID del contacto es requerido para actualizar.");
            }
    
            const { id, name, position, email, phone } = contact;
    
            const { data } = await updateContact({
                variables: {
                    id,
                    input: {
                        name,
                        position,
                        email,
                        phone,
                    },
                },
            });
    
            await refetch();
        } catch (err) {
            console.error("Error actualizando contacto:", err);
        }
    };

    const handleUpdateBeneficiary = async (beneficiaryId: string, updatedBeneficiary: IBeneficiary) => {
        try {
            const { legalName, rut, address, entityType, representative, hasLegalPersonality } = updatedBeneficiary;
    
            const { data } = await updateBeneficiary({
                variables: {
                    id: beneficiaryId,
                    input: {
                        legalName,
                        rut,
                        address,
                        entityType,
                        representative,
                        hasLegalPersonality,
                    },
                },
            });
    
            const updatedBeneficiaryData = data.updateBeneficiary;

            await refetch();
    
        } catch (err) {
            console.error("Error actualizando el beneficiario:", err);
        }
    };

    const handleEditBeneficiary = async (beneficiaryId: string) => {
        try {
            const beneficiaryData = await handleGetBeneficiary(beneficiaryId);
            setSelectedBeneficiary(beneficiaryData);
            setIsEditModalOpen(true); 
        } catch (error) {
            console.error("Error al obtener el beneficiario:", error);
        }
    };

    const handleEditContact = async (contact: IContact) => {
        const updatedContact = contact;
        setSelectedContact(updatedContact);
        setIsEditContactModalOpen(true);
    }

    return {
        isSidebarOpen,
        toggleSidebar,
        isPopupOpen,
        setIsPopupOpen,
        expandedRow,
        toggleRow,
        selectedBeneficiaryId,
        beneficiaries: localBeneficiaries, 
        queryLoading,
        handleAddContact,
        handleAddBeneficiary,
        handleUpdateContact,
        handleUpdateBeneficiary,
        handleGetBeneficiary,
        handleEditBeneficiary,
        setSelectedBeneficiary,
        selectedBeneficiary,
        setIsEditModalOpen,
        isEditModalOpen,
        handleEditContact,
        isEditContactModalOpen,
        setIsEditContactModalOpen,
        selectedContact,
        setSelectedContact
    };
};