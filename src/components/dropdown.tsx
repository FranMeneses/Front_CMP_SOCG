'use client'
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from 'lucide-react';

interface DropdownMenuProps {
  buttonText: string; 
  items: string[]; 
  onSelect: (item: string) => void; 
  isInModal?: boolean; 
}

export default function DropdownMenu({ buttonText, items, onSelect, isInModal = false }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null); 
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (item: string) => {
    setSelectedItem(item); 
    onSelect(item); 
    setIsOpen(false); 
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
      <div className="z-1001">
        <button
          onClick={toggleDropdown}
          className="bg-white border text-black px-2 py-2 rounded w-full flex flex-row font-normal items-center text-sm md:text-base"
        >
          {selectedItem || buttonText}
          <span className="ml-auto cursor-pointer mt-1">
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </span>
        </button>
      </div>
      {isOpen && (
        <div className="absolute bg-white border rounded shadow-lg w-full text-sm md:text-base z-2000">
          <ul>
            {items.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSelect(item)}
                className="p-2 hover:bg-gray-100 cursor-pointer z-3000"
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