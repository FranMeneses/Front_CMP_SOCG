import DropdownMenu from "@/components/Dropdown";
import { Button } from "@/components/ui/button";
import { FileUploadButton } from "./FileUploadButton";
import { useDocumentForms } from "@/app/features/documents/hooks/useDocumentForms";
import LoadingSpinner from "@/components/LoadingSpinner";

interface CommunicationFormProps {
    onSave: (formData: any) => void;
    onCancel: () => void;
}

export default function CommunicationForm({ 
    onSave, 
    onCancel, 
}: CommunicationFormProps) {
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
            onSave(formData); 
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
        <div className="font-[Helvetica]" data-test-id="communication-form">
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1 required">Seleccione tipo de documento</label>
                <DropdownMenu
                    buttonText={getDocumentTypeText()}
                    isInModal={true}
                    items={dropdownOptions.documentTypes.map((item) => item.label)} 
                    onSelect={(label) => handleDocumentTypeChange(label)}
                    selectedValue={getDocumentTypeText()}
                    data-test-id="document-type-dropdown"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1 required">Seleccione tarea asociada</label>
                <DropdownMenu
                    buttonText={getTaskText()}
                    isInModal={true}
                    items={dropdownOptions.tasks.map((item) => item.label)} 
                    onSelect={(label) => handleTaskChange(label)}
                    selectedValue={getTaskText()}
                    data-test-id="document-task-dropdown"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Subir documento</label>
                <div className="flex items-center">
                    <FileUploadButton onFileChange={handleFileChange} />
                    {formData.file && (
                        <span className="ml-2 text-sm text-gray-600">
                            {formData.file.name}
                        </span>
                    )}
                </div>
            </div>
        
            <div className="flex justify-end space-x-2">
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
                    disabled={!isFormValid}
                    className="bg-[#0068D1] hover:bg-[#0056A3] text-white disabled:bg-[#747474c6]"
                    data-test-id="save-button"
                >
                    Guardar
                </Button>
            </div>
        </div>
    );
}