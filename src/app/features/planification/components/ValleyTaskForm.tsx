'use client';
import { useValleyTaskForm } from "@/app/features/planification/hooks/useValleyTaskForm";
import DropdownMenu from "@/components/Dropdown";
import { Button } from "@/components/ui/button";

interface ValleyTaskFormProps {
  onSave: any; // TODO: Define the type for the task object
  onCancel: () => void;
  details?: boolean;
  isEditing?: boolean;
  valley: string;
  infoTask?: any;
}

export default function ValleyTaskForm({ onSave, onCancel, isEditing, valley, details, infoTask }: ValleyTaskFormProps) {

  const {
    formState,
    faenas,
    dropdownItems,
    handleInputChange,
    handleSave,
  } = useValleyTaskForm(onSave, valley, isEditing, infoTask);

  return (
    <div data-test-id="task-form">
      <div className="mb-4 truncate">
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input
          type="text"
          value={formState.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="w-full border rounded px-3 py-2"
          data-test-id="task-title-input"
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
        />
      </div>
      <div className="mb-4 ">
        <label className="block text-sm font-medium mb-1">Origen</label>
        <DropdownMenu
          items={dropdownItems.origin}
          onSelect={(value) => handleInputChange("origin", value)}
          buttonText="Seleccione Origen"
          selectedValue={dropdownItems.origin[infoTask?.originId - 1]}
          isInModal={true}
        />
      </div>
      <div className="mb-4 ">
        <label className="block text-sm font-medium mb-1">Inversión</label>
        <DropdownMenu
          buttonText="Seleccione Inversión"
          items={dropdownItems.investment}
          onSelect={(value) => handleInputChange("investment", value)}
          isInModal={true}
          selectedValue={dropdownItems.investment[infoTask?.investmentId - 1]}
          data-test-id="task-investment-dropdown"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Tipo de Iniciativa</label>
        <DropdownMenu
          buttonText="Seleccione Tipo de Iniciativa"
          items={dropdownItems.type}
          onSelect={(value) => handleInputChange("type", value)}
          isInModal={true}
          selectedValue={dropdownItems.type[infoTask?.typeId - 1]}
          data-test-id="task-type-dropdown"
        />
      </div>
      <div className="mb-4 ">
        <label className="block text-sm font-medium mb-1">Alcance de Iniciativa</label>
        <DropdownMenu
          buttonText="Seleccione Alcance"
          items={dropdownItems.scope}
          onSelect={(value) => handleInputChange("scope", value)}
          isInModal={true}
          selectedValue={dropdownItems.scope[infoTask?.scopeId - 1]}
          data-test-id="task-scope-dropdown"
        />
      </div>
      <div className="mb-4 ">
        <label className="block text-sm font-medium mb-1">Interacción</label>
        <DropdownMenu
          buttonText="Seleccione Interacción"
          items={dropdownItems.interaction}
          onSelect={(value) => handleInputChange("interaction", value)}
          isInModal={true}
          selectedValue={dropdownItems.interaction[infoTask?.interactionId - 1]}
          data-test-id="task-interaction-dropdown"
        />
      </div>
      {isEditing && (
        <div className="mb-4 ">
          <label className="block text-sm font-medium mb-1">Estado</label>
          <DropdownMenu
            buttonText="Seleccione Estado"
            items={dropdownItems.state}
            onSelect={(value) => handleInputChange("state", value)}
            isInModal={true}
            selectedValue={dropdownItems.state[infoTask?.task.statusId - 1]}
            data-test-id="task-state-dropdown"
          />
        </div>
      )}
      {details && (
        <>
          <div className="mb-4 truncate">
            <label className="block text-sm font-medium mb-1">Presupuesto</label>
            <input
              type="number"
              value={formState.budget}
              onChange={(e) => handleInputChange("budget", e.target.value)}
              className="w-full border rounded px-3 py-2"
              disabled= {true}
              data-test-id="task-budget-input"
            />
          </div>
          <div className="mb-4 truncate">
            <label className="block text-sm font-medium mb-1">Gasto</label>
            <input
              type="number"
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
        <label className="block text-sm font-medium mb-1">Riesgo</label>
        <DropdownMenu
          buttonText="Seleccionar prioridad"
          items={dropdownItems.risk}
          onSelect={(value) => handleInputChange("risk", value)}
          isInModal={true}
          selectedValue={dropdownItems.risk[infoTask?.riskId - 1]}
          data-test-id="task-risk-dropdown"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Faena</label>
        <DropdownMenu
          buttonText="Seleccionar faena"
          items={faenas}
          onSelect={(value) => handleInputChange("faena", value)}
          isInModal={true}
          disabled = {isEditing ? true : false}
          selectedValue={faenas[Number(formState.faena) - 1]}
          data-test-id="task-faena-dropdown"
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
          className="bg-[#0d4384] hover:bg-[#112339] text-white disabled:bg-[#747474c6]"
          disabled={!formState.name || !formState.origin || !formState.type || !formState.scope || !formState.interaction || !formState.faena}
          data-test-id="save-button"
        >
          Guardar
        </Button>
      </div>
    </div>
  );
}