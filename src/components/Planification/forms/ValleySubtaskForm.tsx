import { Button } from "@/components/ui/button";
import { useValleySubtasksForm } from "@/app/features/planification/hooks/useValleySubtasksForm";
import DropdownMenu from "@/components/Dropdown";
import { ISubtask } from "@/app/models/ISubtasks";
import { useHooks } from "@/app/features/hooks/useHooks";
import { ExtendedSubtaskValues } from "@/app/models/ISubtaskForm";
import { Info, Clipboard, FileText } from "lucide-react";

interface ValleySubtaskFormProps {
    onSave: (subtask: ExtendedSubtaskValues) => void;
    onCancel: () => void;
    isEditing?: boolean;
    valley: string;
    subtask?: ISubtask;
}

export default function ValleySubtaskForm({ onSave, onCancel, isEditing, subtask }: ValleySubtaskFormProps) {
    const {
        subtaskFormState,
        dropdownItems,
        dateError,
        handleSubtaskInputChange,
        handleSaveSubtask,
        isFormValid
    } = useValleySubtasksForm(onSave, subtask);

    const { isManager, userRole } = useHooks();

    return (
        <div className="p-5 max-w-2xl mx-auto font-[Helvetica]" data-test-id="subtask-form">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">
                    {isEditing ? "Editar Subtarea" : "Nueva Subtarea"}
                </h2>
            </div>
            {/* Información General */}
            <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Información General
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-gray-500 required">Nombre</label>
                        <input
                            type="text"
                            value={subtaskFormState.name}
                            onChange={(e) => handleSubtaskInputChange("name", e.target.value)}
                            className="form-input"
                            data-test-id="subtask-title-input"
                            disabled={isManager}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-gray-500">Descripción</label>
                        <input
                            type="text"
                            value={subtaskFormState.description}
                            onChange={(e) => handleSubtaskInputChange("description", e.target.value)}
                            className="form-input"
                            data-test-id="subtask-description-input"
                            disabled={isManager}
                        />
                    </div>
                </div>
            </div>

            {/* Fechas y Presupuesto */}
            <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                    <Clipboard className="h-4 w-4 mr-2" />
                    Fechas y Presupuesto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-gray-500 required">Presupuesto (USD)</label>
                        <input
                            type="number"
                            min={0}
                            value={subtaskFormState.budget}
                            onChange={(e) => handleSubtaskInputChange("budget", e.target.value)}
                            className="form-input"
                            data-test-id="subtask-budget-input"
                            disabled={isManager || (isEditing && userRole != "Admin")}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-gray-500 required">Fecha de Inicio</label>
                        <input
                            type="date"
                            value={subtaskFormState.startDate}
                            onChange={(e) => handleSubtaskInputChange("startDate", e.target.value)}
                            className={`form-input ${dateError ? 'input-error' : ''}`}
                            data-test-id="subtask-start-date-input"
                            disabled={isManager || (isEditing && userRole != "Admin")}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-gray-500 required">Fecha de Término</label>
                        <input
                            type="date"
                            value={subtaskFormState.endDate}
                            onChange={(e) => handleSubtaskInputChange("endDate", e.target.value)}
                            className={`form-input ${dateError ? 'input-error' : ''}`}
                            data-test-id="subtask-end-date-input"
                            disabled={isManager || (isEditing && userRole != "Admin")}
                            required
                        />
                        {dateError && <span className="error-message">{dateError}</span>}
                    </div>
                    {isEditing && (
                        <>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">Fecha de Finalización</label>
                                <input
                                    type="date"
                                    value={subtaskFormState.finalDate}
                                    onChange={(e) => handleSubtaskInputChange("finalDate", e.target.value)}
                                    className="form-input"
                                    data-test-id="subtask-finish-date-input"
                                    disabled={isManager}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">Gastos (USD)</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={subtaskFormState.expense}
                                    onChange={(e) => handleSubtaskInputChange("expense", e.target.value)}
                                    className="form-input"
                                    data-test-id="subtask-expense-input"
                                    disabled={isManager}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Estado y Prioridad */}
            <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Estado y Prioridad
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isEditing && (
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500">Estado</label>
                            <DropdownMenu
                                buttonText="Seleccione Estado"
                                items={dropdownItems.subtaskState}
                                onSelect={(value) => { handleSubtaskInputChange("state", value) }}
                                isInModal={true}
                                selectedValue={dropdownItems.subtaskState[(subtask?.status?.id ?? 1) - 1]}
                                data-test-id="subtask-state-dropdown"
                                disabled={isManager}
                            />
                        </div>
                    )}
                    <div className="space-y-1">
                        <label className="text-xs text-gray-500 required">Prioridad</label>
                        <DropdownMenu
                            buttonText="Seleccione Prioridad"
                            items={dropdownItems.subtaskPriority}
                            onSelect={(value) => handleSubtaskInputChange("priority", value)}
                            isInModal={true}
                            selectedValue={subtask?.priorityId !== undefined ? dropdownItems.subtaskPriority[subtask.priorityId - 1] : undefined}
                            data-test-id="subtask-priority-dropdown"
                            disabled={isManager}
                        />
                    </div>
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
                    onClick={handleSaveSubtask}
                    className="bg-[#0d4384] hover:bg-[#112339] text-white disabled:bg-[#747474c6] hover:cursor-pointer"
                    disabled={!isFormValid}
                    data-test-id="save-button"
                >
                    Guardar
                </Button>
            </div>
        </div>
    );
}