import { useHooks } from "@/app/features/hooks/useHooks";
import DropdownMenu from "@/components/Dropdown";
import { Button } from "@/components/ui/button";
import { useCommunicationTaskForm } from "@/app/features/planification/hooks/useCommunicationTaskForm";
import { ITask } from "@/app/models/ITasks";
import { ITaskForm } from "@/app/models/ICommunicationsForm";
import { Info, Clipboard } from "lucide-react";

interface CommunicationFormProps {
    onSave: (task: Partial<ITaskForm>) => void;
    onCancel: () => void;
    isEditing?: boolean;
    selectedTask?: ITask;
    userRole?: string;
}

export default function CommunicationForm({ 
    onSave, 
    isEditing = false, 
    selectedTask,
    userRole,
    onCancel, 
}: CommunicationFormProps) {

    const { formState, 
            dropdownItems, 
            saveButtonText, 
            isFormValid, 
            error,
            handleSave, 
            handleInputChange, 
            handleComplianceChange,
            setError
        } = useCommunicationTaskForm(
            onSave, 
            isEditing, 
            selectedTask,
            userRole
        );

    const { valleys, isManager } = useHooks();
    
    return (
        <div className="p-5 max-w-2xl mx-auto font-[Helvetica]" data-test-id="communication-form">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">
                    {isEditing ? "Editar Tarea" : "Nueva Tarea"}
                </h2>
            </div>

            <div className="space-y-6">
                {/* Información General */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                        <Info className="h-4 w-4 mr-2"/>
                        Información General
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 required">Título</label>
                            <input
                                type="text"
                                value={formState.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="form-input"
                                data-test-id="communication-title-input"
                                disabled={isManager}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500">Descripción</label>
                            <input
                                type="text"
                                value={formState.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className="form-input"
                                data-test-id="communication-description-input"
                                disabled={isManager}
                            />
                        </div>
                    </div>
                </div>

                {/* Proceso y Valle */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                        <Clipboard className="h-4 w-4 mr-2"/>
                        Proceso y Ubicación
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 required">Valle</label>
                            <DropdownMenu
                                buttonText={"Seleccione el valle asociado"}
                                isInModal={true}
                                items={valleys.map(valley => valley.name)} 
                                onSelect={(value) => handleInputChange('valleyId', value)}
                                selectedValue={valleys.find(valley => valley.id === selectedTask?.valleyId)?.name }
                                data-test-id="communication-faena-dropdown"
                                disabled={isManager}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 required">Proceso</label>
                            <DropdownMenu
                                buttonText={"Seleccione el proceso asociado"}
                                isInModal={true}
                                items={
                                    !selectedTask || typeof selectedTask.processId !== 'number'
                                        ? dropdownItems.processes
                                        : selectedTask.processId > 3
                                            ? dropdownItems.processes
                                            : dropdownItems.relationshipProcesses
                                }
                                onSelect={(value) => handleInputChange('processId', value)}
                                selectedValue={isEditing && selectedTask ? formState.processId : ""}
                                data-test-id="communication-process-dropdown"
                                disabled={isManager}
                            />
                        </div>
                    </div>
                </div>

                {/* Compliance */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                        <Info className="h-4 w-4 mr-2"/>
                        Compliance
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 required">¿Compliance?</label>
                            <DropdownMenu
                                buttonText="Seleccione Compliance"
                                items={["Si", "No"]}
                                onSelect={(value) => handleComplianceChange(value === "Si" ? true : false)}
                                isInModal={true}
                                selectedValue={selectedTask ? (selectedTask.applies ? "Si" : "No") : undefined}
                                data-test-id="communication-compliance-dropdown"
                                disabled={isEditing ? true : false}
                            />
                        </div>
                        {isEditing && (
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">Estado</label>
                                <DropdownMenu
                                    buttonText={"Seleccione Estado"}
                                    isInModal={true}
                                    items={dropdownItems.statuses}
                                    onSelect={(value) => {
                                        if (value === "Completada") {
                                            setError("La iniciativa pasara a completado cuando se terminen todas las subtareas");
                                        } else {
                                            setError(null);
                                            handleInputChange('statusId', value);
                                        }
                                    }}
                                    selectedValue={dropdownItems.statuses[selectedTask?.statusId ? selectedTask.statusId - 1 : 0]}
                                    data-test-id="communication-status-dropdown"
                                    disabled={isManager || selectedTask?.status?.name === "En Cumplimiento" || selectedTask?.statusId === dropdownItems.statuses.findIndex((state: string) => state === "En Cumplimiento") + 1}
                                />
                                {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Presupuesto y Gastos */}
                {isEditing && (
                    <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                            <Clipboard className="h-4 w-4 mr-2"/>
                            Presupuesto y Gastos
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">Presupuesto (USD)</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={formState.budget}
                                    disabled={true}
                                    className="form-input"
                                    data-test-id="communication-budget-input"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">Gastos (USD)</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={formState.expense}
                                    disabled={true}
                                    className="form-input"
                                    data-test-id="communication-expense-input"
                                />
                            </div>
                        </div>
                    </div>
                )}
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
                    onClick={() => handleSave()}
                    disabled={!isFormValid}
                    className="bg-[#0068D1] hover:bg-[#0056A3] text-white disabled:bg-[#747474c6] cursor-pointer"
                    data-test-id="save-button"
                >
                    {saveButtonText}
                </Button>
            </div>
        </div>
    );
}