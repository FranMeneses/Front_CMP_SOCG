'use client';
import { useHooks } from "@/app/features/hooks/useHooks";
import { useValleyTaskForm } from "@/app/features/planification/hooks/useValleyTaskForm";
import { IInfoTask } from "@/app/models/ITasks";
import DropdownMenu from "@/components/Dropdown";
import { Button } from "@/components/ui/button";

interface ValleyTaskFormProps {
  onSave: any;
  onCancel: () => void;
  details?: boolean;
  isEditing?: boolean;
  valley: string;
  infoTask?: IInfoTask;
}

export default function ValleyTaskForm({ onSave, onCancel, isEditing, valley, details, infoTask }: ValleyTaskFormProps) {

  const {
    formState,
    faenas,
    dropdownItems,
    handleInputChange,
    handleComplianceChange,
    handleSave,
    getFaenaNameById,
  } = useValleyTaskForm(onSave, valley, isEditing, infoTask);

  const selectedFaenaName = isEditing ? getFaenaNameById(formState.faena) : "";
  const { isManager, userRole } = useHooks();

  return (
    <div className='font-[Helvetica]' data-test-id="task-form">
      <h2 className="text-lg font-semibold mb-4">
        {isEditing ? "Editar Tarea" : "Nueva Tarea"}
      </h2>
      <div className="mb-4 truncate">
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input
          type="text"
          value={formState.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="w-full border rounded px-3 py-2"
          data-test-id="task-title-input"
          disabled={isManager}
          required
        />
      </div>
      <div className="mb-4 truncate">
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <input
          type="text"
          value={formState.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="w-full border rounded px-3 py-2"
          data-test-id="task-title-input"
          disabled={isManager}
        />
      </div>
      <div className="mb-4 ">
        <label className="block text-sm font-medium mb-1 required">Origen</label>
        <DropdownMenu
          items={dropdownItems.origin}
          onSelect={(value) => handleInputChange("origin", value)}
          buttonText="Seleccione Origen"
          selectedValue={infoTask?.originId ? dropdownItems.origin[infoTask.originId - 1] : undefined}
          isInModal={true}
          disabled={isManager || (isEditing && userRole != "encargado cumplimiento")}
        />
      </div>
      <div className="mb-4 ">
        <label className="block text-sm font-medium mb-1 required">Inversión</label>
        <DropdownMenu
          buttonText="Seleccione Inversión"
          items={dropdownItems.investment}
          onSelect={(value) => handleInputChange("investment", value)}
          isInModal={true}
          selectedValue={infoTask?.investmentId !== undefined ? dropdownItems.investment[infoTask.investmentId - 1] : undefined}
          data-test-id="task-investment-dropdown"
          disabled={isManager || (isEditing && userRole != "encargado cumplimiento")}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 required">Tipo de Iniciativa</label>
        <DropdownMenu
          buttonText="Seleccione Tipo de Iniciativa"
          items={dropdownItems.type}
          onSelect={(value) => handleInputChange("type", value)}
          isInModal={true}
          selectedValue={infoTask?.typeId ? dropdownItems.type[infoTask.typeId - 1] : undefined}
          data-test-id="task-type-dropdown"
          disabled={isManager || (isEditing && userRole != "encargado cumplimiento")}
        />
      </div>
      <div className="mb-4 ">
        <label className="block text-sm font-medium mb-1 required">Alcance de Iniciativa</label>
        <DropdownMenu
          buttonText="Seleccione Alcance"
          items={dropdownItems.scope}
          onSelect={(value) => handleInputChange("scope", value)}
          isInModal={true}
          selectedValue={infoTask?.scopeId !== undefined ? dropdownItems.scope[infoTask.scopeId - 1] : undefined}
          data-test-id="task-scope-dropdown"
          disabled={isManager || (isEditing && userRole != "encargado cumplimiento")}
        />
      </div>
      <div className="mb-4 ">
        <label className="block text-sm font-medium mb-1 required">Interacción</label>
        <DropdownMenu
          buttonText="Seleccione Interacción"
          items={dropdownItems.interaction}
          onSelect={(value) => handleInputChange("interaction", value)}
          isInModal={true}
          selectedValue={infoTask?.interactionId !== undefined ? dropdownItems.interaction[infoTask.interactionId - 1] : undefined}
          data-test-id="task-interaction-dropdown"
          disabled={isManager || (isEditing && userRole != "encargado cumplimiento")}
        />
      </div>
      <div className="mb-4 ">
        <label className="block text-sm font-medium mb-1 required">¿Compliance?</label>
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
      {isEditing && (
        <div className="mb-4 ">
          <label className="block text-sm font-medium mb-1 required">Estado</label>
          <DropdownMenu
            buttonText="Seleccione Estado"
            items={dropdownItems.state}
            onSelect={(value) => handleInputChange("state", value)}
            isInModal={true}
            selectedValue={infoTask?.task?.statusId ? dropdownItems.state[infoTask.task.statusId - 1] : undefined}
            data-test-id="task-state-dropdown"
            disabled={isManager || 
                      formState.state === "En Cumplimiento" || 
                      infoTask?.task?.statusId === dropdownItems.state.findIndex((state: string) => state === "En Cumplimiento") + 1}
          />
        </div>
      )}
      {details && (
        <>
          <div className="mb-4 truncate">
            <label className="block text-sm font-medium mb-1">Presupuesto (USD)</label>
            <input
              type="number"
              min={0}
              value={formState.budget}
              onChange={(e) => handleInputChange("budget", e.target.value)}
              className="w-full border rounded px-3 py-2"
              disabled= {true}
              data-test-id="task-budget-input"
            />
          </div>
          <div className="mb-4 truncate">
            <label className="block text-sm font-medium mb-1">Gasto (USD)</label>
            <input
              type="number"
              min={0}
              value={formState.expenses}
              onChange={(e) => handleInputChange("expenses", e.target.value)}
              className="w-full border rounded px-3 py-2"
              disabled= {true}
              data-test-id="task-expenses-input"
            />
          </div>
        </>
      )}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 required">Riesgo</label>
        <DropdownMenu
          buttonText="Seleccionar el riesgo"
          items={dropdownItems.risk}
          onSelect={(value) => handleInputChange("risk", value)}
          isInModal={true}
          selectedValue={infoTask?.riskId !== undefined ? dropdownItems.risk[infoTask.riskId - 1] : undefined}
          data-test-id="task-risk-dropdown"
          disabled={isManager || (isEditing && userRole != "encargado cumplimiento")}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 required">Faena</label>
        <DropdownMenu
          buttonText="Seleccionar faena"
          items={faenas}
          onSelect={(value) => handleInputChange("faena", value)}
          isInModal={true}
          disabled = {isEditing ? true : false}
          selectedValue={selectedFaenaName}
          data-test-id="task-faena-dropdown"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 required">Beneficiario</label>
        <DropdownMenu
          buttonText="Seleccionar beneficiario"
          items={dropdownItems.beneficiaries}
          onSelect={(value) => handleInputChange("beneficiary", value)}
          isInModal={true}
          disabled={isManager || (isEditing && userRole != "encargado cumplimiento")}
          selectedValue={infoTask?.task?.beneficiary?.legalName ? dropdownItems.beneficiaries.find(infoTask?.task?.beneficiary.legalName) : undefined}
          data-test-id="task-beneficiary-dropdown"
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
          onClick={handleSave}
          className="bg-[#0068D1] hover:bg-[#0056A3] text-white disabled:bg-[#747474c6] cursor-pointer disabled:cursor-default"
          disabled={!formState.name || !formState.origin || !formState.type || !formState.scope || !formState.interaction || !formState.faena}
          data-test-id="save-button"
        >
          Guardar
        </Button>
      </div>
    </div>
  );
}