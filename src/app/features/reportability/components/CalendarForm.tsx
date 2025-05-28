'use client'

import { useEffect, useState } from "react";
import { useCalendarForms } from "../hooks/useCalendarForms"

export default function CalendarForm(event: any) {
    const { handleGetTaskName } = useCalendarForms();
    const [taskName, setTaskName] = useState<string>("Cargando...");

    useEffect(() => {
        const fetchTaskName = async () => {
            try {
                const name = await handleGetTaskName(event.selectedEvent.taskId);
                setTaskName(name || "No disponible");
            } catch (error) {
                console.error("Error fetching task name:", error);
                setTaskName("Error al cargar");
            }
        };

        if (event.selectedEvent.taskId) {
            fetchTaskName();
        }
    }, [event.selectedEvent.taskId, handleGetTaskName]);

    return (
        <div className="items-center justify-center p-4">
            <h2 className="text-2xl font-semibold text-center justify-center">{event.selectedEvent.title}</h2>
            <p className="mb-2"><strong>Valle:</strong> {event.selectedEvent.valley}</p>
            <p className="mb-2"><strong>Fecha de inicio:</strong> {event.selectedEvent.startDate}</p>
            <p className="mb-2"><strong>Fecha de fin:</strong> {event.selectedEvent.start}</p>
            <p className="mb-2"><strong>Estado:</strong> {event.selectedEvent.status}</p>
            <p className="mb-2"><strong>Tarea:</strong> {taskName}</p>
            <p className="mb-2"><strong>Progreso:</strong> {event.selectedEvent.progress}%</p>
            <p className="mb-2"><strong>Faena:</strong> {event.selectedEvent.faena}</p>
        </div>
    )
}