import { IDocumentList } from "@/app/models/IDocuments";

interface ComplianceSummaryProps {
    formState: any;
    cartaData?: IDocumentList;
    minutaData?: IDocumentList;
}

export default function ComplianceSummary({ 
    formState, 
    cartaData, 
    minutaData 
}: ComplianceSummaryProps) {
    return (
        <div className="mb-4 p-3 bg-green-50 rounded-md border border-green-200">
            <h3 className="text-sm font-medium mb-2 text-green-700">Compliance Completado</h3>
            <p className="text-xs text-green-600">Todos los documentos y registros han sido procesados correctamente.</p>
            
            <div className="mt-3 text-xs">
                <h4 className="font-medium mb-1">Resumen:</h4>
                <ul className="list-disc pl-5 space-y-1">
                    <li className="flex items-center gap-1">
                        <span className="font-medium">Carta Aporte:</span>
                        <span className="text-blue-600">{cartaData?.nombre_archivo}</span>
                    </li>
                    <li className="flex items-center gap-1">
                        <span className="font-medium">Minuta:</span>
                        <span className="text-blue-600">{minutaData?.nombre_archivo}</span>
                    </li>
                    {formState.hasMemo && <li>MEMORANDUM registrado</li>}
                    {formState.hasSolped && <li>SOLPED registrada</li>}
                    {formState.hasHem && <li>HEM registrada</li>}
                    {formState.hasHes && <li>HES registrada</li>}
                    {formState.provider && <li>Proveedor: {formState.provider}</li>}
                </ul>
            </div>
        </div>
    );
}