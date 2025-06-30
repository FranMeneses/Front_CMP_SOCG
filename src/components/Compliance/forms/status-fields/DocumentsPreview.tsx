import { useDocumentsRest } from "@/app/features/documents/hooks/useDocumentsRest";
import { IComplianceSolped, IComplianceMemo, ComplianceFormState } from "@/app/models/ICompliance";
import { IDocumentList } from "@/app/models/IDocuments";
import { FileText, Clipboard } from "lucide-react";

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
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                {compact ? "Documentos previos" : "Documentos registrados"}
            </h3>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Carta Aporte:</span>
                    <span
                        onClick={cartaData?.id_documento ? () => handleDownload(cartaData.id_documento) : undefined}
                        className={`text-xs text-blue-600${!cartaData?.id_documento ? ' cursor-not-allowed opacity-50' : ' cursor-pointer hover:underline'}`}
                    >
                        {cartaData?.nombre_archivo || <span className="text-gray-400">No disponible</span>}
                    </span>
                </div>
                {minutaData && (
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">Minuta:</span>
                        <span
                            onClick={() => handleDownload(minutaData.id_documento)}
                            className="text-xs text-blue-600 cursor-pointer hover:underline"
                        >
                            {minutaData?.nombre_archivo}
                        </span>
                    </div>
                )}

                {solpedData && (
                    <div className="mt-2 border-t pt-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium flex items-center">
                                <Clipboard className="h-3 w-3 mr-1" />
                                SOLPED:
                            </span>
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
                            <span className="text-xs font-medium flex items-center">
                                <Clipboard className="h-3 w-3 mr-1" />
                                MEMORANDUM:
                            </span>
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