import { FileUploadButton } from "@/app/features/documents/components/FileUploadButton";

interface CartaAporteFieldsProps {
    formState: any;
    handleCartaAporteChange: (file: File) => void;
}

export default function CartaAporteFields({ formState, handleCartaAporteChange }: CartaAporteFieldsProps) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Subir Carta Aporte</label>
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