import { useDocumentsRest } from "@/app/features/documents/hooks/useDocumentsRest";
import { ComplianceFormState, IComplianceSolped, IComplianceMemo } from "@/app/models/ICompliance";
import { IDocumentList } from "@/app/models/IDocuments";

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
        <div className="mb-4 p-3 bg-green-50 rounded-md border border-green-200">
            <h3 className="text-sm font-medium mb-2 text-green-700">Compliance Completado</h3>
            <p className="text-xs text-green-600">Todos los documentos y registros han sido procesados correctamente.</p>
            
            <div className="mt-3 text-xs">
                <h4 className="font-medium mb-1">Resumen:</h4>
                <ul className="list-disc pl-5 space-y-1">
                    <li className="flex items-center gap-1">
                        <span className="font-medium">Carta Aporte:</span>
                        <span 
                        onClick={cartaData?.id_documento ? () => handleDownload(cartaData.id_documento) : undefined}
                        className="text-blue-600 cursor-pointer">{cartaData?.nombre_archivo}</span>
                    </li>
                    <li className="flex items-center gap-1">
                        <span className="font-medium">Minuta:</span>
                        <span
                            onClick={minutaData?.id_documento ? () => handleDownload(minutaData.id_documento) : undefined}
                            className="text-blue-600 cursor-pointer">{minutaData?.nombre_archivo}
                        </span>
                    </li>
                    
                    {formState.hasMemo && (
                        <li>
                            <div className="font-medium">MEMORANDUM registrado</div>
                            {memoData && (
                                <div className="ml-2 text-gray-600">
                                    Valor: ${memoData.value.toLocaleString()}
                                </div>
                            )}
                        </li>
                    )}
                    
                    {formState.hasSolped && (
                        <li>
                            <div className="font-medium">SOLPED registrada</div>
                            {solpedData && (
                                <div className="ml-2 grid grid-cols-1 gap-1 text-gray-600">
                                    <span>CECO: {solpedData.ceco}</span>
                                    <span>Cuenta: {solpedData.account}</span>
                                    <span>Valor: ${solpedData.value.toLocaleString()}</span>
                                </div>
                            )}
                        </li>
                    )}
                    
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
    );
}