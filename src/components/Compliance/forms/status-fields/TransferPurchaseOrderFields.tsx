import { FileUploadButton } from "@/components/Documents/FileUploadButton";
import { FileText } from "lucide-react";

interface TransferPurchaseOrderFieldsProps {
    formState: { transferPurchaseOrderFile: File | null };
    handleTransferPurchaseOrderChange: (file: File) => void;
}

export default function TransferPurchaseOrderFields({ formState, handleTransferPurchaseOrderChange }: TransferPurchaseOrderFieldsProps) {
    return (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Subir Transferencia/Orden de Compra
            </h3>
            <div className="flex items-center">
                <FileUploadButton onFileChange={handleTransferPurchaseOrderChange} disabled={false} />
                {formState.transferPurchaseOrderFile && (
                    <span className="ml-2 text-sm text-gray-600">
                        {formState.transferPurchaseOrderFile.name}
                    </span>
                )}
            </div>
        </div>
    );
} 