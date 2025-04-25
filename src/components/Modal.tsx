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
    <div className="fixed inset-0 z-1002 flex items-center justify-center">
      <div className="absolute inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm"></div>
      <div className="relative bg-white p-6 rounded shadow-lg w-96 z-10">
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