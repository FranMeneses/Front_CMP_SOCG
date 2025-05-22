import { useState } from "react";
import { useDocumentsRest } from "./useDocumentsRest";
import { FormData as DocumentFormData } from './useDocumentForms';

export function useDocumentsPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const { handleUpload } = useDocumentsRest();

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const handleUploadFile = async (formData: DocumentFormData) => {
        try {
            await handleUpload(formData);
            setIsFormOpen(false);
        } catch (error) {
            console.error("Error en handleUploadFile:", error);
        }
    };
    
    const handleOpenForm = () => {
        setIsFormOpen(true);
    }

    return {
        isSidebarOpen,
        isFormOpen,
        setIsFormOpen,
        toggleSidebar,
        handleUploadFile,
        handleOpenForm,
    };
}