'use client'

import { useEffect, useState } from "react";
import { useCalendarForms } from "../../app/features/reportability/hooks/useCalendarForms"

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
        <div className="items-center justify-center p-4 font-[Helvetica]">
            <h2 className="text-2xl font-semibold text-center justify-center">{selectedEvent.title}</h2>
            <p className="mb-2"><strong>Valle:</strong> {selectedEvent.valley}</p>
            <p className="mb-2"><strong>Fecha de inicio:</strong> {selectedEvent.startDate}</p>
            <p className="mb-2"><strong>Fecha de fin:</strong> {selectedEvent.start}</p>
            <p className="mb-2"><strong>Estado:</strong> {selectedEvent.status}</p>
            <p className="mb-2"><strong>Tarea:</strong> {taskName}</p>
            <p className="mb-2"><strong>Progreso:</strong> {selectedEvent.progress}%</p>
            <p className="mb-2"><strong>Faena:</strong> {selectedEvent.faena}</p>
        </div>
    )
}