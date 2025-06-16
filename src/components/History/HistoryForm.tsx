import { Button } from "@/components/ui/button";
import { IHistory } from "@/app/models/IHistory";

interface HistoryFormProps {
    historyData?: IHistory;
    onClose: () => void;
}

export default function HistoryForm({ historyData, onClose }: HistoryFormProps) {
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'No definida';
        return new Date(dateString).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className='font-[Helvetica]' data-test-id="history-form">
            <h2 className="text-lg font-semibold mb-4">
                Detalle del Histórico
            </h2>
            
            <div className="form-field">
                <label className="form-label">Nombre</label>
                <div className="form-display-field">
                    {historyData?.name || 'No disponible'}
                </div>
            </div>
            
            <div className="form-field">
                <label className="form-label">Proceso</label>
                <div className="form-display-field">
                    {historyData?.process?.name || 'No disponible'}
                </div>
            </div>
            
            <div className="form-field">
                <label className="form-label">Fecha de Término</label>
                <div className="form-display-field">
                    {historyData?.finalDate ? formatDate(historyData.finalDate) : 'No definida'}
                </div>
            </div>
            
            <div className="form-field">
                <label className="form-label">Gastos Totales</label>
                <div className="form-display-field">
                    {historyData?.totalExpense ? formatCurrency(historyData.totalExpense) : '$0 USD'}
                </div>
            </div>
            
            <div className="form-field">
                <label className="form-label">SOLPED / MEMO</label>
                <div className="form-display-field">
                    {historyData?.solpedMemoSap || 'No disponible'}
                </div>
            </div>
            
            <div className="form-field">
                <label className="form-label">HES / HEM</label>
                <div className="form-display-field">
                    {historyData?.hesHemSap || 'No disponible'}
                </div>
            </div>
            
            <div className="form-field">
                <label className="form-label">Documentos Asociados</label>
                <div className="form-display-field">
                    {historyData?.documents && historyData.documents.length > 0 ? (
                        <div className="space-y-2">
                            {historyData.documents.map((doc, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                                        📄 {doc.fileName}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        'No hay documentos asociados'
                    )}
                </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
                <Button
                    variant="secondary"
                    onClick={onClose}
                    className="bg-gray-200 hover:bg-gray-300 cursor-pointer"
                    data-test-id="close-button"
                >
                    Cerrar
                </Button>
            </div>
        </div>
    );
}