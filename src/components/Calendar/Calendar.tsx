'use client'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import esLocale from "@fullcalendar/core/locales/es";
import { useState } from "react";
import Modal from "../Modal";
import CalendarForm from "@/app/features/reportability/components/CalendarForm";
import { IEvent } from "@/app/models/ICalendar";

interface CalendarComponentProps {
  calendarView: string;
  events: IEvent[]
  onMonthChange?: (year: number, month: number) => void;
}

const Calendar: React.FC<CalendarComponentProps> = ({ calendarView, events, onMonthChange }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null); 
  const [currentMonth, setCurrentMonth] = useState<{year: number, month: number}>(() => {
    const now = new Date();
    return {year: now.getFullYear(), month: now.getMonth() + 2};
  });

const handleEventClick = (info: any) => {
  const [datePart] = info.event.startStr.split('T');
  const [year, month, day] = datePart.split('-');
  
  const formattedStar = `${day}/${month}/${year}`;

  const [startDatePart] = info.event.extendedProps.startDate.split('T');
  const [startYear, startMonth, startDay] = startDatePart.split('-');
  const formattedStartDate = `${startDay}/${startMonth}/${startYear}`;

  setSelectedEvent({
    title: info.event.title,
    valley: info.event.extendedProps.valley,
    start: formattedStar,
    startDate: formattedStartDate,
    status: info.event.extendedProps.status,
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
        timeZone="UTC"
      />

      {isModalOpen && selectedEvent && (
        <Modal 
          onClose={closeModal} 
          isOpen={isModalOpen} 
          children={<CalendarForm selectedEvent={selectedEvent} />}
        >
        </Modal>
      )}
    </>
  );
};

export default Calendar;