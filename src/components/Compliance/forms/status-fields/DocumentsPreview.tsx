import { useDocumentsRest } from "@/app/features/documents/hooks/useDocumentsRest";
import { IComplianceSolped, IComplianceMemo, ComplianceFormState } from "@/app/models/ICompliance";
import { IDocumentList } from "@/app/models/IDocuments";

interface DocumentPreviewProps {
    cartaData?: IDocumentList;
    minutaData?: IDocumentList;
    formState?: ComplianceFormState;
    compact?: boolean;
    solpedData?: IComplianceSolped;  
    memoData?: IComplianceMemo;      
}

export default function DocumentPreview({
    cartaData,
    minutaData,
    formState,
    compact = false,
    solpedData,
    memoData
}: DocumentPreviewProps) {

    const { handleDownload } = useDocumentsRest();
    
    return (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium mb-2">
                {compact ? "Documentos previos" : "Documentos registrados"}
            </h3>
            <div className={`${compact ? "text-xs" : "mb-2"}`}>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Carta Aporte:</span>
                    <span
                        onClick={cartaData?.id_documento ? () => handleDownload(cartaData.id_documento) : undefined}
                        className={`text-xs text-blue-600${!cartaData?.id_documento ? ' cursor-not-allowed opacity-50' : ''}`}
                    >
                        {cartaData?.nombre_archivo}
                    </span>
                </div>
                {minutaData && (
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-medium">Minuta:</span>
                        <span onClick={() => handleDownload(minutaData.id_documento)} className="text-xs text-blue-600">{minutaData?.nombre_archivo}</span>
                    </div>
                )}
                
                {solpedData && (
                    <div className="mt-2 border-t pt-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">SOLPED:</span>
                            <span className="text-xs text-green-600">Registrado</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 mt-1">
                            <span className="text-xs text-gray-600">CECO:</span>
                            <span className="text-xs">{solpedData.ceco}</span>
                            <span className="text-xs text-gray-600">Cuenta:</span>
                            <span className="text-xs">{solpedData.account}</span>
                            <span className="text-xs text-gray-600">Valor:</span>
                            <span className="text-xs">${solpedData.value.toLocaleString()}</span>
                        </div>
                    </div>
                )}
                
                {memoData && (
                    <div className="mt-2 border-t pt-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">MEMORANDUM:</span>
                            <span className="text-xs text-green-600">Registrado</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 mt-1">
                            <span className="text-xs text-gray-600">Valor:</span>
                            <span className="text-xs">${memoData.value.toLocaleString()}</span>
                        </div>
                    </div>
                )}
                
                {compact && formState && !solpedData && !memoData && (
                    <>
                        {formState.hasMemo && <p className="mt-1 text-xs text-gray-600">• MEMORANDUM registrado</p>}
                        {formState.hasSolped && <p className="mt-1 text-xs text-gray-600">• SOLPED registrada</p>}
                    </>
                )}
            </div>
        </div>
    );
}