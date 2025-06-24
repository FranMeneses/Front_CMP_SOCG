import { Button } from "@/components/ui/button";
import { IHistory } from "@/app/models/IHistory";
import { useDocumentsRest } from "@/app/features/documents/hooks/useDocumentsRest";
import { Clipboard, FileText, Info, User2Icon } from "lucide-react";

interface HistoryFormProps {
    historyData?: IHistory;
    onClose: () => void;
}

export default function HistoryForm({ historyData, onClose }: HistoryFormProps) {
    const { handleDownload } = useDocumentsRest();
    
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

    return (
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
                                    <button 
                                        onClick={() => handleDownload(doc.id)}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        Descargar
                                    </button>
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
    );
}