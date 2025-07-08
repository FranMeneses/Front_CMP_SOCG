'use client';
import { useHooks } from "@/app/features/hooks/useHooks";
import { useValleyTaskForm } from "@/app/features/planification/hooks/useValleyTaskForm";
import { IInfoTask } from "@/app/models/ITasks";
import { TaskDetails } from "@/app/models/ITaskForm";
import DropdownMenu from "@/components/Dropdown";
import { Button } from "@/components/ui/button";
import { Info, Clipboard, FileText } from "lucide-react";

interface ValleyTaskFormProps {
  onSave: (task: TaskDetails) => void;
  onCancel: () => void;
  details?: boolean;
  isEditing?: boolean;
  valley: string;
  infoTask?: IInfoTask;
}

export default function ValleyTaskForm({ onSave, onCancel, isEditing, valley, details, infoTask }: ValleyTaskFormProps) {
  const {
    formState,
    dropdownItems,
    isFormValid,
    error,
    handleInputChange,
    handleComplianceChange,
    handleSave,
    setError,
  } = useValleyTaskForm(onSave, valley, isEditing, infoTask);

  const { isManager, userRole } = useHooks();

  return (
    <div className="p-5 max-w-2xl mx-auto font-[Helvetica]" data-test-id="task-form">
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">
          {isEditing ? "Editar Tarea" : "Nueva Tarea"}
        </h2>
      </div>

      <div className="space-y-6">
        {/* Información General */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
            <Info className="h-4 w-4 mr-2" />
            Información General
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500 required">Nombre</label>
              <input
                type="text"
                value={formState.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="form-input"
                data-test-id="task-title-input"
                disabled={isManager}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Descripción</label>
              <input
                type="text"
                value={formState.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="form-input"
                data-test-id="task-description-input"
                disabled={isManager}
              />
            </div>
          </div>
        </div>

        {/* Proceso y Ubicación */}
        {userRole !== "Jefe Relacionamiento VH" && userRole !== "Jefe Relacionamiento VE" && userRole !== "Jefe Relacionamiento VC" && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
              <Clipboard className="h-4 w-4 mr-2" />
              Proceso y Ubicación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 required">Valle</label>
              <DropdownMenu
                buttonText="Seleccionar Valle"
                items={dropdownItems.valleyNames}
                onSelect={(value) => handleInputChange("valley", value)}
                isInModal={true}
                selectedValue={infoTask?.task.valley?.name? dropdownItems.valleyNames[infoTask.task.valley.id - 1] : undefined}
              />
            </div>
            </div>
          </div>
        )}

        {/* Información Tarea */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Información Tarea
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Origen */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500 required">Origen</label>
              <DropdownMenu
                items={dropdownItems.origin}
                onSelect={(value) => handleInputChange("origin", value)}
                buttonText="Seleccione Origen"
                selectedValue={infoTask?.originId ? dropdownItems.origin[infoTask.originId - 1] : undefined}
                isInModal={true}
                disabled={isManager || (isEditing && userRole != "Admin")}
              />
            </div>
            {/* Inversión */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500 required">Inversión</label>
              <DropdownMenu
                buttonText="Seleccione Inversión"
                items={dropdownItems.investment}
                onSelect={(value) => handleInputChange("investment", value)}
                isInModal={true}
                selectedValue={infoTask?.investmentId !== undefined ? dropdownItems.investment[infoTask.investmentId - 1] : undefined}
                data-test-id="task-investment-dropdown"
                disabled={isManager || (isEditing && userRole != "Admin")}
              />
            </div>
            {/* Tipo de Iniciativa */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500 required">Tipo de Iniciativa</label>
              <DropdownMenu
                buttonText="Seleccione Tipo de Iniciativa"
                items={dropdownItems.type}
                onSelect={(value) => handleInputChange("type", value)}
                isInModal={true}
                selectedValue={infoTask?.typeId ? dropdownItems.type[infoTask.typeId - 1] : undefined}
                data-test-id="task-type-dropdown"
                disabled={isManager || (isEditing && userRole != "Admin")}
              />
            </div>
            {/* Alcance de Iniciativa */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500 required">Alcance de Iniciativa</label>
              <DropdownMenu
                buttonText="Seleccione Alcance"
                items={dropdownItems.scope}
                onSelect={(value) => handleInputChange("scope", value)}
                isInModal={true}
                selectedValue={infoTask?.scopeId !== undefined ? dropdownItems.scope[infoTask.scopeId - 1] : undefined}
                data-test-id="task-scope-dropdown"
                disabled={isManager || (isEditing && userRole != "Admin")}
              />
            </div>
            {/* Interacción */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500 required">Interacción</label>
              <DropdownMenu
                buttonText="Seleccione Interacción"
                items={dropdownItems.interaction}
                onSelect={(value) => handleInputChange("interaction", value)}
                isInModal={true}
                selectedValue={infoTask?.interactionId !== undefined ? dropdownItems.interaction[infoTask.interactionId - 1] : undefined}
                data-test-id="task-interaction-dropdown"
                disabled={isManager || (isEditing && userRole != "Admin")}
              />
            </div>
            {/* Riesgo */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500 required">Riesgo</label>
              <DropdownMenu
                buttonText="Seleccionar el riesgo"
                items={dropdownItems.risk}
                onSelect={(value) => handleInputChange("risk", value)}
                isInModal={true}
                selectedValue={infoTask?.riskId !== undefined ? dropdownItems.risk[infoTask.riskId - 1] : undefined}
                data-test-id="task-risk-dropdown"
                disabled={isManager || (isEditing && userRole != "Admin")}
              />
            </div>
            {/* Beneficiario */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Beneficiario</label>
              <DropdownMenu
                buttonText="Seleccionar beneficiario"
                items={dropdownItems.beneficiaries}
                onSelect={(value) => handleInputChange("beneficiary", value)}
                isInModal={true}
                disabled={isManager || (isEditing && userRole != "Admin")}
                selectedValue={infoTask?.task?.beneficiary?.legalName ? dropdownItems.beneficiaries.find(infoTask?.task?.beneficiary.legalName) : undefined}
                data-test-id="task-beneficiary-dropdown"
              />
            </div>
            {/* Compliance */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500 required">¿Compliance?</label>
              <DropdownMenu
                buttonText="Seleccione Compliance"
                items={["Si", "No"]}
                onSelect={(value) => handleComplianceChange(value === "Si" ? true : false)}
                isInModal={true}
                selectedValue={infoTask ? (infoTask.task?.applies ? "Si" : "No") : undefined}
                data-test-id="task-compliance-dropdown"
                disabled={isEditing ? true : false}
              />
            </div>
            {/* Estado */}
            {isEditing && (
              <div className="space-y-1">
                <label className="text-xs text-gray-500 required">Estado</label>
                <DropdownMenu
                  buttonText="Seleccione Estado"
                  items={dropdownItems.state}
                  onSelect={(value) => {
                    if (value === "Completada") {
                      setError("La iniciativa pasara a completado cuando se terminen todas las subtareas");
                    } else {
                      setError(null);
                      handleInputChange("state", value);
                    }
                  }}
                  isInModal={true}
                  selectedValue={infoTask?.task?.statusId ? dropdownItems.state[infoTask.task.statusId - 1] : undefined}
                  data-test-id="task-state-dropdown"
                  disabled={
                    isManager ||
                    formState.state === "Due Diligence" ||
                    infoTask?.task?.statusId === dropdownItems.state.findIndex((state: string) => state === "Due Diligence") + 1
                  }
                />
                {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
              </div>
            )}
            {/* Presupuesto y Gastos */}
            {details && (
              <>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Presupuesto (USD)</label>
                  <input
                    type="number"
                    min={0}
                    value={formState.budget}
                    onChange={(e) => handleInputChange("budget", e.target.value)}
                    className="form-input"
                    disabled={true}
                    data-test-id="task-budget-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Gasto (USD)</label>
                  <input
                    type="number"
                    min={0}
                    value={formState.expenses}
                    onChange={(e) => handleInputChange("expenses", e.target.value)}
                    className="form-input"
                    disabled={true}
                    data-test-id="task-expenses-input"
                  />
                </div>
              </>
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
          onClick={handleSave}
          className="bg-[#0068D1] hover:bg-[#0056A3] text-white disabled:bg-[#747474c6] cursor-pointer disabled:cursor-default"
          disabled={!isFormValid}
          data-test-id="save-button"
        >
          Guardar
        </Button>
      </div>
    </div>
  );
}