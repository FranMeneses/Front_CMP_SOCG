import { useState } from "react";
import { useDocumentsRest } from "./useDocumentsRest";

export function useDocumentsPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const { handleUpload } = useDocumentsRest();

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const handleUploadFile = (file: File) => {
        handleUpload(file);
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