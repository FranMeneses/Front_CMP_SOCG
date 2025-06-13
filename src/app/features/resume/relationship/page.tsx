'use client';
import PieChart from "@/components/Charts/PieChart";
import BarChart from "@/components/Charts/BarChart";
import DynamicTable from "../../../../components/Resume/DynamicTable";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useResume } from "./hooks/useResume";
import { useHooks } from "../../hooks/useHooks";
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
          <p className="text-4xl font-semibold ">{tasksData.length || 0}</p>
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
              data={pieChartData}
              selectedLegend={selectedLegend}
              onLegendClick={handleLegendClick}
              data-test-id="pie-chart"
              title="Iniciativas por Departamento"
              titleSize={24}
              font="Helvetica"
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
      <h2 className="font-[Helvetica] font-bold text-2xl">Avance plan de trabajo valles</h2>
       <div className="pb-6 border-b border-gray-300 md:h-[300px] lg:h-[500px] mx-auto">
          <PieChart
            data={CopiapoData}
            selectedLegend={""}
            onLegendClick={handleLegendClick}
            data-test-id="pie-chart-copiapo"
            title="Plan de trabajo Copiapó"
            titleSize={14}
            font="Helvetica"
          />
        </div>
        <div className="pb-6 border-b border-gray-300 md:h-[300px] lg:h-[500px] mx-auto">
          <PieChart
            data={HuascoData}
            selectedLegend={""}
            onLegendClick={handleLegendClick}
            data-test-id="pie-chart-huasco"
            title="Plan de trabajo Huasco"
            titleSize={14}
            font="Helvetica"
          />
        </div>
        <div className="md:h-[300px] lg:h-[500px] mx-auto">
          <PieChart
            data={ElquiData}
            selectedLegend={""}
            onLegendClick={handleLegendClick}
            data-test-id="pie-chart-elqui"
            title="Plan de trabajo Elqui"
            titleSize={14}
            font="Helvetica"
          />
        </div>
      </div>
    </div>
  );
}