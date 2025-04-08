'use client'
import { useState } from "react";

export default function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Todos los departamentos
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
          <ul>
            <li className="p-2 hover:bg-gray-100 cursor-pointer">Valle del Huasco</li>
            <li className="p-2 hover:bg-gray-100 cursor-pointer">Valle de Copiapó</li>
            <li className="p-2 hover:bg-gray-100 cursor-pointer">Valle del Elqui</li>
          </ul>
        </div>
      )}
    </div>
  );
}