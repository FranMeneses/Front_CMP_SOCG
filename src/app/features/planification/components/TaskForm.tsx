'use client';
import { useState } from "react";
import DropdownMenu from "@/components/Dropdown";

interface TaskFormProps {
  onSave: (task: { title: string; description: string; type: string }) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSave }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<string>("");

  const handleSave = () => {
    onSave({ title, description, type });
    setTitle("");
    setDescription("");
    setType("");
  };

  return (
    <div>
      <div className="mb-4">
        <label className="text-sm font-medium mb-1">Tipo</label>
        <DropdownMenu
          buttonText="Seleccionar tipo"
          items={["Tarea", "Subtarea"]}
          onSelect={(item) => setType(item)}
        />
        <label className="block text-sm font-medium mb-1">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-[#08203d] ease-in-out duration-400 cursor-pointer"
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default TaskForm;