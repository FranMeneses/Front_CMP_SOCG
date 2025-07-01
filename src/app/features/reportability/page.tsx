'use client'
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import './styles/index.css';
import DropdownMenu from "@/components/Dropdown";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ValleyColors, CommunicationsColors, AllColors } from "@/constants/colors";
import Calendar from "@/components/Calendar/Calendar";
import SmallCalendar from "@/components/Calendar/SmallCalendar";
import { Legend } from "../../../components/Reportability/Legend";
import { useReportability } from "./hooks/useReportability";
import { useHooks } from "../hooks/useHooks";
import { useEffect, useState } from "react";
import TaskResume from "../../../components/Reportability/TaskResume";
import { Months } from "@/constants/months";
import { IProcess } from "@/app/models/IProcess";
import Image from "next/image";


export default function Reportability() {
  const {
    toggleSidebar,
    handleDropdownSelect,
    loading: reportabilityLoading,
    isSidebarOpen,
    calendarView,
    calendarEvents,
    selectedItem,
    filteredProcessesNames,
    ProcessesNames,
    ValleysProcessesName,
    filteredProcesses,
    ValleysProcesses,
    filteredProcessesCommunications
  } = useReportability();

  const { userRole, isCommunicationsManager, isManager, handleLogout} = useHooks();
  
  const [isLoading, setIsLoading] = useState(true);
  const [month, setMonth] = useState<string>();
  const [year, setYear] = useState<number>();
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  useEffect(() => {
    if (!reportabilityLoading) {
      setIsLoading(false);
    }
  }, [reportabilityLoading]);

  const handleMonthChange = (year: number, month: number) => {
    setMonth(Months[month-1]);
    setYear(year);
    setCurrentCalendarDate(new Date(year, month - 1, 1));
  };

  const nextMonth = new Date(currentCalendarDate);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  return (
    <div className="min-h-screen w-full">
      <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} data-test-id="header"/>
      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(100vh-5rem)]" data-test-id="loading-spinner">
          <LoadingSpinner />
        </div>
      ) : (
        <div
          className={`grid ${
            isSidebarOpen ? "grid-cols-[220px_1fr]" : "grid-cols-1"
          }`}
        >
          {isSidebarOpen && (
            <aside
              className={`border-r ${
                isSidebarOpen
                  ? "fixed top-[5rem] left-0 w-full h-[calc(100vh-5rem)] bg-white z-1000 sm:top-0 sm:left-0 sm:w-[220px] sm:relative sm:h-auto sm:bg-transparent overflow-y-auto"
                  : ""
              }`}
              data-test-id="sidebar"
            >
              <Sidebar userRole={userRole} onNavClick={toggleSidebar} handleLogout={handleLogout}/>
            </aside>
          )}
          <main className="flex-1 bg-[#F2F2F2] font-[Helvetica]">
            <div className="flex flex-col gap-6 w-full font-[Helvetica] min-w-0 px-8 lg:px-12 xl:px-16 py-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex flex-row gap-4 items-center">
                  <Image
                    src={'/Caja3GRP.png'}
                    alt="Programación Icon"
                    width={80}
                    height={80}
                  />
                  <h1 className="text-3xl font-bold">PROGRAMACIÓN DE ACTIVIDADES</h1>
                </div>
                {(isManager || userRole === "Encargado Cumplimiento" || isCommunicationsManager || userRole === "Admin") && (
                  <div className="mt-4">
                    <DropdownMenu
                      buttonText={"Transversales"}
                      items={isCommunicationsManager ? filteredProcessesNames : (userRole === "Encargado Cumplimiento" || userRole === 'Admin')? filteredProcessesNames : ValleysProcessesName}
                      onSelect={(item) => handleDropdownSelect(item)}
                      data-test-id="dropdown-menu"
                    />
                  </div>
                )}
              </div>
              
              {/* Layout principal */}
              <div className="flex flex-col lg:flex-row gap-6">
                {(isManager || userRole === "Encargado Cumplimiento" || isCommunicationsManager || userRole === 'Admin') && (
                  <div className="w-full lg:w-72 bg-white rounded-lg shadow">
                    <SmallCalendar 
                      month={nextMonth.getMonth()}
                      year={nextMonth.getFullYear()}
                      events={calendarEvents}
                    />
                    <div className="border-t border-gray-200 mx-3"></div>
                    <div className="p-4">
                      <h2 className="text-sm uppercase text-gray-500 font-medium mb-3">
                        {isCommunicationsManager ? 'PROCESOS' : 'VALLES'}
                      </h2>
                      <Legend 
                        valley={isCommunicationsManager ? filteredProcessesNames : (userRole === "Encargado Cumplimiento" || userRole === 'Admin') ? ProcessesNames : ValleysProcessesName.filter((process:string) => process !== "Transversales")} 
                        valleyColors={isCommunicationsManager ? CommunicationsColors : (userRole === "Encargado Cumplimiento" || userRole === 'Admin') ? AllColors: ValleyColors} 
                      />
                    </div>
                  </div>
                )}
                
                {/* Calendario principal y TaskResume */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                      <Calendar 
                        calendarView={calendarView} 
                        events={calendarEvents} 
                        data-test-id="calendar"
                        onMonthChange={handleMonthChange}
                      />
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow"> 
                      <TaskResume 
                        calendarEvents={calendarEvents}
                        valleys={ (userRole === "Encargado Cumplimiento" || userRole === 'Admin') ? filteredProcesses : isCommunicationsManager ? filteredProcessesCommunications : ValleysProcesses.filter((process:IProcess) => process.name !== "Transversales")} 
                        selectedValley={selectedItem}
                        valleyNames={ (userRole === "Encargado Cumplimiento" || userRole === 'Admin') ? ProcessesNames : isCommunicationsManager ? filteredProcessesNames : ValleysProcessesName.filter((process:IProcess) => process.name !== "Transversales")}
                        ValleyColors={ (userRole === "Encargado Cumplimiento" || userRole === 'Admin') ? AllColors : isCommunicationsManager ? CommunicationsColors : ValleyColors}
                        month={month || ""}
                        year={year || 0}
                      />
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