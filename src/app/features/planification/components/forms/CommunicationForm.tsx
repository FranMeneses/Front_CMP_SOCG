import { useHooks } from "@/app/features/hooks/useHooks";
import DropdownMenu from "@/components/Dropdown";
import { Button } from "@/components/ui/button";
import { useCommunicationTaskForm } from "../../hooks/useCommunicationTaskForm";
import { ITask } from "@/app/models/ITasks";
import { IProcess } from "@/app/models/IProcess";

interface CommunicationFormProps {
    onSave: any;
    onCancel: () => void;
    isEditing?: boolean;
    selectedTask?: ITask;
    userRole?: string;
}

export default function CommunicationForm({ 
    onSave, 
    onCancel, 
    isEditing = false, 
    selectedTask,
    userRole
}: CommunicationFormProps) {

    const { formState, dropdownItems, processes, handleSave, handleInputChange } = useCommunicationTaskForm(
        onSave, 
        isEditing, 
        selectedTask,
        userRole
    );

    const { valleys } = useHooks();

    const saveButtonText = isEditing ? "Actualizar" : "Guardar";

    return (
        <div data-test-id="communication-form">
            <h2 className="text-lg font-semibold mb-4">
                {isEditing ? "Editar Tarea" : "Nueva Tarea"}
            </h2>
            
            <div className="mb-4 truncate">
                <label className="block text-sm font-medium mb-1">Titulo</label>
                <input
                    type="text"
                    value={formState.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    data-test-id="communication-title-input"
                />
            </div>
            <div className="mb-4 truncate">
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <input
                    type="text"
                    value={formState.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    data-test-id="communication-description-input"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Valle</label>
                <DropdownMenu
                    buttonText={"Seleccione el valle asociado"}
                    isInModal={true}
                    items={valleys.map(valley => valley.name)} 
                    onSelect={(value) => handleInputChange('valleyId', value)}
                    selectedValue={valleys.find(valley => valley.id === selectedTask?.valleyId)?.name }
                    data-test-id="communication-faena-dropdown"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Proceso</label>
                <DropdownMenu
                    buttonText={"Seleccione el proceso asociado"}
                    isInModal={true}
                    items={dropdownItems.processes} 
                    onSelect={(value) => handleInputChange('processId', value)}
                    selectedValue={isEditing && selectedTask ? formState.processId : ""}
                    data-test-id="communication-faena-dropdown"
                />
            </div>  
            {isEditing && (
                <>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Estado</label>
                        <DropdownMenu
                            buttonText={"Seleccione Estado"}
                            isInModal={true}
                            items={dropdownItems.statuses} 
                            onSelect={(value) => handleInputChange('statusId', value)}
                            selectedValue={dropdownItems.statuses[selectedTask?.statusId ? selectedTask.statusId - 1 : 0]}
                            data-test-id="communication-faena-dropdown"
                        />
                    </div>  
                    <div className="mb-4 truncate">
                        <label className="block text-sm font-medium mb-1">Presupuesto (USD)</label>
                        <input
                            type="number"
                            value={formState.budget}
                            disabled={true}
                            className="w-full border rounded px-3 py-2"
                            data-test-id="communication-budget-input"
                        />
                    </div>
                    <div className="mb-4 truncate">
                        <label className="block text-sm font-medium mb-1">Gastos (USD)</label>
                        <input
                            type="number"
                            value={formState.expense}
                            disabled={true}
                            className="w-full border rounded px-3 py-2"
                            data-test-id="communication-expense-input"
                        />
                    </div>
                </>  
            )
            }
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
                    onClick={() => handleSave()}
                    disabled={!formState.name || !formState.description}
                    className="bg-[#0d4384] hover:bg-[#112339] text-white disabled:bg-[#747474c6]"
                    data-test-id="save-button"
                >
                    {saveButtonText}
                </Button>
            </div>
        </div>
    );
}