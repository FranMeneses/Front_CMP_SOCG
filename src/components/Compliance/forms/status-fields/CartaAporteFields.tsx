import { FileUploadButton } from "@/components/Documents/FileUploadButton";
import { ComplianceFormState } from "@/app/models/ICompliance";
import { FileText } from "lucide-react";
import { useState } from "react";
import DocumentsPreview from "./DocumentsPreview";
import { IDocumentList } from "@/app/models/IDocuments";

interface CartaAporteFieldsProps {
    formState: ComplianceFormState;
    handleCartaAporteChange: (file: File) => void;
    documents: { [key: string]: IDocumentList | undefined };
}

export default function CartaAporteFields({ formState, handleCartaAporteChange, documents }: CartaAporteFieldsProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleCartaAporteChangeWithUpload = async (file: File) => {
        setIsUploading(true);
        try {
            await handleCartaAporteChange(file);
        } finally {
            setIsUploading(false);
        }
    };
    return (
        <>
            <DocumentsPreview documents={documents} formState={formState} />
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Subir Carta Aporte
                </h3>
                <div className="flex items-center">
                    <FileUploadButton onFileChange={handleCartaAporteChangeWithUpload} disabled={isUploading} />
                    {formState.cartaAporteFile && (
                        <span className="ml-2 text-sm text-gray-600">
                            {formState.cartaAporteFile.name}
                        </span>
                    )}
                </div>
            </div>
        </>
    );
}