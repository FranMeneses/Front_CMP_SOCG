import DropdownMenu from "@/components/Dropdown";
import { Button } from "@/components/ui/button";
import { FileUploadButton } from "./FileUploadButton";
import { useDocumentForms } from "../hooks/useDocumentForms";
import LoadingSpinner from "@/components/LoadinSpinner";

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
        handleSubtaskChange,
        getDocumentTypeText,
        getTaskText,
        getSubtaskText,
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
        <div data-test-id="communication-form">
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Seleccione tipo de documento</label>
                <DropdownMenu
                    buttonText={getDocumentTypeText()}
                    isInModal={true}
                    items={dropdownOptions.documentTypes.map(item => item.label)} 
                    onSelect={(label) => handleDocumentTypeChange(label)}
                    selectedValue={getDocumentTypeText()}
                    data-test-id="document-type-dropdown"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Seleccione tarea asociada</label>
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
                <label className="block text-sm font-medium mb-1">Seleccione subtarea asociada</label>
                <DropdownMenu
                    buttonText={getSubtaskText()}
                    isInModal={true}
                    items={dropdownOptions.subtasks.map((item) => item.label)} 
                    onSelect={(label) => handleSubtaskChange(label)}
                    selectedValue={getSubtaskText()}
                    data-test-id="document-subtask-dropdown"
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
                    className="bg-[#0d4384] hover:bg-[#112339] text-white disabled:bg-[#747474c6]"
                    data-test-id="save-button"
                >
                    Guardar
                </Button>
            </div>
        </div>
    );
}