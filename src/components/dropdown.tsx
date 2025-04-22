'use client'
import { useState } from "react";
import { ChevronDown } from 'lucide-react';

interface DropdownMenuProps {
  buttonText: string; 
  items: string[]; 
  onSelect: (item: string) => void; 
}

export default function DropdownMenu({ buttonText, items, onSelect }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null); 

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (item: string) => {
    setSelectedItem(item); 
    onSelect(item); 
    setIsOpen(false); 
  };

  return (
    <div className="relative w-full md:w-1/4 z-1001">
      <button
        onClick={toggleDropdown}
        className="bg-white border text-black px-2 py-2 rounded flex flex-row font-normal items-center text-sm md:text-base"
      >
        {selectedItem || buttonText} 
        <span className="ml-auto cursor-pointer mt-1">
          <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </button>
      {isOpen && (
      <div className="absolute bg-white border rounded shadow-lg w-full text-sm md:text-base">
        <ul>
          {items.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
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