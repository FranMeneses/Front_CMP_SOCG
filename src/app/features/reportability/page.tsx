'use client'
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import './styles/index.css';
import DropdownMenu from "@/components/Dropdown";
import LoadingSpinner from "@/components/LoadinSpinner";
import { useState, useEffect } from "react";
import { Valleys, ValleyColors } from "@/constants/valleys";
import { tasksMock } from "../../../../mocks/tasksMock";
import Calendar from "@/components/Calendar/Calendar";
import { Legend } from "./components/Legend";


export default function Reportability() {

  const [loading, setLoading] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); 
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const [calendarView, setCalendarView] = useState<string>("dayGridMonth");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCalendarView("listWeek"); 
      } else {
        setCalendarView("dayGridMonth"); 
      }
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const calendarEvents = tasksMock.map((task) => ({
    id: task.code,
    title: task.name,
    start: task.endDate,
    end: task.endDate,
    progress: task.progress,
    valley: task.valley,
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
        <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen}/>
        {loading ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner/>
          </div>
        )
        :
        (
          <div className={`grid h-screen overflow-hidden ${isSidebarOpen ? "grid-cols-[220px_1fr]" : "grid-cols-1"}`} style={{height: "calc(100vh - 5rem)"}} >
          {isSidebarOpen && (
            <aside
              className={`border-r h-full ${
                isSidebarOpen
                  ? "fixed top-[5rem] left-0 w-full h-[calc(100vh-5rem)] bg-white z-2000 sm:top-0 sm:left-0 sm:w-[220px] sm:relative sm:h-auto sm:bg-transparent"
                  : ""
              }`}
            >
              <Sidebar />
            </aside>
          )}
          <main className="flex-1 p-4 overflow-y-auto">
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold">Reportabilidad</h1>
              <DropdownMenu 
                buttonText="Todos los departamentos"
                items={Valleys}
                onSelect={(item) => setSelectedItem(item)}
              />
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-3/4 md:ml-4">
                  <Calendar calendarView={calendarView} events={calendarEvents} />
                </div>
                <div className="w-full md:w-1/6 md:ml-12 mt-4 md:mt-16 p-4 rounded-lg border text-2xl font-medium">
                  <Legend valley={Valleys} valleyColors={ValleyColors}/>
                </div>
              </div>
            </div>
          </main>
        </div>
        )}
      </div>
    );
  }