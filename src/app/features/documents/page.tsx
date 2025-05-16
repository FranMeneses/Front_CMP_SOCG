'use client';
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import LoadingSpinner from "@/components/LoadinSpinner";
import { useHooks } from "../hooks/useHooks";
import { documents } from "../../../../mocks/documentsMock";
import { DocumentTable } from "./components/DocumentsTable";
import { FileUploadButton } from "./components/FileUploadButton";

export default function Documents() {
    const [loading, setLoading] = useState<boolean>(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const { userRole } = useHooks();

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const handleFileChange = (file: File) => {
        console.log(file);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
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
                                <FileUploadButton onFileChange={handleFileChange} />
                                <DocumentTable documents={documents} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
    {/*TODO: AGREGAR FILTROS Y QUIEN SUBIO DOCUMENTOS*/}
}