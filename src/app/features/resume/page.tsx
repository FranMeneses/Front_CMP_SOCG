'use client';
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import LineChart from "@/components/Charts/LineChart";
import PieChart from "@/components/Charts/PieChart";
import BarChart from "@/components/Charts/BarChart";
import DynamicTable from "@/app/features/resume/components/DynamicTable";
import LoadingSpinner from "@/components/LoadinSpinner";
import { useResume } from "./hooks/useResume";
import { useHooks } from "../hooks/useHooks";
import { usePieChart } from "./hooks/usePieChart";

import { pieChartDataSummarySpecialistMock } from "../../../../mocks/chartDataSummaryMock";
import { useBarChart } from "./hooks/useBarChart";
import { useLineChart } from "./hooks/useLineChart";

export default function Resume() {
  const {
    loading,
    data,
    isSidebarOpen,
    selectedLegend,
    selectedTaskId,
    subtasks,
    yearlyBudgetTotal,
    yearlyExpensesTotal,
    handleLegendClick,
    handleTaskClick,
    toggleSidebar,
  } = useResume();

  const {pieChartData} = usePieChart();
  const {barChartData} = useBarChart();
  const {lineChartData} = useLineChart();

  const {userRole} = useHooks()

  return (
    <div className="overflow-x-hidden">
      <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} data-test-id="header" />
      <>
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
            <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
              <div className="flex flex-col gap-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#e3affbe0] p-4 rounded-lg shadow">
                    <p className="text-4xl font-semibold ">{data?.tasks?.length || 0}</p>
                    <h3 className="text-[#070707] font-light text-sm mb-1">Iniciativas en desarrollo</h3> 
                  </div>
                  <div className="bg-[#b5f1a8e0] p-4 rounded-lg shadow">
                    <p className="text-4xl font-semibold">{yearlyBudgetTotal} USD</p>
                    <h3 className="text-[#070707] font-light text-sm mb-1">Presupuesto total</h3> 
                  </div>
                  <div className="bg-[#f6a5a5e0] p-4 rounded-lg shadow">  
                    <p className="text-4xl font-semibold">{yearlyExpensesTotal} USD</p>
                    <h3 className="text-[#070707] font-light text-sm mb-1">Gasto total</h3> 
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="w-5/6 aspect-w-16 aspect-h-9 mx-auto h-full">
                    <LineChart
                      data={lineChartData}
                      selectedLegend={selectedLegend}
                      onLegendClick={handleLegendClick}
                      data-test-id="line-chart"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="w-full md:h-[300px] lg:h-[500px] mx-auto">
                      <PieChart
                        userRole={userRole}
                        data={
                          userRole === "encargado cumplimiento"
                            ? pieChartDataSummarySpecialistMock
                            : pieChartData
                        }
                        selectedLegend={userRole === "gerente" || userRole === "superintendente" ? selectedLegend : null}
                        onLegendClick={userRole === "gerente" || userRole === "superintendente" ? handleLegendClick : undefined}
                        data-test-id="pie-chart"
                      />
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="w-full md:h-[300px] lg:h-[500px] mx-auto">
                      <BarChart
                        data={barChartData}
                        selectedLegend={selectedLegend}
                        onLegendClick={handleLegendClick}
                        data-test-id="bar-chart"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg font-semibold mb-4">Detalle de Tareas</h2>
                  <DynamicTable
                    tasks={data?.tasks || []}
                    subtasks={subtasks}
                    selectedTaskId={selectedTaskId}
                    onTaskClick={handleTaskClick}
                    userRole={userRole}
                    data-test-id="dynamic-table"
                  />
                </div>
              </div>
            </main>
          </div>
        )}
      </>
    </div>
  );
}