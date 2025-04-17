import { useState } from "react";
import DropdownMenu from "./Dropdown";

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: { title: string; description: string; type: string }) => void;
  }

export function Modal({ isOpen, onClose, onSave }: TaskModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ title, description, type });
        setTitle("");
        setDescription("");
        setType("");
        onClose();
      };

    return (
        <div className="fixed inset-0 bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Crear Nueva Tarea</h2>
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
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 hover:bg-[#878787] ease-in-out duration-400 cursor-pointer rounded">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-[#08203d] ease-in-out duration-400 cursor-pointer">Guardar</button>
                </div>
            </div>
        </div>
    );
}