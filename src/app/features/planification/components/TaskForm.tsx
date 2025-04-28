'use client';
import { useState } from "react";
import DropdownMenu from "@/components/Dropdown";
import { Valleys } from "@/constants/valleys";
import { HuascoValley, CopiapoValley, ElquiValley } from "@/constants/faenas";
import { Button } from "@/components/ui/button";

interface TaskFormProps {
  onSave: (task: { title: string; description: string; type: string, faena: string, valley: string }) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [faena, setFaena] = useState<string>("");
  const [valley, setValley] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [faenas, setFaenas] = useState<string[]>([]);

  const handleSave = () => {
    onSave({ title, description, type, faena, valley });
    setTitle("");
    setDescription("");
    setType("");
    setValley("");
    setFaena("");
    setFaenas([]);
  };

  const handleValleySelect = (selectedValley: string) => {
    setValley(selectedValley);
  
    switch (selectedValley) {
      case "Valle de Copiapó":
        setFaenas(CopiapoValley);
        break;
      case "Valle del Huasco":
        setFaenas(HuascoValley);
        break;
      case "Valle del Elqui":
        setFaenas(ElquiValley);
        break;
      case "Transversal":
        setFaenas(["Transversal"]);
        break;
      default:
        setFaenas([]);
        break;
    }
  };

  return (
    <div data-test-id="task-form">
      <div className="mb-4 truncate">
        <label className="text-sm font-medium mb-1">Tipo</label>
        <div className="mb-4">
          <DropdownMenu
            buttonText="Seleccionar tipo"
            items={["Tarea", "Subtarea"]}
            onSelect={(item) => setType(item)}
            isInModal={true}
            data-test-id="task-type-dropdown"
          />
        </div>
        <label className="block text-sm font-medium mb-1">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
          data-test-id="task-title-input"
        />
      </div>
      {type === "Tarea" ? (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2"
              data-test-id="task-description-input"
            />
          </div>
          <div className="mb-4 w-full">
            <label className="block text-sm font-medium mb-1">Valle</label>
            <DropdownMenu
              buttonText="Seleccionar valle"
              items={Valleys}
              onSelect={handleValleySelect} 
              isInModal={true}
              data-test-id="task-valley-dropdown"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Faena</label>
            <DropdownMenu
              buttonText="Seleccionar faena"
              items={faenas} 
              onSelect={(item) => setFaena(item)}
              isInModal={true}
              data-test-id="task-faena-dropdown"
            />
          </div>
        </>
      ) : (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            data-test-id="subtask-description-input"
          />
        </div>
      )}
      <div className="flex justify-end space-x-2">
        <Button variant="secondary" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 cursor-pointer" data-test-id="cancel-button">
          Cancelar
        </Button>
        <Button variant="default" onClick={handleSave} className="bg-[#0d4384] hover:bg-[#112339] text-white disabled:bg-[#747474c6]"
          disabled={!title || !description || !type || (type === "Tarea" && (!faena || !valley))}
          data-test-id="save-button"
        >
          Guardar
        </Button>
      </div>
    </div>
  );
};

export default TaskForm;