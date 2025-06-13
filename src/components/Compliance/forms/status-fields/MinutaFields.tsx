import { FileUploadButton } from "@/components/Documents/FileUploadButton";
import { IDocumentList } from "@/app/models/IDocuments";
import DocumentPreview from "./DocumentsPreview";

interface MinutaFieldsProps {
    formState: any;
    cartaData?: IDocumentList;
    handleMinutaChange: (file: File) => void;
}

export default function MinutaFields({ formState, cartaData, handleMinutaChange }: MinutaFieldsProps) {
    return (
        <>
            <DocumentPreview cartaData={cartaData} />
            
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Subir Minuta</label>
                <div className="flex items-center">
                    <FileUploadButton onFileChange={handleMinutaChange} />
                    {formState.minutaFile && (
                        <span className="ml-2 text-sm text-gray-600">
                            {formState.minutaFile.name}
                        </span>
                    )}
                </div>
            </div>
        </>
    );
}