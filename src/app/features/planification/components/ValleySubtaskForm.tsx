import { Button } from "@/components/ui/button";
import { useValleySubtasksForm } from "../hooks/useValleySubtasksForm";
import DropdownMenu from "@/components/Dropdown";

interface ValleySubtaskFormProps {
    onSave: any; // TODO: Define the type for the task object
    onCancel: () => void;
    isEditing?: boolean;
    valley: string;
    subtask?: any; // TODO: Define the type for the subtask object
}

export default function ValleySubtaskForm({ onSave, onCancel, isEditing, valley, subtask }: ValleySubtaskFormProps) {
    const {
        subtaskFormState,
        dropdownItems,
        handleSubtaskInputChange,
        handleSaveSubtask,
    } = useValleySubtasksForm(onSave, subtask);

    return (
        <div data-test-id="subtask-form">
            <div className="mb-4 truncate">
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                    type="text"
                    value={subtaskFormState.name}
                    onChange={(e) => handleSubtaskInputChange("name", e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    data-test-id="subtask-title-input"
                />
            </div>
            <div className="mb-4 truncate">
                <label className="block text-sm font-medium mb-1">Número</label>
                <input
                    type="number"
                    value={subtaskFormState.number}
                    onChange={(e) => handleSubtaskInputChange("number", e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    data-test-id="subtask-number-input"
                />
            </div>
            <div className="mb-4 truncate">
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <input
                    type="text"
                    value={subtaskFormState.description}
                    onChange={(e) => handleSubtaskInputChange("description", e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    data-test-id="subtask-description-input"
                />
            </div>
            <div className="mb-4 truncate">
                <label className="block text-sm font-medium mb-1">Presupuesto</label>
                <input
                    type="number"
                    value={subtaskFormState.budget}
                    onChange={(e) => handleSubtaskInputChange("budget", e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    data-test-id="subtask-budget-input"
                />
            </div>
            <div className="mb-4">                                                                 
                <label className="block text-sm font-medium mb-1">Beneficiario</label>
                <DropdownMenu 
                    buttonText="Seleccione Beneficiario"
                    items={dropdownItems.beneficiaries}
                    onSelect={(value) => handleSubtaskInputChange("beneficiary", value)}
                    isInModal={true}
                    selectedValue={subtaskFormState.beneficiary}
                    data-test-id="subtask-beneficiary-dropdown"
                />
            </div>
            <div className="mb-4 truncate">
                <label className="block text-sm font-medium mb-1">Fecha de Inicio</label>
                <input
                    type="date"
                    value={subtaskFormState.startDate}
                    onChange={(e) => handleSubtaskInputChange("startDate", e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    data-test-id="subtask-start-date-input"
                />
            </div>
            <div className="mb-4 truncate">
                <label className="block text-sm font-medium mb-1">Fecha de Término</label>
                <input
                    type="date"
                    value={subtaskFormState.endDate}
                    onChange={(e) => handleSubtaskInputChange("endDate", e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    data-test-id="subtask-end-date-input"
                />
            </div>
            {isEditing && (
            <>
            <div className="mb-4 truncate">
                <label className="block text-sm font-medium mb-1">Fecha de Finalización</label>
                <input
                    type="date"
                    value={subtaskFormState.finishDate}
                    onChange={(e) => handleSubtaskInputChange("finishDate", e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    data-test-id="subtask-finish-date-input"
                />
            </div>
            <div className="mb-4 truncate">
                <label className="block text-sm font-medium mb-1">Gastos</label>
                <input
                    type="number"
                    value={subtaskFormState.expenses}
                    onChange={(e) => handleSubtaskInputChange("expenses", e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    data-test-id="subtask-expense-input"
                />
            </div>
            <div className="mb-4">                                                 
                <label className="block text-sm font-medium mb-1">Estado</label>
                <DropdownMenu
                    buttonText="Seleccione Estado"
                    items={dropdownItems.subtaskState}
                    onSelect={(value) => {handleSubtaskInputChange("state", value)}}
                    isInModal={true}
                    selectedValue={dropdownItems.subtaskState[subtask.status.id - 1]}
                    data-test-id="subtask-state-dropdown"
                />
            </div>
            </>
            )}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Prioridad</label>
                <DropdownMenu
                    buttonText="Seleccione Prioridad"
                    items={dropdownItems.subtaskPriority}
                    onSelect={(value) => handleSubtaskInputChange("priority", value)}
                    isInModal={true}
                    selectedValue={dropdownItems.subtaskPriority[subtask.priorityId - 1]}
                    data-test-id="subtask-priority-dropdown"
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
                    onClick={handleSaveSubtask}
                    className="bg-[#0d4384] hover:bg-[#112339] text-white disabled:bg-[#747474c6]"
                    disabled={!subtaskFormState.name || !subtaskFormState.budget || !subtaskFormState.endDate || !subtaskFormState.startDate || !subtaskFormState. priority}
                    data-test-id="save-button"
                >
                Guardar
                </Button>
            </div>
        </div>
    );
}