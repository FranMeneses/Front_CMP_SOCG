'use client'

import { useEffect, useState } from "react";
import { useCalendarForms } from "../../app/features/reportability/hooks/useCalendarForms"
import { Info } from "lucide-react";

interface CalendarEvent {
  selectedEvent: {
    taskId: string;
    title: string;
    valley: string;
    startDate: string;
    start: string;
    status: string;
    progress: number;
    faena: string;
  }
}

export default function CalendarForm({ selectedEvent }: CalendarEvent) {
    const { handleGetTaskName } = useCalendarForms();
    const [taskName, setTaskName] = useState<string>("Cargando...");

    useEffect(() => {
        const fetchTaskName = async () => {
            try {
                const name = await handleGetTaskName(selectedEvent.taskId);
                setTaskName(name || "No disponible");
            } catch (error) {
                console.error("Error fetching task name:", error);
                setTaskName("Error al cargar");
            }
        };

        if (selectedEvent.taskId) {
            fetchTaskName();
        }
    }, [selectedEvent.taskId, handleGetTaskName]);

    return (
        <div className="max-w-2xl mx-auto font-[Helvetica]">
            <div className="bg-gray-50 p-8 rounded-md border border-gray-200 mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Info className="h-5 w-5 mr-2" />
                    Detalle del Evento
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <p className="mb-2"><span className="font-medium text-xs text-gray-500">Título:</span> <span className="text-sm">{selectedEvent.title}</span></p>
                        <p className="mb-2"><span className="font-medium text-xs text-gray-500">Valle:</span> <span className="text-sm">{selectedEvent.valley}</span></p>
                        <p className="mb-2"><span className="font-medium text-xs text-gray-500">Faena:</span> <span className="text-sm">{selectedEvent.faena}</span></p>
                        <p className="mb-2"><span className="font-medium text-xs text-gray-500">Estado:</span> <span className="text-sm">{selectedEvent.status}</span></p>
                    </div>
                    <div>
                        <p className="mb-2"><span className="font-medium text-xs text-gray-500">Fecha de inicio:</span> <span className="text-sm">{selectedEvent.startDate}</span></p>
                        <p className="mb-2"><span className="font-medium text-xs text-gray-500">Fecha de fin:</span> <span className="text-sm">{selectedEvent.start}</span></p>
                        <p className="mb-2"><span className="font-medium text-xs text-gray-500">Progreso:</span> <span className="text-sm">{selectedEvent.progress}%</span></p>
                        <p className="mb-2"><span className="font-medium text-xs text-gray-500">Tarea:</span> <span className="text-sm">{taskName}</span></p>
                    </div>
                </div>
            </div>
        </div>
    )
}