'use client';
import React from "react";
import { Button } from "./ui/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-3000 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="absolute inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm"></div>
      <div className="relative bg-white p-4 sm:p-6 rounded shadow-lg w-full max-w-[90%] sm:max-w-lg md:max-w-2xl lg:max-w-3xl z-10 max-h-[90vh] overflow-y-auto">
        <Button
          variant="ghost"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 cursor-pointer"
        >
          ✕
        </Button>
        {children}
      </div>
    </div>
  );
};

export default Modal;