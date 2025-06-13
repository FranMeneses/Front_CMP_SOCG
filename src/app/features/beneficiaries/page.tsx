'use client';
import { Header } from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Sidebar } from "@/components/Sidebar";
import BeneficiariesTable from "@/components/Beneficiaries/BeneficiariesTable";
import { useBeneficiaries } from "./hooks/useBeneficiaries";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Modal from "@/components/Modal";
import BeneficiariesForm from "@/components/Beneficiaries/BeneficiariesForm";
import { useHooks } from "../hooks/useHooks";

export default function Beneficiaries() {
    const { 
        isSidebarOpen, 
        toggleSidebar, 
        queryLoading, 
        handleAddBeneficiary, 
        isPopupOpen, 
        setIsPopupOpen } = useBeneficiaries();
    
    const {userRole} = useHooks();

    return (
        <div className="overflow-x-hidden">
            <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} data-test-id="header"/>
            {queryLoading ? (
                <div className="flex items-center justify-center" data-test-id="loading-spinner">
                    <LoadingSpinner />
                </div>
            ) : (
                <div
                    className={`grid h-screen overflow-hidden ${
                        isSidebarOpen ? "grid-cols-[220px_1fr]" : "grid-cols-1"
                    }`}
                    style={{ height: "calc(100vh - 5rem)" }}
                >
                {isSidebarOpen && (
                    <aside
                    className={`border-r h-full ${
                        isSidebarOpen
                        ? "fixed top-[5rem] left-0 w-full h-[calc(100vh-5rem)] bg-white z-1000 sm:top-0 sm:left-0 sm:w-[220px] sm:relative sm:h-auto sm:bg-transparent"
                        : ""
                    }`}
                    data-test-id="sidebar"
                    >
                    <Sidebar userRole={userRole} onNavClick={toggleSidebar} />
                    </aside>
                )}
                    <main className="flex-1 p-4 overflow-y-auto font-[Helvetica]">
                        <div className="flex flex-col gap-4">
                            <h1 className="text-2xl font-[Helvetica] font-bold">Beneficiarios</h1>
                        </div>
                        <Button
                            className="mt-4 cursor-pointer bg-[#4f67b8e0] text-white "
                            onClick={() => setIsPopupOpen(true)}
                            data-test-id="add-beneficiary-button"
                        >
                            <Plus className="mr-2 text-white" /> Agregar Beneficiario
                        </Button>
                        <div className="flex flex-col gap-4 mt-4">
                            <BeneficiariesTable data-test-id="beneficiary-table"/>
                        </div>
                    </main>
                <Modal
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    children={
                        <>
                        <h2 className="text-lg font-bold mb-4">Añadir Beneficiario</h2>
                            <BeneficiariesForm 
                                onSave={handleAddBeneficiary} 
                                onCancel={() => setIsPopupOpen(false)}
                            />
                        </>
                    }
                    data-test-id="add-beneficiary-modal"
                    >
                </Modal>
                </div>
            )}
        </div>
    );
}