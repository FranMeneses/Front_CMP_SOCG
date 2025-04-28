'use client';
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import LineChart from "@/components/Charts/LineChart";
import PieChart from "@/components/Charts/PieChart";
import BarChart from "@/components/Charts/BarChart";
import DynamicTable from "@/app/features/resume/components/DynamicTable";
import LoadingSpinner from "@/components/LoadinSpinner";

import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_TASKS } from "@/app/api/resume";

import { tasksMock } from "../../../../mocks/tasksMock";
import { barChartDataSummaryMock, chartDataSummaryMock, pieChartDataSummaryMock, pieChartDataSummarySpecialistMock } from "../../../../mocks/chartDataSummaryMock";

export default function Resume() {
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string>("encargado cumplimiento"); 
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); 
  const [selectedLegend, setSelectedLegend] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  // const {data, loading: queryLoading, error} = useQuery(GET_TASKS)
  
  const handleLegendClick = (legend: string) => {
    setSelectedLegend((prev) => (prev === legend ? null : legend)); 
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId((prev) => (prev === taskId ? null : taskId)); 
  };

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
      <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} data-test-id="header"/>
      <>
        {loading ? (
          <div className="flex items-center justify-center" data-test-id="loading-spinner">
            <LoadingSpinner />
          </div>
        ) : (
          <div
            className={`grid h-screen overflow-hidden ${isSidebarOpen ? "grid-cols-[220px_1fr]" : "grid-cols-1"}`} style={{height: "calc(100vh - 5rem)"}} 
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
              <h1 className="text-2xl font-bold mb-4">Resumen</h1>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col md:flex-row gap-8 items-stretch">
                  <div className="w-full md:w-1/2 flex flex-col">
                    <div className="w-full aspect-w-16 aspect-h-9 mx-auto h-full">
                      <LineChart
                        data={chartDataSummaryMock}
                        selectedLegend={selectedLegend}
                        onLegendClick={handleLegendClick}
                        data-test-id="line-chart"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 flex flex-col">
                    <div className="flex flex-col gap-4 w-full border border-gray-300 h-full">
                      <h1 className="text-2xl font-bold mt-4 ml-3">Tareas</h1>
                      <DynamicTable
                        tasks={tasksMock}
                        selectedTaskId={selectedTaskId}
                        onTaskClick={handleTaskClick}
                        userRole={userRole}
                        data-test-id="dynamic-table"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-stretch">
                  <div className="w-full md:w-1/2 flex flex-col">
                    <div className="w-full h-[300px] mx-auto">
                      <PieChart
                        userRole={userRole}
                        data={
                          userRole === "encargado cumplimiento"
                            ? pieChartDataSummarySpecialistMock
                            : pieChartDataSummaryMock
                        }
                        selectedLegend={selectedLegend}
                        onLegendClick={handleLegendClick}
                        data-test-id="pie-chart"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 flex flex-col">
                    <div className="w-full h-[300px] mx-auto">
                      <BarChart
                        data={barChartDataSummaryMock}
                        selectedLegend={selectedLegend}
                        onLegendClick={handleLegendClick}
                        data-test-id="bar-chart"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        )}
      </>
    </div>
  );
}