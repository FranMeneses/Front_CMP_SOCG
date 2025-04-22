'use client'
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; 
import timeGridPlugin from "@fullcalendar/timegrid"; 
import listPlugin from "@fullcalendar/list"; 
import esLocale from "@fullcalendar/core/locales/es";
import './styles/index.css';
import DropdownMenu from "@/components/Dropdown";
import LoadingSpinner from "@/components/LoadinSpinner";
import { useState, useEffect } from "react";
import { ValleysMock } from "@/constants/valleys";
import { tasksMock } from "../../../../mocks/tasksMock";


export default function Reportability() {

  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const calendarEvents = tasksMock.map((task) => ({
    title: task.code,
    start: task.endDate,
    end: task.endDate,
    color: task.code.includes("REVE") ? "#54B87E" : task.code.includes("REVH") ? "#B0A3CC" : "#EFA585",
    allDay: true
  }));

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); 
  };
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  
    return (
      <div className="overflow-x-hidden">
        <Header toggleSidebar={toggleSidebar} />
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <LoadingSpinner/>
          </div>
        )
        :(
          <div className={`grid h-full text-black bg-white ${isSidebarOpen ? 'md:grid-cols-[220px_1fr]' : 'grid-cols-1'}`}>
          {isSidebarOpen && ( 
            <aside className="border-r md:block h-full">
              <Sidebar />
            </aside>
          )}
          <main className="flex-1 p-4">
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold">Reportabilidad</h1>
              <DropdownMenu 
                buttonText="Todos los departamentos"
                items={ValleysMock}
                onSelect={(item) => setSelectedItem(item)}
              />
              <div className="flex flex-row ">
                <div className="w-3/4 ml-4">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                  initialView="dayGridMonth"
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
                  events={calendarEvents}
                />
                </div>
                <div className="ml-12 mt-16 p-4 rounded-lg border w-1/6 h-70 text-2xl font-medium">
                  <h3 className="text-center font-bold">
                    Leyenda
                  </h3>
                  <div className="flex flex-col gap-8 mt-10 justify-center place">
                    <div className="flex flex-row font-light">
                      <div className="bg-[#54B87E] w-6 h-6 rounded-full mr-2"></div>
                      <h3 className="text-[#7D7D7D] text-sm font-medium">
                        Valle del Huasco
                      </h3>
                    </div>
                    <div className="flex flex-row font-light">
                      <div className="bg-[#B0A3CC] w-6 h-6 rounded-full mr-2"></div>
                      <h3 className="text-[#7D7D7D] text-sm font-medium">
                        Valle de Copiapó
                     </h3>
                      </div>
                    <div className="flex flex-row font-light">
                      <div className="bg-[#EFA585] w-6 h-6 rounded-full mr-2"></div>
                      <h3 className="text-[#7D7D7D] text-sm font-medium">
                        Valle del Elqui
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        )}
      </div>
    );
  }