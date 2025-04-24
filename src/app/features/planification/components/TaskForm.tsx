'use client';
import { useState } from "react";
import DropdownMenu from "@/components/Dropdown";
import { Valleys } from "@/constants/valleys";
import { HuascoValley, CopiapoValley, ElquiValley } from "@/constants/faenas";

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
    <div>
      <div className="mb-4 truncate">
        <label className="text-sm font-medium mb-1">Tipo</label>
        <div className="mb-4">
          <DropdownMenu
            buttonText="Seleccionar tipo"
            items={["Tarea", "Subtarea"]}
            onSelect={(item) => setType(item)}
            isInModal={true}
          />
        </div>
        <label className="block text-sm font-medium mb-1">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
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
            />
          </div>
          <div className="mb-4 w-full">
            <label className="block text-sm font-medium mb-1">Valle</label>
            <DropdownMenu
              buttonText="Seleccionar valle"
              items={Valleys}
              onSelect={handleValleySelect} 
              isInModal={true}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Faena</label>
            <DropdownMenu
              buttonText="Seleccionar faena"
              items={faenas} 
              onSelect={(item) => setFaena(item)}
              isInModal={true}
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
          />
        </div>
      )}
      <div className="flex flex-row justify-between space-x-2">
        <button
          onClick={handleSave}
          className="disabled:bg-[#97b8e0c6] px-4 py-2 bg-[#2771CC] text-white rounded hover:bg-[#08203d] ease-in-out duration-400 cursor-pointer"
          disabled={(!title || !description || !type || !faena || !valley)}
        >
          Guardar
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-[#be0101] text-white rounded hover:bg-[#660000] ease-in-out duration-400 cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default TaskForm;