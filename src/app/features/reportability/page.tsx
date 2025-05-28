'use client'
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import './styles/index.css';
import DropdownMenu from "@/components/Dropdown";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ValleyColors } from "@/constants/valleys";
import Calendar from "@/components/Calendar/Calendar";
import { Legend } from "./components/Legend";
import { useReportability } from "./hooks/useReportability";
import { useHooks } from "../hooks/useHooks";
import { useData } from "@/context/DataContext";
import { useEffect, useState } from "react";
import TaskResume from "./components/TaskResume";
import { Months } from "@/constants/months";

export default function Reportability() {
  const {
    toggleSidebar,
    handleDropdownSelect,
    loading: reportabilityLoading,
    isSidebarOpen,
    calendarView,
    calendarEvents,
  } = useReportability();

  const { userRole } = useHooks();
  const { valleys } = useData();
  
  const [isLoading, setIsLoading] = useState(true);
  const [month, setMonth] = useState<string>();
  const [year, setYear] = useState<number>();
  const valleyNames = valleys ? valleys.map(valley => valley.name) : [];

  useEffect(() => {
    if (!reportabilityLoading) {
      setIsLoading(false);
    }
  }, [reportabilityLoading]);

  const handleMonthChange = (year: number, month: number) => {
    setMonth(Months[month-1]);
    setYear(year);
  };

  return (
    <div className="overflow-x-hidden">
      <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} data-test-id="header"/>
      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(100vh-5rem)]" data-test-id="loading-spinner">
          <LoadingSpinner />
        </div>
      ) : (
        <div
          className={`grid h-screen overflow-hidden ${
            isSidebarOpen ? "grid-cols-[220px_1fr]" : "grid-cols-1"
          }`}
          style={{ height: "calc(100vh - 5rem)" }}
        >
          {isSidebarOpen && (
            <aside
              className={`border-r h-full ${
                isSidebarOpen
                  ? "fixed top-[5rem] left-0 w-full h-[calc(100vh-5rem)] bg-white z-2000 sm:top-0 sm:left-0 sm:w-[220px] sm:relative sm:h-auto sm:bg-transparent"
                  : ""
              }`}
              data-test-id="sidebar"
            >
              <Sidebar userRole={userRole} onNavClick={toggleSidebar} />
            </aside>
          )}
          <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
            <div className="flex flex-col bg-white rounded-lg shadow overflow-y-auto">
              <div className="p-4 pb-4 border-b">
                <h1 className="text-2xl font-bold mb-4">Programación y reportabilidad</h1>
                <DropdownMenu
                  buttonText="Transversal"
                  items={valleyNames} 
                  onSelect={(item) => handleDropdownSelect(item)}
                  data-test-id="dropdown-menu"
                />
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-4 border-r overflow-y-auto">
                  <div className="flex flex-col w-full">
                    <Calendar 
                      calendarView={calendarView} 
                      events={calendarEvents} 
                      data-test-id="calendar"
                      onMonthChange={handleMonthChange}
                    />
                    <div className="w-full mt-4">
                      <TaskResume 
                        calendarEvents={calendarEvents}
                        valleys={valleys}
                        valleyNames={valleyNames}
                        ValleyColors={ValleyColors}
                        month={month || ""}
                        year={year || 0}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-72 p-4 border-t md:border-t-0 md:border-l">
                  <div>
                    <h2 className="text-sm uppercase text-gray-500 font-medium mb-3">
                      Valles
                    </h2>
                    <Legend valley={valleyNames} valleyColors={ValleyColors} />
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