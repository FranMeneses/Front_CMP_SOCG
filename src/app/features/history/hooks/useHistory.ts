import { GET_ALL_HISTORIES } from "@/app/api/history";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { IHistory } from "@/app/models/IHistory";

export const useHistory = () => {
    
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedHistory, setSelectedHistory] = useState<IHistory | null>(null);
    
    const { data: historyData, loading: historyLoading } = useQuery(GET_ALL_HISTORIES);
    

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const openHistoryModal = (history: IHistory) => {
        setSelectedHistory(history);
        console.log("Selected History:", history);
        setIsModalOpen(true);
    };

    const closeHistoryModal = () => {
        setIsModalOpen(false);
        setSelectedHistory(null);
    };

    const histories = historyData?.histories || [];
    
    return {
        historyData: histories, 
        historyLoading,
        isSidebarOpen,
        isModalOpen,
        selectedHistory,
        toggleSidebar,
        openHistoryModal,
        closeHistoryModal
    };
}