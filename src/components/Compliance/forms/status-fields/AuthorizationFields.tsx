import { FileUploadButton } from "@/components/Documents/FileUploadButton";
import { FileText } from "lucide-react";
import DocumentsPreview from "./DocumentsPreview";
import { ComplianceFormState } from "@/app/models/ICompliance";
import { IDocumentList } from "@/app/models/IDocuments";

interface AuthorizationFieldsProps {
    formState: ComplianceFormState;
    handleAuthorizationChange: (file: File) => void;
    documents: { [key: string]: IDocumentList | undefined };
}

export default function AuthorizationFields({ formState, handleAuthorizationChange, documents }: AuthorizationFieldsProps) {
    return (
        <>
            <DocumentsPreview documents={documents} formState={formState} />
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Subir Autorización
                </h3>
                <div className="flex items-center">
                    <FileUploadButton onFileChange={handleAuthorizationChange} disabled={false} />
                    {formState.authorizationFile && (
                        <span className="ml-2 text-sm text-gray-600">
                            {formState.authorizationFile.name}
                        </span>
                    )}
                </div>
            </div>
        </>
    );
} 