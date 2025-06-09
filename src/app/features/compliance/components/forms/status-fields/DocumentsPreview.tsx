import { IDocumentList } from "@/app/models/IDocuments";

interface DocumentPreviewProps {
    cartaData?: IDocumentList;
    minutaData?: IDocumentList;
    formState?: any;
    compact?: boolean;
}

export default function DocumentPreview({
    cartaData,
    minutaData,
    formState,
    compact = false
}: DocumentPreviewProps) {
    return (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium mb-2">
                {compact ? "Documentos previos" : "Documentos registrados"}
            </h3>
            <div className={`${compact ? "text-xs" : "mb-2"}`}>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Carta Aporte:</span>
                    <span className="text-xs text-blue-600">{cartaData?.nombre_archivo}</span>
                </div>
                {minutaData && (
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-medium">Minuta:</span>
                        <span className="text-xs text-blue-600">{minutaData?.nombre_archivo}</span>
                    </div>
                )}
                {compact && formState && (
                    <>
                        {formState.hasMemo && <p className="mt-1">• MEMORANDUM registrado</p>}
                        {formState.hasSolped && <p className="mt-1">• SOLPED registrada</p>}
                    </>
                )}
            </div>
        </div>
    );
}