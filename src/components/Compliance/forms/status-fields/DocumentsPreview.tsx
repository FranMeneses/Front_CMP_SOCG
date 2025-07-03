import { useDocumentsRest } from "@/app/features/documents/hooks/useDocumentsRest";
import { ComplianceFormState } from "@/app/models/ICompliance";
import { IDocumentList } from "@/app/models/IDocuments";
import { FileText, Clipboard } from "lucide-react";

interface DocumentPreviewProps {
    cartaData?: IDocumentList;
    minutaData?: IDocumentList;
    formState?: ComplianceFormState;
    compact?: boolean; 
}

export default function DocumentPreview({
    cartaData,
    minutaData,
    formState,
    compact = false,
}: DocumentPreviewProps) {

    const { handleDownload } = useDocumentsRest();
    
    return (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                {compact ? "Documentos previos" : "Documentos registrados"}
            </h3>
            <div className="space-y-2">
                {/* Formulario de Donaciones */}
                {formState?.donationFormFile && (
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">Formulario de Donaciones:</span>
                        <span
                            className={`text-xs text-blue-600 cursor-not-allowed opacity-50`}
                        >
                            {formState.donationFormFile.name}
                        </span>
                    </div>
                )}
                {/* Autorización */}
                {formState?.authorizationFile && (
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">Autorización:</span>
                        <span
                            className={`text-xs text-blue-600 cursor-not-allowed opacity-50`}
                        >
                            {formState.authorizationFile.name}
                        </span>
                    </div>
                )}
                {/* Transferencia/Orden de Compra */}
                {formState?.transferPurchaseOrderFile && (
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">Transferencia/Orden de Compra:</span>
                        <span
                            className={`text-xs text-blue-600 cursor-not-allowed opacity-50`}
                        >
                            {formState.transferPurchaseOrderFile.name}
                        </span>
                    </div>
                )}
                {/* Memo/Solped archivo */}
                {formState?.memoSolpedFile && formState?.memoSolpedType && (
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">{formState.memoSolpedType} (archivo):</span>
                        <span
                            className={`text-xs text-blue-600 cursor-not-allowed opacity-50`}
                        >
                            {formState.memoSolpedFile.name}
                        </span>
                    </div>
                )}
                {/* Memo/Solped datos */}
                {formState?.memoSolpedType && (
                    <div className="mt-2 border-t pt-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium flex items-center">
                                <Clipboard className="h-3 w-3 mr-1" />
                                {formState.memoSolpedType}:
                            </span>
                            <span className="text-xs text-green-600">Registrado</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 mt-1">
                            <span className="text-xs text-gray-600">Valor:</span>
                            <span className="text-xs">${formState.memoAmount?.toLocaleString() || "-"}</span>
                            <span className="text-xs text-gray-600">SOLPED/MEMO SAP:</span>
                            <span className="text-xs">{formState.solpedMemoSap || "-"}</span>
                            {formState.memoSolpedType === "SOLPED" && (
                                <>
                                    <span className="text-xs text-gray-600">CECO:</span>
                                    <span className="text-xs">{formState.solpedCECO || "-"}</span>
                                    <span className="text-xs text-gray-600">Cuenta:</span>
                                    <span className="text-xs">{formState.solpedAccount || "-"}</span>
                                </>
                            )}
                        </div>
                    </div>
                )}
                {/* Carta Aporte */}
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
            </div>
        </div>
    );
}