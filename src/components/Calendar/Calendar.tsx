'use client'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import esLocale from "@fullcalendar/core/locales/es";
import { useState } from "react";
import Modal from "../Modal";

interface CalendarComponentProps {
  calendarView: string;
  events: Array<{ title: string; start: string; end: string; color: string; allDay: boolean }>;
}

const Calendar: React.FC<CalendarComponentProps> = ({ calendarView, events }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const handleEventClick = (info: any) => {

    const formattedStartDate = new Date(info.event.startStr).toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  

    setSelectedEvent({
      title: info.event.title,
      valley: info.event.extendedProps.valley,
      start: formattedStartDate,
      progress: info.event.extendedProps.progress,
      faena: info.event.extendedProps.faena,
    });
    setIsModalOpen(true); 
  };

  const closeModal = () => {
    setIsModalOpen(false); 
    setSelectedEvent(null);
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
        initialView={calendarView}
        locale={esLocale}
        titleFormat={{ month: "short", year: "numeric" }}
        fixedWeekCount={false}
        showNonCurrentDates={false}
        headerToolbar={{
          start: "prev",
          center: "title",
          end: "next",
        }}
        buttonIcons={{
          prev: "chevron-left",
          next: "chevron-right",
        }}
        height="auto"
        aspectRatio={1.5}
        events={events}
        eventClick={handleEventClick} 
      />

      {isModalOpen && selectedEvent && (
        <Modal 
          onClose={closeModal} 
          isOpen={isModalOpen} 
        >
            <div className="items-center justify-center p-4">
                <h2 className="text-xl font-bold">{selectedEvent.title}</h2>
                <p><strong>Valle:</strong> {selectedEvent.valley}</p>
                <p><strong>Inicio:</strong> {selectedEvent.start}</p>
                <p><strong>Progreso:</strong> {selectedEvent.progress}%</p>
                <p><strong>Faena:</strong> {selectedEvent.faena}</p>
            </div>
        </Modal>
      )}
    </>
  );
};

export default Calendar;