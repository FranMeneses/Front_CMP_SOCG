'use client'
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from 'lucide-react';
import { Button } from "./ui/button";

interface DropdownMenuProps {
  buttonText: string; 
  items: string[]; 
  onSelect: (item: string) => void; 
  isInModal?: boolean; 
  selectedValue?: string;
  disabled?: boolean;
}

export default function DropdownMenu({ 
  buttonText, 
  items, 
  onSelect, 
  isInModal = false, 
  selectedValue,
  disabled = false // Asegúrate de que disabled tenga un valor predeterminado
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null); 
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedValue) {
      setSelectedItem(selectedValue);
    }
  }, [selectedValue]);

  const toggleDropdown = () => {
    if (!disabled) { // Evita abrir el menú si está deshabilitado
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (item: string) => {
    if (!disabled) { // Evita seleccionar un elemento si está deshabilitado
      setSelectedItem(item); 
      onSelect(item); 
      setIsOpen(false); 
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`relative w-full ${isInModal ? '' : 'md:w-1/4'}`} 
    >
      <div className="z-3001">
        <Button
          variant="outline"
          onClick={toggleDropdown}
          className={`cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} // Estilo visual para deshabilitado
          disabled={disabled} // Deshabilita el botón
        >
          {selectedItem || buttonText} 
          <span className="ml-auto mt-1">
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </span>
        </Button>
      </div>
      {isOpen && (
        <div className="absolute bg-white border rounded shadow-lg w-full text-sm md:text-base z-3002">
          <ul>
            {items.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSelect(item)}
                className={`p-2 hover:bg-gray-100 cursor-pointer z-3003 ${
                  disabled ? 'cursor-not-allowed text-gray-400' : ''
                }`} 
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}