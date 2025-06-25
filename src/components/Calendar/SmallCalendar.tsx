import React from 'react';
import { IEvent } from '@/app/models/ICalendar';

interface SmallCalendarProps {
  month: number;
  year: number;
  events: IEvent[]; 
}

const SmallCalendar: React.FC<SmallCalendarProps> = ({ month, year, events }) => {
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; 
  };

  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);
  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

  const calendarDays = [];
  
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const hasEvents = events.some(event => {
      let eventDate: Date;
      
      if (typeof event.start === 'string') {
        const dateStr = event.start.split('T')[0]; 
        const [yearStr, monthStr, dayStr] = dateStr.split('-');
        eventDate = new Date(parseInt(yearStr), parseInt(monthStr) - 1, parseInt(dayStr));
      } else {
        // Si no es string, asumimos que es una fecha o podemos convertirlo
        eventDate = new Date(event.start);
      }
      
      return eventDate.getDate() === day && 
             eventDate.getMonth() === month && 
             eventDate.getFullYear() === year;
    });
    
    calendarDays.push({
      day,
      hasEvents,
      isToday: isCurrentMonth && today.getDate() === day
    });
  }

  return (
    <div className="p-3">
      <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">
        {monthNames[month]} {year}
      </h3>
      <div className="grid grid-cols-7 gap-1 text-xs">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
          <div key={index} className="text-center font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
        
        {calendarDays.map((dayData, index) => (
          <div
            key={index}
            className={`
              h-6 w-6 flex items-center justify-center text-xs rounded
              ${!dayData ? '' : 
                dayData.isToday ? 'bg-blue-600 text-white font-semibold' :
                dayData.hasEvents ? 'bg-blue-100 text-blue-800' :
                'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            {dayData?.day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmallCalendar;