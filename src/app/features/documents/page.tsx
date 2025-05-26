'use client';
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import LoadingSpinner from "@/components/LoadinSpinner";
import { useHooks } from "../hooks/useHooks";
import { DocumentTable } from "./components/DocumentsTable";
import { useDocumentsGraph } from "./hooks/useDocumentsGraph";
import { useDocumentsPage } from "./hooks/useDocumentsPage";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DocumentForm from "./components/DocumentForm";
import Modal from "@/components/Modal";
import DropdownMenu from "@/components/Dropdown";
import { useEffect } from "react";

export default function Documents() {
    const { userRole } = useHooks();
    const { documents, isLoading } = useDocumentsGraph();
    const { 
        isSidebarOpen, 
        isFormOpen, 
        toggleSidebar, 
        handleOpenForm, 
        setIsFormOpen, 
        handleUploadFile,
        filteredDocuments,
        documentTypes,
        selectedTypeName,
        setupDocumentFiltering,
        handleTypeSelect,
        isFilterLoading
    } = useDocumentsPage();

    useEffect(() => {
        setupDocumentFiltering(documents);
    }, [documents?.length]);

    const onSelectType = (selectedOption: string) => {
        const selected = documentTypes.find(type => type.name === selectedOption);
        
        if (selected) {
            handleTypeSelect(selected.id, selected.name, documents);
        }
    };

    if (isLoading) {
        return (
            <div className="overflow-x-hidden">
                <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
                <div className="flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-x-hidden">
            <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
            <div 
                className={`grid h-screen overflow-hidden ${isSidebarOpen ? "grid-cols-[220px_1fr]" : "grid-cols-1"}`} 
                style={{height: "calc(100vh - 5rem)"}}
            >
                {isSidebarOpen && (
                    <aside
                    className={`border-r h-full ${
                        isSidebarOpen
                        ? "fixed top-[5rem] left-0 w-full h-[calc(100vh-5rem)] bg-white z-2000 sm:top-0 sm:left-0 sm:w-[220px] sm:relative sm:h-auto sm:bg-transparent"
                        : ""
                    }`}
                    >
                    <Sidebar userRole={userRole} onNavClick={toggleSidebar} />
                    </aside>
                )}
                <main className="flex-1 p-4 overflow-y-auto">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-2xl font-bold">Centro Documental</h1>
                        <div className="flex flex-row">
                            <div className="w-full ml-4">
                                <div className="flex justify-between items-center mb-4">
                                    <Button 
                                        onClick={handleOpenForm}
                                        className="bg-[#4f67b8e0] text-white flex items-center gap-1 hover:cursor-pointer"
                                    >
                                        <Plus size={16} /> Añadir
                                    </Button>
                                    <div className="w-auto min-w-[180px]">
                                        <DropdownMenu
                                            buttonText="Filtrar por tipo"
                                            items={documentTypes.map(type => type.name)}
                                            onSelect={onSelectType}
                                            selectedValue={selectedTypeName}
                                            disabled={isFilterLoading}
                                        />
                                    </div>
                                </div>
                                
                                {isFilterLoading ? (
                                <div className="flex justify-center py-8">
                                    <LoadingSpinner />
                                </div>
                                ) : (
                                    <DocumentTable documents={filteredDocuments} />
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            
            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold">Añadir nuevo documento</h2>
                </div>
                <DocumentForm 
                    onSave={handleUploadFile}
                    onCancel={() => setIsFormOpen(false)}
                />
            </Modal>
        </div>
    );
}