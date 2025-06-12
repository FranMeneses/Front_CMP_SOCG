'use client';
import PieChart from "@/components/Charts/PieChart";
import BarChart from "@/components/Charts/BarChart";
import DynamicTable from "../components/DynamicTable";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useHooks } from "../../hooks/useHooks";
import { useBarChart } from "../relationship/hooks/useBarChart";
import { useEffect, useState } from "react";
import ComboChart from "@/components/Charts/ComboChart";
import { useCommunicationResume } from "./hooks/useCommunicationResume";
import { usePieChartCommunications } from "./hooks/usePieChartCommunications";
import { useCommunicationComboChart } from "./hooks/useCommunicationComboChart";

export default function ResumeCommunications() {

  const {
    loading: resumeLoading,
    selectedLegend,
    selectedTaskId,
    tasksData,
    subtasks,
    formattedBudget,
    formattedExpenses,
    handleLegendClick,
    handleTaskClick,
  } = useCommunicationResume();

  const {pieChartData} = usePieChartCommunications();
  const {barChartData, loading: barChartLoading} = useBarChart();
  const {comboChartData, loading: comboChartLoading} = useCommunicationComboChart();
  const {userRole} = useHooks();
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!resumeLoading && !barChartLoading && !comboChartLoading) {
      setIsLoading(false);
    }
  }, [resumeLoading, barChartLoading, comboChartLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full" data-test-id="loading-spinner">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto font-[Helvetica]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#e3affbe0] p-4 rounded-lg shadow">
          <p className="text-4xl font-semibold ">{tasksData?.length || 0}</p>
          <h3 className="text-[#070707] font-light text-sm mb-1">Iniciativas en desarrollo</h3> 
        </div>
        <div className="bg-[#b5f1a8e0] p-4 rounded-lg shadow">
          <p className="text-4xl font-semibold">{formattedBudget} USD</p>
          <h3 className="text-[#070707] font-light text-sm mb-1">Presupuesto total</h3> 
        </div>
        <div className="bg-[#f6a5a5e0] p-4 rounded-lg shadow">  
          <p className="text-4xl font-semibold">{formattedExpenses} USD</p>
          <h3 className="text-[#070707] font-light text-sm mb-1">Gasto total</h3> 
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="w-5/6 aspect-w-16 aspect-h-9 mx-auto h-full">
          <ComboChart
            data={comboChartData}
            selectedLegend={selectedLegend}
            onLegendClick={handleLegendClick}
            data-test-id="combo-chart"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="w-full md:h-[300px] lg:h-[500px] mx-auto">
            <PieChart
              data={ pieChartData }
              selectedLegend={selectedLegend}
              onLegendClick={handleLegendClick}
              data-test-id="pie-chart"
            />
          </div>
        </div>
        {/* <div className="bg-white p-4 rounded-lg shadow">
          <div className="w-full md:h-[300px] lg:h-[500px] mx-auto">
            <BarChart
              data={barChartData}
              selectedLegend={selectedLegend}
              onLegendClick={handleLegendClick}
              data-test-id="bar-chart"
            />
          </div>
        </div> */}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Detalle de Tareas</h2>
        <DynamicTable
          tasks={tasksData || []}
          subtasks={subtasks}
          selectedTaskId={selectedTaskId}
          onTaskClick={handleTaskClick}
          userRole={userRole}
          data-test-id="dynamic-table"
        />
      </div>
    </div>
  ); 
}