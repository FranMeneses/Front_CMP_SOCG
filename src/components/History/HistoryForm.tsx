import { Button } from "@/components/ui/button";
import { IHistory } from "@/app/models/IHistory";
import { useHistory } from "@/app/features/history/hooks/useHistory";
import { useHooks } from "@/app/features/hooks/useHooks";
import { Clipboard, FileText, Info, User2Icon, Trash } from "lucide-react";
import { useState } from "react";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

interface HistoryFormProps {
    historyData?: IHistory;
    onClose: () => void;
}

export default function HistoryForm({ historyData, onClose }: HistoryFormProps) {
    const { handleDownloadHistoryDocument, handleDeleteHistoryDocument, refetch } = useHistory();
    const { userRole } = useHooks();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<{ id: string; name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'No definida';
        
        const [year, month, day] = dateString.split('T')[0].split('-');
        
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        
        const monthIndex = parseInt(month, 10) - 1;
        const dayNum = parseInt(day, 10);
        const yearNum = parseInt(year, 10);
        
        return `${dayNum} de ${months[monthIndex]} de ${yearNum}`;
    };

    const handleDocumentDownload = async (documentId: string) => {
        try {
            await handleDownloadHistoryDocument(documentId);
        } catch (error) {
            console.error('Error al descargar documento histórico:', error);
            // Aquí podrías agregar un toast de error si tienes un sistema de notificaciones
        }
    };

    const handleDeleteClick = (documentId: string, fileName: string) => {
        setDocumentToDelete({ id: documentId, name: fileName });
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (documentToDelete && !isDeleting) {
            setIsDeleting(true);
            try {
                await handleDeleteHistoryDocument(documentToDelete.id);
                console.log('Documento histórico eliminado exitosamente');
                // Refrescar los datos del historial
                await refetch();
                // Cerrar el modal de confirmación
                setIsDeleteModalOpen(false);
                setDocumentToDelete(null);
                // Cerrar el modal de detalle del historial para que se actualice la lista
                onClose();
            } catch (error) {
                console.error('Error al eliminar documento histórico:', error);
                // Aquí podrías agregar un toast de error si tienes un sistema de notificaciones
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleCancelDelete = () => {
        if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setDocumentToDelete(null);
        }
    };

    const isAdmin = userRole === "Admin";

    return (
        <>
            <div className="p-5 max-w-2xl mx-auto" data-test-id="history-form">
                <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Detalle del Histórico
                    </h2>
                </div>
                
                <div className="space-y-6">
                    {/* Información Básica */}
                    <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                            <Info className="h-4 w-4 mr-2"/>
                            Información General
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">Nombre</label>
                                <div className="bg-white border border-gray-200 rounded p-2 text-sm">
                                    {historyData?.name || 'No disponible'}
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">Proceso</label>
                                <div className="bg-white border border-gray-200 rounded p-2 text-sm">
                                    {historyData?.process?.name || 'No disponible'}
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">Fecha de Término</label>
                                <div className="bg-white border border-gray-200 rounded p-2 text-sm">
                                    {historyData?.finalDate ? formatDate(historyData.finalDate) : 'No definida'}
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">Gastos Totales</label>
                                <div className="bg-white border border-gray-200 rounded p-2 text-sm">
                                    {historyData?.totalExpense ? formatCurrency(historyData.totalExpense) : '$0 USD'}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Información SAP */}
                    <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                            <Clipboard className="h-4 w-4 mr-2"/>
                            Información SAP
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">SOLPED / MEMO</label>
                                <div className="bg-white border border-gray-200 rounded p-2 text-sm">
                                    {historyData?.solpedMemoSap || 'No disponible'}
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">HES / HEM</label>
                                <div className="bg-white border border-gray-200 rounded p-2 text-sm">
                                    {historyData?.hesHemSap || 'No disponible'}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Beneficiario */}
                    <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                            <User2Icon className="h-4 w-4 mr-2"/>
                            Beneficiario
                        </h3>
                        
                        {historyData?.beneficiary ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500">Nombre Legal</label>
                                    <div className="bg-white border border-gray-200 rounded p-2 text-sm">
                                        {historyData.beneficiary.legalName || 'No disponible'}
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500">RUT</label>
                                    <div className="bg-white border border-gray-200 rounded p-2 text-sm">
                                        {historyData.beneficiary.rut || 'No disponible'}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white border border-gray-200 rounded p-2 text-sm">
                                No disponible
                            </div>
                        )}
                    </div>
                    
                    {/* Documentos */}
                    <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                            <FileText className="h-4 w-4 mr-2"/>
                            Documentos Asociados
                        </h3>
                        
                        {historyData?.documents && historyData.documents.length > 0 ? (
                            <div className="space-y-2">
                                {historyData.documents.map((doc, index) => (
                                    <div key={index} className="bg-white border border-gray-200 rounded p-2 flex justify-between items-center">
                                        <span className="text-sm">{doc.fileName}</span>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleDocumentDownload(doc.id)}
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                Descargar
                                            </button>
                                            {isAdmin && (
                                                <button 
                                                    onClick={() => handleDeleteClick(doc.id, doc.fileName)}
                                                    className={`text-red-600 hover:text-red-800 text-sm flex items-center gap-1 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    disabled={isDeleting}
                                                >
                                                    <Trash className="h-3 w-3" />
                                                    Borrar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white border border-gray-200 rounded p-2 text-sm">
                                No hay documentos asociados
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="flex justify-end mt-6">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="bg-[#0068D1] hover:bg-[#0056A3] cursor-pointer text-white"
                        data-test-id="close-button"
                    >
                        Cerrar
                    </Button>
                </div>
            </div>

            {/* Modal de confirmación de borrado */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                itemType="documento"
            />
        </>
    );
}