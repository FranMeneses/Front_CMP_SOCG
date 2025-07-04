import { useDocumentsRest } from "@/app/features/documents/hooks/useDocumentsRest";
import { ComplianceFormState } from "@/app/models/ICompliance";
import { IDocumentList } from "@/app/models/IDocuments";
import { Info, FileText, Clipboard } from "lucide-react";

interface ComplianceSummaryProps {
    formState: ComplianceFormState;
    documents: { [key: string]: IDocumentList | undefined };
}

const DOCUMENT_LABELS: { [key: string]: string } = {
    formulario: "Formulario de Donaciones",
    carta: "Carta Aporte",
    minuta: "Minuta",
    autorizacion: "Autorización",
    transferencia: "Transferencia/Orden de Compra",
    comprobante: "Comprobante transferencia/HES/HEM",
};

export default function ComplianceSummary({ 
    formState, 
    documents,
}: ComplianceSummaryProps) {
    const { handleDownload } = useDocumentsRest();
    return (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Compliance Completado
            </h3>
            <p className="text-xs text-green-700 mb-4">
                Todos los documentos y registros han sido procesados correctamente.
            </p>
            <div className="space-y-4">
                {/* Documentos */}
                <div>
                    <h4 className="font-medium text-xs mb-2 flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        Documentos
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                        {Object.entries(documents).map(([key, doc]) => (
                            <li className="flex items-center gap-1" key={key}>
                                <span className="font-medium">{DOCUMENT_LABELS[key] || key}:</span>
                                {doc?.nombre_archivo ? (
                                    <span
                                        onClick={doc.id_documento ? () => handleDownload(doc.id_documento) : undefined}
                                        className="text-blue-600 cursor-pointer hover:underline"
                                    >
                                        {doc.nombre_archivo}
                                    </span>
                                ) : (
                                    <span className="text-gray-400">No disponible</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Memorandum y Solped */}
                {(formState.transferPurchaseOrderFile) && (
                    <div>
                        <h4 className="font-medium text-xs mb-2 flex items-center">
                            <Clipboard className="h-4 w-4 mr-1" />
                            Memorandum y/o SOLPED
                        </h4>
                        <ul className="list-disc pl-5 space-y-1 text-xs">

                        </ul>
                    </div>
                )}
                {/* HEM/HES y Proveedor */}
                <div>
                    <h4 className="font-medium text-xs mb-2 flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        Otros
                    </h4>
                </div>
            </div>
            {/* Datos de MEMO/SOLPED y SAP */}
            <div className="mt-4">
                {(formState.memoAmount || formState.solpedCECO) && (
                    <div className="bg-gray-100 p-3 rounded mb-2">
                        <h4 className="font-medium text-xs mb-2">Datos de Transferencia</h4>
                        {formState.solpedCECO ? (
                            <>
                                <div><span className="font-semibold">Tipo:</span> SOLPED</div>
                                <div><span className="font-semibold">Valor:</span> {formState.memoAmount}</div>
                                <div><span className="font-semibold">CECO:</span> {formState.solpedCECO}</div>
                                <div><span className="font-semibold">Cuenta:</span> {formState.solpedAccount}</div>
                                <div><span className="font-semibold">SOLPED/MEMO SAP:</span> {formState.solpedMemoSap}</div>
                            </>
                        ) : (
                            <>
                                <div><span className="font-semibold">Tipo:</span> MEMO</div>
                                <div><span className="font-semibold">Valor:</span> {formState.memoAmount}</div>
                            </>
                        )}
                    </div>
                )}
                {formState.hesHemSap && (
                    <div className="bg-gray-100 p-3 rounded">
                        <h4 className="font-medium text-xs mb-2">Datos SAP</h4>
                        <div><span className="font-semibold">HES/HEM SAP:</span> {formState.hesHemSap}</div>
                    </div>
                )}
            </div>
        </div>
    );
}