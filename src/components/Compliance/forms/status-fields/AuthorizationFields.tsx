import { FileUploadButton } from "@/components/Documents/FileUploadButton";
import { FileText } from "lucide-react";

interface AuthorizationFieldsProps {
    formState: { authorizationFile: File | null };
    handleAuthorizationChange: (file: File) => void;
}

export default function AuthorizationFields({ formState, handleAuthorizationChange }: AuthorizationFieldsProps) {
    return (
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
    );
} 