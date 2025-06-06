import React from 'react';
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemType: 'tarea' | 'subtarea';
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemType
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto font-[Helvetica]">
        <div className="flex items-center justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-xl font-bold mb-4 text-center">Confirmar eliminación</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          ¿Estás seguro de que quieres eliminar esta {itemType}? Esta acción no se puede deshacer. {/*TODO: AGREGAR CONFIRMACIÓN DE ADMINISTRADOR*/}
        </p>
        <div className="flex justify-center space-x-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="px-4 py-2 cursor-pointer"
          >
            Cancelar
          </Button>
          <Button 
            className="bg-red-600 text-white px-4 py-2 hover:bg-red-700 cursor-pointer"
            onClick={onConfirm}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;