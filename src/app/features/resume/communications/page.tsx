'use client';
import PieChart from "@/components/Charts/PieChart";
import BarChart from "@/components/Charts/BarChart";
import DynamicTable from "../../../../components/Resume/DynamicTable";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useHooks } from "../../hooks/useHooks";
import { useEffect, useState, useMemo } from "react";
import ComboChart from "@/components/Charts/ComboChart";
import { useCommunicationResume } from "./hooks/useCommunicationResume";
import { usePieChartCommunications } from "./hooks/usePieChartCommunications";
import { useCommunicationComboChart } from "./hooks/useCommunicationComboChart";
import { useCommunicationBarChart } from "./hooks/useCommunicationBarChart";
import Image from "next/image";

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

  // Memoizar datos para evitar renders innecesarios
  const memoPieChartData = useMemo(() => pieChartData, [pieChartData]);
  const memoBarChartData = useMemo(() => barChartData, [barChartData]);
  const memoComboChartData = useMemo(() => comboChartData, [comboChartData]);
  const memoTasksData = useMemo(() => tasksData, [tasksData]);
  const memoSubtasks = useMemo(() => subtasks, [subtasks]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full" data-test-id="loading-spinner">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full font-[Helvetica] min-w-0 px-8 lg:px-12 xl:px-16">
      <div className="flex flex-row gap-4 items-center px-6 pt-6 pb-4 bg-white rounded-lg shadow-md">
        <Image
          src={'/Caja5GRP.png'}
          alt="RelatioshipResume Icon"
          width={95}
          height={95}
        />
        <h1 className="text-3xl font-bold">RESUMEN COMUNICACIONES</h1>
      </div>
      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
        <div className="bg-[#00B7FF] p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl lg:text-5xl text-white font-bold mb-1">{memoTasksData?.length || 0}</p>
              <h3 className="text-white font-medium text-sm lg:text-lg">INICIATIVAS EN DESARROLLO</h3>
            </div>
          </div>
        </div>
        <div className="bg-[#00B837] p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl lg:text-5xl text-white font-bold mb-1">{formattedBudget} USD</p>
              <h3 className="text-white font-medium text-sm lg:text-lg">PRESUPUESTO TOTAL</h3>
            </div>
          </div>
        </div>
        <div className="bg-[#D30023] p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl lg:text-5xl text-white font-bold mb-1">{formattedExpenses} USD</p>
              <h3 className="text-white font-medium text-sm lg:text-lg">GASTO TOTAL</h3>
            </div>
          </div>
        </div>
      </div>
      {/* ComboChart */}
      <div className="bg-white p-4 rounded-lg shadow-lg min-w-0">
        <div className="w-full h-96 lg:h-[500px] xl:h-[600px]">
          {comboChartLoading ? (
            <div className="flex items-center justify-center h-full"><LoadingSpinner /></div>
          ) : (
            <ComboChart
              data={memoComboChartData}
              selectedLegend={selectedLegend}
              onLegendClick={handleLegendClick}
              data-test-id="combo-chart"
            />
          )}
        </div>
      </div>
      {/* Gráficos PieChart y BarChart */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-w-0">
        <div className="bg-white p-4 rounded-lg shadow min-w-0">
          <h2 className="font-[Helvetica] font-bold text-xl lg:text-2xl mb-4 text-start">INICIATIVAS DE COMUNICACIONES Y ASUNTOS PÚBLICOS</h2>
          <div className="w-full h-80 lg:h-96 flex justify-center items-center">
            <div className="w-full max-w-md h-full">
              {pieChartData ? (
                <PieChart
                  data={memoPieChartData}
                  selectedLegend={selectedLegend}
                  onLegendClick={handleLegendClick}
                  data-test-id="pie-chart"
                  title=""
                  titleSize={18}
                  font="Helvetica"
                />
              ) : (
                <div className="flex items-center justify-center h-full"><LoadingSpinner /></div>
              )}
            </div>
          </div>
        </div>
        {/* BarChart - Tareas por línea de Inversión */}
        <div className="bg-white p-4 rounded-lg shadow min-w-0">
          <h2 className="font-[Helvetica] font-bold text-xl lg:text-2xl mb-4 text-start">GASTOS POR PROCESOS</h2>
          <div className="w-full h-80 lg:h-96">
            {barChartLoading ? (
              <div className="flex items-center justify-center h-full"><LoadingSpinner /></div>
            ) : (
              <BarChart
                chartType="departments"
                data={memoBarChartData}
                selectedLegend={selectedLegend}
                onLegendClick={handleLegendClick}
                data-test-id="bar-chart"
              />
            )}
          </div>
        </div>
      </div>
      {/* Tabla de tareas */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-[Helvetica] font-bold text-xl lg:text-2xl mb-4">DETALLE DE TAREAS</h2>
        {resumeLoading ? (
          <div className="flex items-center justify-center h-32"><LoadingSpinner /></div>
        ) : (
          <DynamicTable
            tasks={memoTasksData || []}
            subtasks={memoSubtasks}
            selectedTaskId={selectedTaskId}
            onTaskClick={handleTaskClick}
            userRole={userRole}
            data-test-id="dynamic-table"
          />
        )}
      </div>
    </div>
  );
}