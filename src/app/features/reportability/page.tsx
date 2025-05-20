'use client'
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import './styles/index.css';
import DropdownMenu from "@/components/Dropdown";
import LoadingSpinner from "@/components/LoadinSpinner";
import { ValleyColors } from "@/constants/valleys";
import Calendar from "@/components/Calendar/Calendar";
import { Legend } from "./components/Legend";
import { useReportability } from "./hooks/useReportability";
import { useHooks } from "../hooks/useHooks";
import { useData } from "@/context/DataContext";
import { useEffect, useState } from "react";

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
  const valleyNames = valleys ? valleys.map(valley => valley.name) : [];

  useEffect(() => {
    if (!reportabilityLoading) {
      setIsLoading(false);
    }
  }, [reportabilityLoading]);

  const handleMonthChange = (year: number, month: number) => {
  console.log(`Mes actual: ${month}/${year}`);
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
            <div className="flex flex-col h-full bg-white rounded-lg shadow">
              <div className="p-4 pb-4 border-b">
                <h1 className="text-2xl font-bold mb-4">Reportabilidad</h1>
                <DropdownMenu
                  buttonText="Transversal"
                  items={valleyNames} 
                  onSelect={(item) => handleDropdownSelect(item)}
                  data-test-id="dropdown-menu"
                />
              </div>
              <div className="flex flex-col md:flex-row h-full">
                <div className="flex-1 p-4 border-r">
                  <div className="overflow-x-auto">
                    <Calendar 
                      calendarView={calendarView} 
                      events={calendarEvents} 
                      data-test-id="calendar"
                      onMonthChange={handleMonthChange}
                    />
                    
                    <div className="mt-4 border-t pt-4">
                      <h3 className="text-lg font-medium mb-3">Resumen del Mes</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded shadow-sm border p-3">
                          <p className="text-sm text-gray-500">Tareas planeadas</p>
                          <p className="text-2xl font-bold">{calendarEvents?.length || 0}</p> {/*TODO: CAMBIAR POR FUNCIÓN CUANDO ESTE DISPONIBLE*/}
                        </div>
                        <div className="border p-3 rounded shadow-sm">
                          <p className="text-sm text-gray-500">Distribución por valle</p>
                          <div className="text-sm mt-1">
                            {valleys && valleyNames.map((valley) => {
                              const valleyEvents = calendarEvents?.filter(event => 
                                event.valley === valley
                              ).length || 0;
                              return (
                                <div key={valley} className="flex justify-between items-center mt-1">
                                  <span className="flex items-center">
                                    <span 
                                      className="inline-block w-3 h-3 rounded-full mr-2" 
                                      style={{backgroundColor: ValleyColors[valleyNames.indexOf(valley)] || '#888'}}
                                    ></span>
                                    {valley}:
                                  </span>
                                  <span className="font-medium">{valleyEvents}</span> {/*TODO: CAMBIAR POR FUNCIÓN CUANDO ESTE DISPONIBLE*/}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
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