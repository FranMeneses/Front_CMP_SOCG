'use client';
import PieChart from "@/components/Charts/PieChart";
import BarChart from "@/components/Charts/BarChart";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useResume } from "./hooks/useResume";
import { usePieChart } from "./hooks/usePieChart";
import { useBarChart } from "./hooks/useBarChart";
import { useComboChart } from "./hooks/useComboChart";
import { useEffect, useState } from "react";
import ComboChart from "@/components/Charts/ComboChart";

// TODO: ARREGLAR BUG VISUAL DE COMBO CHART

export default function ResumeRelationship() {
  const {
    loading: resumeLoading,
    tasksData,
    selectedLegend,
    formattedBudget,
    formattedExpenses,
    CopiapoData,
    HuascoData,
    ElquiData,
    handleLegendClick,
  } = useResume();

  const {pieChartData} = usePieChart();
  const {barChartData, loading: barChartLoading} = useBarChart();
  const {comboChartData, loading: comboChartLoading} = useComboChart();
  
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
      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
        <div className="bg-[#00B7FF] p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl lg:text-5xl text-white font-bold mb-1">{tasksData.length || 0}</p>
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

      {/* Gráficos Pie y Bar  */}
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
        <div className="bg-white p-4 rounded-lg shadow min-w-0">
          <h2 className="font-[Helvetica] font-bold text-xl lg:text-2xl mb-4">Tareas por línea de Inversión</h2>
          <div className="w-full h-80 lg:h-96">
            <BarChart
              chartType="investment-lines"
              data={barChartData}
              selectedLegend={selectedLegend}
              onLegendClick={handleLegendClick}
              data-test-id="bar-chart"
            />
          </div>
        </div>
      </div>

      {/* Planes de trabajo por valles */}
      <div className="bg-white p-4 rounded-lg shadow min-w-0">
        <h2 className="font-[Helvetica] font-bold text-xl lg:text-2xl mb-6">Avance plan de trabajo valles</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Plan de trabajo Copiapó */}
          <div className="flex flex-col p-4 border-r border-gray-400 lg:border-r lg:last:border-r-0">
            <div className="w-full h-64 lg:h-80 xl:h-96">
              <PieChart
                data={CopiapoData}
                selectedLegend={""}
                onLegendClick={handleLegendClick}
                data-test-id="pie-chart-copiapo"
                title="Plan de trabajo Copiapó"
                titleSize={16}
                font="Helvetica"
              />
            </div>
          </div>
          
          {/* Plan de trabajo Huasco */}
          <div className="flex flex-col p-4 border-r border-gray-400 lg:border-r lg:last:border-r-0 border-t border-gray-400 lg:border-t-0">
            <div className="w-full h-64 lg:h-80 xl:h-96">
              <PieChart
                data={HuascoData}
                selectedLegend={""}
                onLegendClick={handleLegendClick}
                data-test-id="pie-chart-huasco"
                title="Plan de trabajo Huasco"
                titleSize={16}
                font="Helvetica"
              />
            </div>
          </div>
          
          {/* Plan de trabajo Elqui */}
          <div className="flex flex-col p-4 border-t border-gray-300 lg:border-t-0">
            <div className="w-full h-64 lg:h-80 xl:h-96">
              <PieChart
                data={ElquiData}
                selectedLegend={""}
                onLegendClick={handleLegendClick}
                data-test-id="pie-chart-elqui"
                title="Plan de trabajo Elqui"
                titleSize={16}
                font="Helvetica"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}