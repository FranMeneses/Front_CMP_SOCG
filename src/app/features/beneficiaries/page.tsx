'use client';
import { Header } from "@/components/Header";
import LoadingSpinner from "@/components/LoadinSpinner";
import { Sidebar } from "@/components/Sidebar";
import { useEffect, useState } from "react";
import BeneficiariesTable from "./components/BeneficiariesTable";
import { useQuery } from "@apollo/client";
import { GET_BENEFICIARIES } from "@/app/api/beneficiaries";


export default function Beneficiaries() {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const { data, loading: queryLoading } = useQuery(GET_BENEFICIARIES);
    const beneficiaries = data?.beneficiaries || [];

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };


    return (

        <div className="overflow-x-hidden">
            <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen}/> 
            {queryLoading ? 
            (
                <div className="flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) 
            : 
            (
            <div className={`grid h-screen overflow-hidden ${isSidebarOpen ? "grid-cols-[220px_1fr]" : "grid-cols-1"}`} style={{height: "calc(100vh - 5rem)"}} >
                {isSidebarOpen && (
                    <aside className={`border-r h-full ${
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
                    <div className="flex flex-col gap-4 mt-4">
                        <BeneficiariesTable beneficiaries={beneficiaries}/>
                    </div>
                </main>
            </div>
            )}
        </div>
    );
}