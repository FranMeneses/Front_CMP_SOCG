import DropdownMenu from "@/components/Dropdown";
import { Button } from "@/components/ui/button";
import { FileUploadButton } from "./FileUploadButton";
import { useState } from "react";

interface CommunicationFormProps {
    onSave: any;
    onCancel: () => void;
}

export default function CommunicationForm({ 
    onSave, 
    onCancel, 
}: CommunicationFormProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (file: File) => {
        setSelectedFile(file);
    };

    return (
        <div data-test-id="communication-form">
            <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Seleccione tipo de documento</label>
                    <DropdownMenu
                        buttonText={"Seleccione tipo de documento"}
                        isInModal={true}
                        items={[]} 
                        onSelect={() => {}}
                        selectedValue={""}
                        data-test-id="document-task-dropdown"
                    />
            </div>
            <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Seleccione tarea asociada</label>
                    <DropdownMenu
                        buttonText={"Seleccione tarea"}
                        isInModal={true}
                        items={[]} 
                        onSelect={() => {}}
                        selectedValue={""}
                        data-test-id="document-task-dropdown"
                    />
            </div>
            <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Seleccione subtarea asociada</label>
                    <DropdownMenu
                        buttonText={"Seleccione subtarea"}
                        isInModal={true}
                        items={[]} 
                        onSelect={() => {}}
                        selectedValue={""}
                        data-test-id="document-subtask-dropdown"
                    />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Subir documento</label>
                <div className="flex items-center">
                    <FileUploadButton onFileChange={handleFileChange} />
                    {selectedFile && (
                        <span className="ml-2 text-sm text-gray-600">
                            {selectedFile.name}
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
                    onClick={() => onSave(selectedFile)}
                    disabled={!selectedFile}
                    className="bg-[#0d4384] hover:bg-[#112339] text-white disabled:bg-[#747474c6]"
                    data-test-id="save-button"
                >
                    Guardar
                </Button>
            </div>
        </div>
    );
}

// TODO: ADD FUNCTIONALITY TO UPLOAD FILE