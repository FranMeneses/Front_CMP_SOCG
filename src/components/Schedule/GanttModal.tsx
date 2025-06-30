import React from "react";
import Modal from "@/components/Modal";
import { ISubtaskScheduler } from "@/app/models/ISubtasks";
import { ITask } from "@/app/models/ITasks";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Info } from "lucide-react";

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
        <div className="max-w-2xl mx-auto font-[Helvetica]">
          <div className="bg-gray-50 p-8 rounded-md border border-gray-200 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Detalle de la Subtarea
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="mb-2">
                  <span className="font-medium text-xs text-gray-500">Nombre:</span>{" "}
                  <span className="text-sm">{selectedSubtask.name}</span>
                </p>
                <p className="mb-2">
                  <span className="font-medium text-xs text-gray-500">Período:</span>{" "}
                  <span className="text-sm">
                    {new Date(selectedSubtask.start).toLocaleDateString("es-ES")} -{" "}
                    {new Date(selectedSubtask.end).toLocaleDateString("es-ES")}
                  </span>
                </p>
                <p className="mb-2">
                  <span className="font-medium text-xs text-gray-500">Duración:</span>{" "}
                  <span className="text-sm">{calculateDaysDiff()} días</span>
                </p>
                <p className="mb-2">
                  <span className="font-medium text-xs text-gray-500">Progreso:</span>{" "}
                  <span className="text-sm">{selectedSubtask.progress}%</span>
                </p>
                <p className="mb-2">
                  <span className="font-medium text-xs text-gray-500">Estado:</span>{" "}
                  <span className="text-sm">{selectedSubtask.state}</span>
                </p>
              </div>
              <div>
                {isLoading ? (
                  <div className="flex justify-center items-center p-10">
                    <LoadingSpinner />
                  </div>
                ) : taskDetails ? (
                  <div>
                    <p className="mb-2">
                      <span className="font-medium text-xs text-gray-500">Tarea principal:</span>{" "}
                      <span className="text-sm">{taskDetails.name}</span>
                    </p>
                    <p className="mb-2">
                      <span className="font-medium text-xs text-gray-500">Descripción:</span>{" "}
                      <span className="text-sm">{taskDetails.description || "No disponible"}</span>
                    </p>
                    <p className="mb-2">
                      <span className="font-medium text-xs text-gray-500">Faena:</span>{" "}
                      <span className="text-sm">{taskDetails.faena?.name || "No disponible"}</span>
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 text-center text-gray-500">
                    No se pudieron cargar los detalles de la tarea
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}