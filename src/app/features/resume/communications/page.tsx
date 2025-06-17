'use client';
import PieChart from "@/components/Charts/PieChart";
import BarChart from "@/components/Charts/BarChart";
import DynamicTable from "../../../../components/Resume/DynamicTable";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useHooks } from "../../hooks/useHooks";
import { useEffect, useState } from "react";
import ComboChart from "@/components/Charts/ComboChart";
import { useCommunicationResume } from "./hooks/useCommunicationResume";
import { usePieChartCommunications } from "./hooks/usePieChartCommunications";
import { useCommunicationComboChart } from "./hooks/useCommunicationComboChart";
import { useCommunicationBarChart } from "./hooks/useCommunicationBarChart";

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
  const {barChartData, loading: barChartLoading} = useCommunicationBarChart();
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
    <div className="flex flex-col gap-6 w-full font-[Helvetica] min-w-0 px-8 lg:px-12 xl:px-16">
      <h2 className="text-4xl font-bold my-4">Resumen de Comunicaciones</h2>
      {/* Tarjetas de métricas - Actualizadas con el mismo estilo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
        <div className="bg-[#00B7FF] p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl lg:text-5xl text-white font-bold mb-1">{tasksData?.length || 0}</p>
              <h3 className="text-white font-medium text-sm lg:text-lg">Iniciativas en desarrollo</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-[#00B837] p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl lg:text-5xl text-white font-bold mb-1">{formattedBudget} USD</p>
              <h3 className="text-white font-medium text-sm lg:text-lg">Presupuesto Total</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-[#D30023] p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl lg:text-5xl text-white font-bold mb-1">{formattedExpenses} USD</p>
              <h3 className="text-white font-medium text-sm lg:text-lg">Gasto Total</h3>
            </div>
          </div>
        </div>
      </div>

      {/* ComboChart */}
      <div className="bg-white p-4 rounded-lg shadow-lg min-w-0">
        <div className="w-full h-96 lg:h-[500px] xl:h-[600px]">
          <ComboChart
            data={comboChartData}
            selectedLegend={selectedLegend}
            onLegendClick={handleLegendClick}
            data-test-id="combo-chart"
          />
        </div>
      </div>

      {/* Gráficos PieChart y BarChart */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-w-0">
        <div className="bg-white p-4 rounded-lg shadow min-w-0">
          <h2 className="font-[Helvetica] font-bold text-xl lg:text-2xl mb-4 text-start">Iniciativas por Departamento</h2>
          <div className="w-full h-80 lg:h-96 flex justify-center items-center">
            <div className="w-full max-w-md h-full">
              <PieChart
                data={pieChartData}
                selectedLegend={selectedLegend}
                onLegendClick={handleLegendClick}
                data-test-id="pie-chart"
                title=""
                titleSize={18}
                font="Helvetica"
              />
            </div>
          </div>
        </div>

        {/* BarChart - Tareas por línea de Inversión */}
        <div className="bg-white p-4 rounded-lg shadow min-w-0">
          <h2 className="font-[Helvetica] font-bold text-xl lg:text-2xl mb-4 text-start">Gastos por Departamentos</h2>
          <div className="w-full h-80 lg:h-96">
            <BarChart
              chartType="departments"
              data={barChartData}
              selectedLegend={selectedLegend}
              onLegendClick={handleLegendClick}
              data-test-id="bar-chart"
            />
          </div>
        </div>
      </div>

      {/* Tabla de tareas */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-[Helvetica] font-bold text-xl lg:text-2xl mb-4">Detalle de Tareas</h2>
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