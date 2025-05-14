'use client'
export default function CalendarForm(event: any) {
    return (
        <div className="items-center justify-center p-4">
            <h2 className="text-2xl font-semibold text-center justify-center">{event.selectedEvent.title}</h2>
            <p className="mb-2"><strong>Valle:</strong> {event.selectedEvent.valley}</p>
            <p className="mb-2"><strong>Fecha de inicio:</strong> {event.selectedEvent.start}</p>
            <p className="mb-2"><strong>Fecha de fin:</strong> {event.selectedEvent.end}</p>
            <p className="mb-2"><strong>Progreso:</strong> {event.selectedEvent.progress}%</p>
            <p className="mb-2"><strong>Faena:</strong> {event.selectedEvent.faena}</p>
        </div>
    )
}