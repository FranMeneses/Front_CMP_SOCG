'use client';
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import LineChart from "@/components/Charts/LineChart";
import { tasksMock } from "../../../../mocks/tasksMock";
import PieChart from "@/components/Charts/PieChart";
import BarChart from "@/components/Charts/BarChart";
import { barChartDataSummaryMock, chartDataSummaryMock, pieChartDataSummaryMock } from "../../../../mocks/chartDataSummaryMock";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadinSpinner";
import DynamicTable from "@/app/features/resume/components/DynamicTable";

export default function Resume() {
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [tasks, setTasks] = useState([]); 
  const [subtasks, setSubtasks] = useState([]);
  const [selectedLegend, setSelectedLegend] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

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
      <Header toggleSidebar={toggleSidebar} />
      <>
      {loading ? 
      (
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner/>
        </div>
      )
      : 
      ( 
        <div className={`grid ${isSidebarOpen ? 'md:grid-cols-[220px_1fr]' : 'grid-cols-1'} text-black bg-white`}>
          {isSidebarOpen && ( 
            <aside className="border-r md:block h-full">
              <Sidebar />
            </aside>
          )}
          <main className="flex-1 p-4">
          <h1 className="text-2xl font-bold mb-4">Resumen</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4.5">
                <div className="w-full aspect-w-16 aspect-h-9 mx-auto">
                  <LineChart 
                    data={chartDataSummaryMock} 
                    selectedLegend={selectedLegend} 
                    onLegendClick={handleLegendClick} 
                    />
                </div>
                <div className="w-full h-[50%] mx-auto">
                  <PieChart data={pieChartDataSummaryMock} 
                    selectedLegend={selectedLegend} 
                    onLegendClick={handleLegendClick} 
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-4 w-full border border-gray-300">
                  <h1 className="text-2xl font-bold mt-4 ml-3">Tareas</h1>
                  <DynamicTable
                    tasks={tasksMock} 
                    selectedTaskId={selectedTaskId} 
                    onTaskClick={handleTaskClick}
                    userRole="manager" 
                  />
                </div>

                <div className="w-full h-full mx-auto">
                  <BarChart 
                    data={barChartDataSummaryMock} 
                    selectedLegend={selectedLegend}
                    onLegendClick={handleLegendClick}
                  />
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