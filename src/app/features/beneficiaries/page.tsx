'use client';
import { Header } from "@/components/Header";
import LoadingSpinner from "@/components/LoadinSpinner";
import { Sidebar } from "@/components/Sidebar";
import BeneficiariesTable from "./components/BeneficiariesTable";
import { useBeneficiaries } from "./hooks/useBeneficiaries";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Modal from "@/components/Modal";
import BeneficiariesForm from "./components/BeneficiariesForm";

export default function Beneficiaries() {
    const { 
        isSidebarOpen, 
        toggleSidebar, 
        queryLoading, 
        handleAddBeneficiary, 
        isPopupOpen, 
        setIsPopupOpen } = useBeneficiaries();

    return (
        <div className="overflow-x-hidden">
            <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
            {queryLoading ? (
                <div className="flex items-center justify-center">
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
                                    ? "fixed top-[5rem] left-0 w-full h-[calc(100vh-5rem)] bg-white z-2000 sm:top-0 sm:left-0 sm:w-[220px] sm:relative sm:h-auto sm:bg-transparent"
                                    : ""
                            }`}
                        >
                            <Sidebar />
                        </aside>
                    )}
                    <main className="flex-1 p-4 overflow-y-auto">
                        <div className="flex flex-col gap-4">
                            <h1 className="text-2xl font-bold">Beneficiarios</h1>
                        </div>
                        <Button
                            variant="ghost"
                            className="mt-4 cursor-pointer"
                            onClick={() => setIsPopupOpen(true)}
                        >
                            <Plus className="mr-2" /> Agregar Beneficiario
                        </Button>
                        <div className="flex flex-col gap-4 mt-4">
                            <BeneficiariesTable />
                        </div>
                    </main>
                <Modal
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    children={
                        <BeneficiariesForm 
                            onSave={handleAddBeneficiary} 
                            onCancel={() => setIsPopupOpen(false)}
                        />
                    }
                    >
                </Modal>
                </div>
            )}
        </div>
    );
}