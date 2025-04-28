'use client'
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import './styles/index.css';
import DropdownMenu from "@/components/Dropdown";
import LoadingSpinner from "@/components/LoadinSpinner";
import { Valleys, ValleyColors } from "@/constants/valleys";
import Calendar from "@/components/Calendar/Calendar";
import { Legend } from "./components/Legend";
import { useReportability } from "./hooks/useReportability";
import { useHooks } from "../hooks/useHooks";

export default function Reportability() {
  const {
    loading,
    isSidebarOpen,
    toggleSidebar,
    setSelectedItem,
    calendarView,
    calendarEvents,
  } = useReportability();

  const {userRole} = useHooks(); 

  return (
    <div className="overflow-x-hidden">
      <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} data-test-id="header"/>
      {loading ? (
        <div className="flex items-center justify-center" data-test-id="loading-spinner">
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
          <main className="flex-1 p-4 overflow-y-auto">
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold">Reportabilidad</h1>
              <DropdownMenu
                buttonText="Transversal"
                items={Valleys}
                onSelect={(item) => setSelectedItem(item)}
                data-test-id="dropdown-menu"
              />
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-3/4 md:ml-4">
                  <Calendar calendarView={calendarView} events={calendarEvents} data-test-id="calendar"/>
                </div>
                <div className="w-full md:w-1/6 md:ml-12 mt-4 md:mt-16 p-4 rounded-lg border text-2xl font-medium">
                  <Legend valley={Valleys} valleyColors={ValleyColors} />
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}