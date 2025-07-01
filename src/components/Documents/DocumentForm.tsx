import DropdownMenu from "@/components/Dropdown";
import { Button } from "@/components/ui/button";
import { FileUploadButton } from "./FileUploadButton";
import { useDocumentForms } from "@/app/features/documents/hooks/useDocumentForms";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FormData as DocumentFormData } from '@/app/features/documents/hooks/useDocumentForms';
import { Clipboard, FileText } from "lucide-react";

interface DocumentFormProps {
    onSave: (formData: DocumentFormData) => void | Promise<void>;
    onCancel: () => void;
}

export default function DocumentForm({ 
    onSave, 
    onCancel, 
}: DocumentFormProps) {
    const {
        formData,
        isFormValid,
        dropdownOptions,
        isLoading,
        handleFileChange,
        handleDocumentTypeChange,
        handleTaskChange,
        getDocumentTypeText,
        getTaskText,
    } = useDocumentForms();

    const handleSubmit = () => {
        if (isFormValid) {
            onSave(formData as DocumentFormData); 
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <LoadingSpinner />
            </div>
        );
    }
    return (
        <div className="p-5 max-w-2xl mx-auto font-[Helvetica]" data-test-id="communication-form">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">
                    Nuevo Documento
                </h2>
            </div>

            <div className="space-y-6">
                {/* Información de Documento */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                        <FileText className="h-4 w-4 mr-2"/>
                        Información del Documento
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 required">Tipo de documento</label>
                            <DropdownMenu
                                buttonText={getDocumentTypeText()}
                                isInModal={true}
                                items={dropdownOptions.documentTypes.map((item) => item.label)} 
                                onSelect={(label) => handleDocumentTypeChange(label)}
                                selectedValue={getDocumentTypeText()}
                                data-test-id="document-type-dropdown"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 required">Tarea asociada</label>
                            <DropdownMenu
                                buttonText={getTaskText()}
                                isInModal={true}
                                items={dropdownOptions.tasks.map((item) => item.label)} 
                                onSelect={(label) => handleTaskChange(label)}
                                selectedValue={getTaskText()}
                                data-test-id="document-task-dropdown"
                            />
                        </div>
                    </div>
                </div>

                {/* Subir Archivo */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                        <Clipboard className="h-4 w-4 mr-2"/>
                        Subir Archivo
                    </h3>
                    <div className="flex items-center">
                        <FileUploadButton onFileChange={handleFileChange} />
                        {formData.file && (
                            <span className="ml-2 text-sm text-gray-600">
                                {formData.file.name}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-6 space-x-2">
                <Button
                    variant="secondary"
                    onClick={onCancel}
                    className="bg-gray-200 hover:bg-gray-300 cursor-pointer"
                    data-test-id="cancel-button"
                >
                    Cancelar
                </Button>
                <Button
                    variant="default"
                    onClick={handleSubmit}
                    disabled={!isFormValid || isLoading}
                    className="bg-[#0068D1] hover:bg-[#0056A3] text-white disabled:bg-[#747474c6]"
                    data-test-id="save-button"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <LoadingSpinner />
                            Guardando...
                        </span>
                    ) : 'Guardar'}
                </Button>
            </div>
        </div>
    );
}