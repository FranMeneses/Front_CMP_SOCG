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
  disabled = false 
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
    if (!disabled) { 
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (item: string) => {
    if (!disabled) {
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
        className={`relative ${isInModal ? 'w-full' : 'w-auto'}`} 
      >
      <div className={`${isInModal ? 'z-[1050]' : 'z-[50]'} font-[Helvetica]`}> 
        <Button
          variant="outline"
          onClick={toggleDropdown}
          className={`cursor-pointer w-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={disabled}
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
        <div className={`absolute bg-white border rounded shadow-lg w-full text-sm md:text-base ${isInModal ? 'z-[1051]' : 'z-[1050]'} max-h-60 overflow-y-auto font-[Helvetica]`}>
          <ul>
            {items.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSelect(item)}
                className={`p-2 hover:bg-gray-100 cursor-pointer ${
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