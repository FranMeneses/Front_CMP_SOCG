import { useDocumentsRest } from "@/app/features/documents/hooks/useDocumentsRest";
import { ComplianceFormState, IComplianceSolped, IComplianceMemo } from "@/app/models/ICompliance";
import { IDocumentList } from "@/app/models/IDocuments";
import { Info, FileText, Clipboard } from "lucide-react";

interface ComplianceSummaryProps {
    formState: ComplianceFormState;
    cartaData?: IDocumentList;
    minutaData?: IDocumentList;
    solpedData?: IComplianceSolped;
    memoData?: IComplianceMemo;
}

export default function ComplianceSummary({ 
    formState, 
    cartaData, 
    minutaData,
    solpedData,
    memoData
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
                        <li className="flex items-center gap-1">
                            <span className="font-medium">Carta Aporte:</span>
                            {cartaData?.nombre_archivo ? (
                                <span
                                    onClick={cartaData.id_documento ? () => handleDownload(cartaData.id_documento) : undefined}
                                    className="text-blue-600 cursor-pointer hover:underline"
                                >
                                    {cartaData.nombre_archivo}
                                </span>
                            ) : (
                                <span className="text-gray-400">No disponible</span>
                            )}
                        </li>
                        <li className="flex items-center gap-1">
                            <span className="font-medium">Minuta:</span>
                            {minutaData?.nombre_archivo ? (
                                <span
                                    onClick={minutaData.id_documento ? () => handleDownload(minutaData.id_documento) : undefined}
                                    className="text-blue-600 cursor-pointer hover:underline"
                                >
                                    {minutaData.nombre_archivo}
                                </span>
                            ) : (
                                <span className="text-gray-400">No disponible</span>
                            )}
                        </li>
                    </ul>
                </div>
                {/* Memorandum y Solped */}
                {(formState.hasMemo || formState.hasSolped) && (
                    <div>
                        <h4 className="font-medium text-xs mb-2 flex items-center">
                            <Clipboard className="h-4 w-4 mr-1" />
                            Memorandum y/o SOLPED
                        </h4>
                        <ul className="list-disc pl-5 space-y-1 text-xs">
                            {formState.hasMemo && (
                                <li>
                                    <span className="font-medium">MEMORANDUM registrado</span>
                                    {memoData && (
                                        <span className="ml-2 text-gray-600">
                                            Valor: ${memoData.value.toLocaleString()}
                                        </span>
                                    )}
                                </li>
                            )}
                            {formState.hasSolped && (
                                <li>
                                    <span className="font-medium">SOLPED registrada</span>
                                    {solpedData && (
                                        <span className="ml-2 text-gray-600">
                                            CECO: {solpedData.ceco} | Cuenta: {solpedData.account} | Valor: ${solpedData.value.toLocaleString()}
                                        </span>
                                    )}
                                </li>
                            )}
                        </ul>
                    </div>
                )}
                {/* HEM/HES y Proveedor */}
                <div>
                    <h4 className="font-medium text-xs mb-2 flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        Otros
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                        {formState.hasHem && <li><span className="font-medium">HEM registrada</span></li>}
                        {formState.hasHes && <li><span className="font-medium">HES registrada</span></li>}
                        {formState.provider && (
                            <li className="flex items-center gap-1">
                                <span className="font-medium">Proveedor:</span>
                                <span>{formState.provider}</span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}