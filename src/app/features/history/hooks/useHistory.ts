import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_HISTORIES } from '@/app/api/history';
import { IHistory } from '@/app/models/IHistory';
import axios from 'axios';

export const useHistory = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState<IHistory | null>(null);
    
    const { data: historyData, loading: historyLoading, refetch } = useQuery(GET_ALL_HISTORIES, {
        fetchPolicy: 'network-only'
    });

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const openHistoryModal = (history: IHistory) => {
        setSelectedHistory(history);
        setIsModalOpen(true);
    };

    const closeHistoryModal = () => {
        setIsModalOpen(false);
        setSelectedHistory(null);
    };

    /**
     * Función para descargar documentos históricos
     * @param historyDocumentId ID del documento histórico
     */
    const handleDownloadHistoryDocument = async (historyDocumentId: string) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/history/documents/download/${historyDocumentId}`, {
                responseType: 'blob',
            });

            const contentType = response.headers['content-type'];
            
            const contentDisposition = response.headers['content-disposition'];
            let filename = `history-document-${historyDocumentId}`;

            if (contentDisposition) {
                let filenameMatch = contentDisposition.match(/filename\*=UTF-8''(.+)/);
                if (filenameMatch && filenameMatch.length >= 2) {
                    filename = decodeURIComponent(filenameMatch[1]);
                } else {
                    filenameMatch = contentDisposition.match(/filename="(.+)"/);
                    if (filenameMatch && filenameMatch.length >= 2) {
                        filename = filenameMatch[1];
                    }
                }
            }
            
            const url = window.URL.createObjectURL(new Blob([response.data as BlobPart], { 
                type: contentType 
            }));
            
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename); 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setTimeout(() => window.URL.revokeObjectURL(url), 100);
        } catch (error) {
            console.error('Error al descargar el documento histórico:', error);
            throw error;
        }
    };

    return {
        isSidebarOpen,
        toggleSidebar,
        historyData: historyData?.histories || [],
        historyLoading,
        refetch,
        isModalOpen,
        selectedHistory,
        openHistoryModal,
        closeHistoryModal,
        handleDownloadHistoryDocument,
    };
};