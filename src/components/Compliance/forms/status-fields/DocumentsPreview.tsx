import { useDocumentsRest } from "@/app/features/documents/hooks/useDocumentsRest";
import { ComplianceFormState } from "@/app/models/ICompliance";
import { IDocumentList } from "@/app/models/IDocuments";
import { FileText } from "lucide-react";

interface DocumentsPreviewProps {
    documents: { [key: string]: IDocumentList | undefined };
    formState?: ComplianceFormState;
    compact?: boolean;
}

export default function DocumentsPreview({
    documents,
    formState,
    compact = false,
}: DocumentsPreviewProps) {
    const { handleDownload } = useDocumentsRest();
    // Mapeo de nombres amigables
    const labelMap: { [key: string]: string } = {
        formulario: "Formulario de Donaciones",
        carta: "Carta Aporte",
        minuta: "Minuta",
        autorizacion: "Autorización",
        transferencia: "Transferencia/Orden de Compra",
        memo: "MEMO",
        solped: "SOLPED",
    };
    return (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                {compact ? "Documentos previos" : "Documentos registrados"}
            </h3>
            <div className="space-y-2">
                {/* Documentos subidos al backend */}
                {Object.entries(documents).map(([key, doc]) => (
                    <div className="flex items-center justify-between" key={key}>
                        <span className="text-xs font-medium">{labelMap[key] || key}:</span>
                        {doc && doc.id_documento ? (
                            <span
                                onClick={() => handleDownload(doc.id_documento)}
                                className="text-xs text-blue-600 cursor-pointer hover:underline"
                            >
                                {doc.nombre_archivo}
                            </span>
                        ) : (
                            <span className="text-xs text-gray-400">No disponible</span>
                        )}
                    </div>
                ))}
                {/* Archivos locales seleccionados pero no subidos */}
                {formState?.donationFormFile && (
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">Formulario de Donaciones (nuevo):</span>
                        <span className="text-xs text-blue-600 opacity-50 cursor-not-allowed">
                            {formState.donationFormFile.name}
                        </span>
                    </div>
                )}
                {formState?.cartaAporteFile && (
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">Carta Aporte (nuevo):</span>
                        <span className="text-xs text-blue-600 opacity-50 cursor-not-allowed">
                            {formState.cartaAporteFile.name}
                        </span>
                    </div>
                )}
                {formState?.minutaFile && (
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">Minuta (nuevo):</span>
                        <span className="text-xs text-blue-600 opacity-50 cursor-not-allowed">
                            {formState.minutaFile.name}
                        </span>
                    </div>
                )}
                {formState?.authorizationFile && (
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">Autorización (nuevo):</span>
                        <span className="text-xs text-blue-600 opacity-50 cursor-not-allowed">
                            {formState.authorizationFile.name}
                        </span>
                    </div>
                )}
                {formState?.transferPurchaseOrderFile && (
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">Transferencia/Orden de Compra (nuevo):</span>
                        <span className="text-xs text-blue-600 opacity-50 cursor-not-allowed">
                            {formState.transferPurchaseOrderFile.name}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}