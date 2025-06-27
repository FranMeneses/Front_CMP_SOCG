import { Button } from "@/components/ui/button";
import { useValleySubtasksForm } from "@/app/features/planification/hooks/useValleySubtasksForm";
import DropdownMenu from "@/components/Dropdown";
import { ISubtask } from "@/app/models/ISubtasks";
import { useHooks } from "@/app/features/hooks/useHooks";
import { ExtendedSubtaskValues } from "@/app/models/ISubtaskForm";

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
        <div className='font-[Helvetica]' data-test-id="subtask-form">
            <div className="form-field">
                <label className="form-label required">Nombre</label>
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
            
            <div className="form-field">
                <label className="form-label">Descripción</label>
                <input
                    type="text"
                    value={subtaskFormState.description}
                    onChange={(e) => handleSubtaskInputChange("description", e.target.value)}
                    className="form-input"
                    data-test-id="subtask-description-input"
                    disabled={isManager}
                />
            </div>
            
            <div className="form-field">
                <label className="form-label required">Presupuesto (USD)</label>
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
            
            <div className="form-field">
                <label className="form-label required">Fecha de Inicio</label>
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
            
            <div className="form-field">
                <label className="form-label required">Fecha de Término</label>
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
                    <div className="form-field">
                        <label className="form-label">Fecha de Finalización</label>
                        <input
                            type="date"
                            value={subtaskFormState.finalDate}
                            onChange={(e) => handleSubtaskInputChange("finalDate", e.target.value)}
                            className="form-input"
                            data-test-id="subtask-finish-date-input"
                            disabled={isManager}
                        />
                    </div>
                    
                    <div className="form-field">
                        <label className="form-label">Gastos (USD)</label>
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
                    
                    <div className="form-field">                                                 
                        <label className="form-label">Estado</label>
                        <DropdownMenu
                            buttonText="Seleccione Estado"
                            items={dropdownItems.subtaskState}
                            onSelect={(value) => {handleSubtaskInputChange("state", value)}}
                            isInModal={true}
                            selectedValue={dropdownItems.subtaskState[(subtask?.status?.id ?? 1) - 1]}
                            data-test-id="subtask-state-dropdown"
                            disabled={isManager}
                        />
                    </div>
                </>
            )}
            
            <div className="form-field">
                <label className="form-label required">Prioridad</label>
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