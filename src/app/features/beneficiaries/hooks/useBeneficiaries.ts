import { useState, useEffect } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { CREATE_BENEFICIARY, CREATE_CONTACT, GET_BENEFICIARIES, GET_BENEFICIARY, REMOVE_BENEFICIARY, REMOVE_CONTACT, UPDATE_BENEFICIARY, UPDATE_CONTACT } from "@/app/api/beneficiaries";
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
    const [deleteBeneficiary] = useMutation(REMOVE_BENEFICIARY);
    const [deleteContact] = useMutation(REMOVE_CONTACT);

    /**
     * Cargar los beneficiarios al iniciar el componente
     */
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


    /**
     * Obtiene un beneficiario por su ID
     * @param beneficiaryId Id del beneficiario a obtener
     * @description Maneja la obtención de un beneficiario específico utilizando su ID
     * @returns 
     */

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

    /**
     * Maneja la creación de un nuevo contacto
     * @param contact Datos del contacto a crear
     * @description Crea un nuevo contacto 
     * @returns 
     */
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

    /**
     * Maneja la creación de un nuevo beneficiario
     * @param beneficiary Datos del beneficiario a crear
     * @description Crea un nuevo beneficiario 
     * @returns 
     */
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

    /**
     * Maneja la actualización de un contacto
     * @param contact Datos del contacto a actualizar
     * @description Actualiza los datos del contacto seleccionado
     * @returns 
     */
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
    
            setIsEditContactModalOpen(false);
            await refetch();
        } catch (err) {
            console.error("Error actualizando contacto:", err);
        }
    };

    /**
     * Maneja la actualización de un beneficiario
     * @param beneficiaryId Id del beneficiario a actualizar
     * @param updatedBeneficiary Datos actualizados del beneficiario
     * @description Actualiza los datos del beneficiario seleccionado
     * @returns 
     */
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
    
            setIsEditModalOpen(false);
            const updatedBeneficiaryData = data.updateBeneficiary;

            await refetch();
    
        } catch (err) {
            console.error("Error actualizando el beneficiario:", err);
        }
    };

    /**
     * Función para eliminar un beneficiario
     * @description Elimina un beneficiario y actualiza la lista local de beneficiarios
     * @param beneficiaryId Id del beneficiario a eliminar
     */
    const handleDeleteBeneficiary = async (beneficiaryId: string) => {
        try {
            const { data } = await deleteBeneficiary({
                variables: { id: beneficiaryId },
            });

            const deletedBeneficiary = data.removeBeneficiary;

            setLocalBeneficiaries((prev) => prev.filter((b) => b.id !== deletedBeneficiary.id));

            await refetch();
        }
        catch (err) {
            console.error("Error eliminando el beneficiario:", err);
        }
    };

    /**
     * Función para eliminar un contacto
     * @description Elimina un contacto del beneficiario seleccionado
     * @param contactId ID del contacto a eliminar
     */
    const handleDeleteContact = async (contactId: string) => {
        try {
            const { data } = await deleteContact({
                variables: { id: contactId },
            });

            const deletedContact = data.removeContact;

            setSelectedBeneficiary((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    contacts: prev.contacts.filter((c) => c.id !== deletedContact.id),
                };
            });

            await refetch();
        } catch (error) {
            console.error("Error eliminando el contacto:", error);
        }
    }

    /**
     * Maneja la edición de un beneficiario
     * @param beneficiaryId Id del beneficiario a editar
     * @description Abre el modal de edición de beneficiario con los datos del beneficiario seleccionado
     */
    const handleEditBeneficiary = async (beneficiaryId: string) => {
        try {
            const beneficiaryData = await handleGetBeneficiary(beneficiaryId);
            setSelectedBeneficiary(beneficiaryData);
            setIsEditModalOpen(true); 
        } catch (error) {
            console.error("Error al obtener el beneficiario:", error);
        }
    };

    /**
     * Maneja la edición de un contacto
     * @param contact Contacto a editar
     * @description Abre el modal de edición de contacto con los datos del contacto seleccionado
     */
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
        setSelectedContact,
        handleDeleteBeneficiary,
        handleDeleteContact,
    };
};