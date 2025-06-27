'use client';
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useHooks } from "../hooks/useHooks";
import { DocumentTable } from "@/components/Documents/DocumentsTable";
import { useDocumentsGraph } from "./hooks/useDocumentsGraph";
import { useDocumentsPage } from "./hooks/useDocumentsPage";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DocumentForm from "@/components/Documents/DocumentForm";
import Modal from "@/components/Modal";
import DropdownMenu from "@/components/Dropdown";
import { useEffect } from "react";
import Image from "next/image";

export default function Documents() {
    const { userRole, handleLogout } = useHooks();
    const { documentsWithTasks, isLoading, tasksLoaded } = useDocumentsGraph();
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
        setupDocumentFiltering(documentsWithTasks);
    }, [documentsWithTasks, tasksLoaded]);

    const onSelectType = (selectedOption: string) => {
        const selected = documentTypes.find(type => type.name === selectedOption);
        
        if (selected) {
            handleTypeSelect(selected.id, selected.name, documentsWithTasks);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen w-full">
                <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
                <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#F2F2F2]">
            <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
            <div 
                className={`grid ${isSidebarOpen ? "grid-cols-[220px_1fr]" : "grid-cols-1"}`}
            >
                {isSidebarOpen && (
                    <aside
                        className={`border-r ${
                            isSidebarOpen
                                ? "fixed top-[5rem] left-0 w-full h-[calc(100vh-5rem)] bg-white z-1000 sm:top-0 sm:left-0 sm:w-[220px] sm:relative sm:h-auto sm:bg-transparent overflow-y-auto"
                                : ""
                        }`}
                    >
                        <Sidebar userRole={userRole} onNavClick={toggleSidebar} handleLogout={handleLogout}/>
                    </aside>
                )}
                <main className="flex-1 bg-[#F2F2F2] font-[Helvetica]">
                    <div className="flex flex-col gap-6 w-full font-[Helvetica] min-w-0 px-8 lg:px-12 xl:px-16 py-6">
                        <div className="bg-white rounded-lg shadow">
                            <div className="flex flex-row gap-4 items-center px-6 pt-6 pb-4 border-b border-gray-200">
                                <Image
                                    src={'/Caja4GRP.png'}
                                    alt="Documentos Icon"
                                    width={95}
                                    height={95}
                                />
                                <h1 className="text-3xl font-bold">Documentos</h1>
                            </div>
                            
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex justify-start items-center gap-4">
                                    <div className="w-auto min-w-[180px]">
                                        <DropdownMenu
                                            buttonText="Filtrar por tipo"
                                            items={documentTypes.map(type => type.name)}
                                            onSelect={onSelectType}
                                            selectedValue={selectedTypeName}
                                            disabled={isFilterLoading}
                                        />
                                    </div>
                                    <Button 
                                        onClick={handleOpenForm}
                                        className="bg-[#0068D1] hover:bg-[#0056A3] text-white flex items-center gap-1"
                                    >
                                        <Plus size={16} /> Añadir
                                    </Button>
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