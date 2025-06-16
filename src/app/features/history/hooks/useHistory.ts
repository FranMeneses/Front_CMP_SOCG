import { GET_ALL_HISTORIES } from "@/app/api/history";
import { useQuery } from "@apollo/client";
import { useState } from "react";

export const useHistory = () => {
    
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const { data: historyData, loading: historyLoading } = useQuery(GET_ALL_HISTORIES);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const histories = historyData?.histories || [];

    console.log("History Data:", histories);
    
    return {
        historyData: histories, 
        historyLoading,
        isSidebarOpen,
        toggleSidebar
    };
}