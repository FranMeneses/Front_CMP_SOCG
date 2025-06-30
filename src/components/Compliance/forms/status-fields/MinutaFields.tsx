import { FileUploadButton } from "@/components/Documents/FileUploadButton";
import { IDocumentList } from "@/app/models/IDocuments";
import { ComplianceFormState } from "@/app/models/ICompliance";
import DocumentPreview from "./DocumentsPreview";
import { FileText } from "lucide-react";

interface MinutaFieldsProps {
    formState: ComplianceFormState;
    cartaData?: IDocumentList;
    handleMinutaChange: (file: File) => void;
}

export default function MinutaFields({ formState, cartaData, handleMinutaChange }: MinutaFieldsProps) {
    return (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Minuta
            </h3>
            <DocumentPreview cartaData={cartaData} formState={formState} />
            <div className="mb-2">
                <label className="block text-xs font-medium mb-1">Subir Minuta</label>
                <div className="flex items-center">
                    <FileUploadButton onFileChange={handleMinutaChange} />
                    {formState.minutaFile && (
                        <span className="ml-2 text-sm text-gray-600">
                            {formState.minutaFile.name}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}