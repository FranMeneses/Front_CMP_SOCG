import { FileUploadButton } from "@/components/Documents/FileUploadButton";
import { IComplianceForm } from "@/app/models/ICompliance";
import { FileText } from "lucide-react";

interface ComplianceFormState extends Partial<IComplianceForm> {
    cartaAporteFile: File | null;
}

interface CartaAporteFieldsProps {
    formState: ComplianceFormState;
    handleCartaAporteChange: (file: File) => void;
}

export default function CartaAporteFields({ formState, handleCartaAporteChange }: CartaAporteFieldsProps) {
    return (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Subir Carta Aporte
            </h3>
            <div className="flex items-center">
                <FileUploadButton onFileChange={handleCartaAporteChange} />
                {formState.cartaAporteFile && (
                    <span className="ml-2 text-sm text-gray-600">
                        {formState.cartaAporteFile.name}
                    </span>
                )}
            </div>
        </div>
    );
}