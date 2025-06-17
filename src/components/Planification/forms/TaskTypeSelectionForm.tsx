import { Button } from "@/components/ui/button";
import DropdownMenu from "@/components/Dropdown";
import { useState } from "react";

interface TaskTypeSelectionFormProps {
    onSelectType: (type: 'communication' | 'relationship') => void;
    onCancel: () => void;
}

export default function TaskTypeSelectionForm({ onSelectType, onCancel }: TaskTypeSelectionFormProps) {
    const [selectedType, setSelectedType] = useState<string>("");
    
    const taskTypes = ["Comunicaciones", "Relacionamiento"];
    
    const handleContinue = () => {
        if (selectedType === "Comunicaciones") {
            onSelectType('communication');
        } else if (selectedType === "Relacionamiento") {
            onSelectType('relationship');
        }
    };
    
    return (
        <div className='font-[Helvetica]' data-test-id="task-type-selection-form">
            <h2 className="text-lg font-semibold mb-4">Seleccionar Tipo de Tarea</h2>
            
            <div className="form-field mb-6">
                <label className="form-label required">Tipo de Tarea</label>
                <DropdownMenu
                    buttonText="Seleccione el tipo de tarea"
                    isInModal={true}
                    items={taskTypes}
                    onSelect={(value) => setSelectedType(value)}
                    selectedValue={selectedType}
                    data-test-id="task-type-dropdown"
                />
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
                    onClick={handleContinue}
                    disabled={!selectedType}
                    className="bg-[#0068D1] hover:bg-[#0056A3] text-white disabled:bg-[#747474c6]"
                    data-test-id="continue-button"
                >
                    Continuar
                </Button>
            </div>
        </div>
    );
}