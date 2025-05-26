import React from "react";
import Modal from "@/components/Modal";
import { ISubtaskScheduler } from "@/app/models/ISubtasks";
import { ITask } from "@/app/models/ITasks";
import LoadingSpinner from "@/components/LoadingSpinner"; 

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSubtask: ISubtaskScheduler | null;
  taskDetails: ITask | undefined;
  isLoading?: boolean; 
}

export default function TaskDetailsModal({
  isOpen,
  onClose,
  selectedSubtask,
  taskDetails,
  isLoading = false, 
}: TaskDetailsModalProps) {
  const calculateDaysDiff = () => {
    if (!selectedSubtask) return 0;
    
    const startDate = new Date(selectedSubtask.start);
    const endDate = new Date(selectedSubtask.end);
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {selectedSubtask && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{selectedSubtask.name}</h2>
            <div className="bg-gray-100 p-3 rounded">
              <p className="mb-2">
                <span className="font-medium">Período:</span>{" "}
                {new Date(selectedSubtask.start).toLocaleDateString("es-ES")} -{" "}
                {new Date(selectedSubtask.end).toLocaleDateString("es-ES")}
              </p>
              <p className="mb-2">
                <span className="font-medium">Duración:</span> {calculateDaysDiff()} días
              </p>
              <p className="mb-2">
                <span className="font-medium">Progreso:</span> {selectedSubtask.progress}%
              </p>
              <p className="mb-2">
                <span className="font-medium">Estado:</span> {selectedSubtask.state}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center p-10">
              <LoadingSpinner />
            </div>
          ) : (
            taskDetails ? (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-3">Detalles de la tarea</h3>
                <div className="bg-gray-100 p-3 rounded max-h-[300px] overflow-y-auto">
                  <p className="mb-2">
                    <span className="font-medium">Nombre:</span> {taskDetails.name}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Descripción:</span>{" "}
                    {taskDetails.description || "No disponible"}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Faena:</span> {taskDetails.faena?.name || "No disponible"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 text-center text-gray-500">
                No se pudieron cargar los detalles de la tarea
              </div>
            )
          )}
        </div>
      )}
    </Modal>
  );
}