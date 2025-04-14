'use client'
import { useState } from "react";
import { ChevronDown } from 'lucide-react';

interface DropdownMenuProps {
  buttonText: string; 
  items: string[]; 
  onSelect: (item: string) => void; 
}

export default function DropdownMenu({ buttonText, items, onSelect }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="bg-white border text-black px-2 py-2 rounded w-full flex flex-row"
      >
        {selectedItem || buttonText} 
        <span className="ml-auto">
          <ChevronDown size={25} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </button>
      {isOpen && (
        <div className="absolute bg-white border rounded shadow-lg w-full">
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