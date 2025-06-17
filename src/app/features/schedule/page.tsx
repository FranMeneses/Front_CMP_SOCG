'use client';
import GanttChart, { GanttChartRef } from "@/components/Charts/Gantt/GanttChart";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import LoadingSpinner from "@/components/LoadingSpinner";
import DropdownMenu from "@/components/Dropdown";
import { Button } from "@/components/ui/button";
import { useSchedule } from "./hooks/useSchedule";
import { useHooks } from "../hooks/useHooks";
import { useState, useRef } from "react";
import Image from "next/image";

export default function Schedule() {
  const { loading, isSidebarOpen, toggleSidebar, subtasks } = useSchedule();
  const { userRole } = useHooks();
  const [viewMode, setViewMode] = useState<"Day" | "Week" | "Month">("Day");
  const ganttRef = useRef<GanttChartRef>(null);

  const handleTodayClick = () => {
    if (ganttRef.current) {
      ganttRef.current.scrollToToday();
    } 
  };

  return (
    <div className="h-screen w-full bg-[#F2F2F2] flex flex-col">
      <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} data-test-id="header"/>
      {loading ? (
        <div className="flex-1 flex items-center justify-center" data-test-id="loading-spinner">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {isSidebarOpen && (
            <aside
              className="w-[220px] border-r bg-white flex-shrink-0"
              data-test-id="sidebar"
            >
              <Sidebar userRole={userRole} onNavClick={toggleSidebar} />
            </aside>
          )}
          <main className="flex-1 bg-[#F2F2F2] font-[Helvetica] flex flex-col overflow-hidden px-8 lg:px-12 xl:px-16 py-6">
            <div className="flex-1 min-h-0">
              <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
                <div className="flex flex-row gap-4 items-center px-6 pt-6 pb-4 border-b border-gray-200">
                  <Image
                    src={'/Caja4GRP.png'}
                    alt="Schedule Icon"
                    width={98}
                    height={98}
                  />
                  <h1 className="text-3xl font-bold">Plan de trabajo</h1>
                </div>
                
                <div className="p-4 border-b border-gray-200 flex-shrink-0">
                  <div className="flex justify-between items-center">
                    <div className="w-auto min-w-[180px]">
                      <DropdownMenu
                        buttonText={viewMode === "Day" ? "Día" : viewMode === "Week" ? "Semana" : "Mes"}
                        items={["Día", "Semana", "Mes"]}
                        onSelect={(item: string) => {
                          if (item === "Día") setViewMode("Day");
                          else if (item === "Semana") setViewMode("Week");
                          else if (item === "Mes") setViewMode("Month");
                        }}
                      />
                    </div>
                    <Button 
                      onClick={handleTodayClick}
                      variant="outline"
                      className="text-sm"
                    >
                      Hoy
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 min-h-0">
                  <GanttChart 
                    ref={ganttRef}
                    subtasks={subtasks} 
                    viewMode={viewMode}
                    data-test-id="gantt-chart"
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}