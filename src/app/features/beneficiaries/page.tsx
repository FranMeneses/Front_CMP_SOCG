'use client'
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import BeneficiariesForm from "@/components/Beneficiaries/BeneficiariesForm";
import BeneficiariesTable from "@/components/Beneficiaries/BeneficiariesTable";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
import { useBeneficiaries } from "./hooks/useBeneficiaries";
import { useHooks } from "../hooks/useHooks";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Beneficiaries() {
  const {
    toggleSidebar,
    isSidebarOpen,
    queryLoading: beneficiariesLoading,
    isPopupOpen,
    setIsPopupOpen,
    handleAddBeneficiary,
  } = useBeneficiaries();

  const { userRole } = useHooks();

  if (beneficiariesLoading) {
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
        className={`grid ${
          isSidebarOpen ? "grid-cols-[220px_1fr]" : "grid-cols-1"
        }`}
      >
        {isSidebarOpen && (
          <aside
            className={`border-r ${
              isSidebarOpen
                ? "fixed top-[5rem] left-0 w-full h-[calc(100vh-5rem)] bg-white z-1000 sm:top-0 sm:left-0 sm:w-[220px] sm:relative sm:h-auto sm:bg-transparent overflow-y-auto"
                : ""
            }`}
          >
            <Sidebar userRole={userRole} onNavClick={toggleSidebar} />
          </aside>
        )}
        <main className="flex-1 bg-[#F2F2F2] font-[Helvetica]">
          <div className="flex flex-col gap-6 w-full font-[Helvetica] min-w-0 px-8 lg:px-12 xl:px-16 py-6">
            <h1 className="text-3xl font-bold">Beneficiarios</h1>
              <div className="flex justify-between items-center">
                {userRole === "encargado cumplimiento" && (
                  <Button
                    onClick={() => setIsPopupOpen(true)}
                    className="bg-[#0068D1] hover:bg-[#0056A3] cursor-pointer text-white flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Añadir Beneficiario
                  </Button>
                )}
              </div>
        
            <div className="bg-[#F2F2F2] rounded-lg shadow">
              <BeneficiariesTable />
            </div>
          </div>
        </main>
      </div>

      <Modal
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      >
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Añadir Beneficiario</h2>
          <BeneficiariesForm
            onSave={(beneficiary) => {
              handleAddBeneficiary(beneficiary);
              setIsPopupOpen(false);
            }}
            onCancel={() => setIsPopupOpen(false)}
          />
        </div>
      </Modal>
    </div>
  );
}