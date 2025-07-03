'use client';
import PieChart from "@/components/Charts/PieChart";
import BarChart from "@/components/Charts/BarChart";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useResume } from "./hooks/useResume";
import { usePieChart } from "./hooks/usePieChart";
import { useBarChart } from "./hooks/useBarChart";
import { useComboChart } from "./hooks/useComboChart";
import { useEffect, useState, useMemo } from "react";
import ComboChart from "@/components/Charts/ComboChart";
import Image from "next/image";
import DropdownMenu from "@/components/Dropdown";
import { Months } from "@/constants/months";

export default function ResumeRelationship() {
  // Agregar opción 'Total' al inicio de los meses
  const monthsWithTotal = ["Total", ...Months];
  const [selectedMonth, setSelectedMonth] = useState<string>(monthsWithTotal[0]); // Por defecto el mes actual

  // Si el usuario selecciona 'Total', pasar undefined al hook useResume
  const mesParaHook = selectedMonth === "Total" ? undefined : selectedMonth;

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
  } = useResume(mesParaHook);

  const {pieChartData} = usePieChart();
  const {barChartData, loading: barChartLoading} = useBarChart();
  const {comboChartData, loading: comboChartLoading} = useComboChart();
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!resumeLoading && !barChartLoading && !comboChartLoading ) {
      setIsLoading(false);
    }
  }, [resumeLoading, barChartLoading, comboChartLoading]);

  // Memoizar datos para evitar renders innecesarios
  const memoPieChartData = useMemo(() => pieChartData, [pieChartData]);
  const memoBarChartData = useMemo(() => barChartData, [barChartData]);
  const memoComboChartData = useMemo(() => comboChartData, [comboChartData]);
  const memoTasksData = useMemo(() => tasksData, [tasksData]);
  const memoCopiapoData = useMemo(() => CopiapoData, [CopiapoData]);
  const memoHuascoData = useMemo(() => HuascoData, [HuascoData]);
  const memoElquiData = useMemo(() => ElquiData, [ElquiData]);

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
        <h1 className="text-3xl font-bold">RESUMEN RELACIONAMIENTO</h1>
      </div>
      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
        <div className="bg-[#00B7FF] p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl lg:text-5xl text-white font-bold mb-1">{memoTasksData.length || 0}</p>
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

      {/* Gráficos Pie y Bar  */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-w-0">
        <div className="bg-white p-4 rounded-lg shadow min-w-0">
          <h2 className="font-[Helvetica] font-bold text-xl lg:text-2xl mb-4 text-start">INICIATIVAS DE RELACIONAMIENTO</h2>
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
        <div className="bg-white p-4 rounded-lg shadow min-w-0">
          <h2 className="font-[Helvetica] font-bold text-xl lg:text-2xl mb-4">INICIATIVAS POR LÍNEA DE INVERSIÓN</h2>
          <div className="w-full h-80 lg:h-96">
            {barChartLoading ? (
              <div className="flex items-center justify-center h-full"><LoadingSpinner /></div>
            ) : (
              <BarChart
                chartType="investment-lines"
                data={memoBarChartData}
                selectedLegend={selectedLegend}
                onLegendClick={handleLegendClick}
                data-test-id="bar-chart"
              />
            )}
          </div>
        </div>
      </div>

      {/* Planes de trabajo por valles */}
      <div className="bg-white p-4 rounded-lg shadow min-w-0">
        <h2 className="font-[Helvetica] font-bold text-xl lg:text-2xl mb-6">AVANCE PLAN DE TRABAJO</h2>
        {/* Filtro de mes debajo del título */}
        <div className="flex flex-row gap-4 items-start mb-6 w-1/3">
          <DropdownMenu
            buttonText="Selecciona un mes"
            items={monthsWithTotal}
            onSelect={setSelectedMonth}
            selectedValue={selectedMonth}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Plan de trabajo Copiapó */}
          <div className="flex flex-col p-4 border-r border-gray-400 lg:border-r lg:last:border-r-0">
            <div className="w-full h-64 lg:h-80 xl:h-96">
              {CopiapoData ? (
                <PieChart
                  data={memoCopiapoData}
                  selectedLegend={""}
                  onLegendClick={handleLegendClick}
                  data-test-id="pie-chart-copiapo"
                  title="PLAN DE TRABAJO COPIAPÓ"
                  titleSize={16}
                  font="Helvetica"
                />
              ) : (
                <div className="flex items-center justify-center h-full"><LoadingSpinner /></div>
              )}
            </div>
          </div>
          
          {/* Plan de trabajo Huasco */}
          <div className="flex flex-col p-4 border-r border-gray-400 lg:border-r lg:last:border-r-0 border-t lg:border-t-0">
            <div className="w-full h-64 lg:h-80 xl:h-96">
              {HuascoData ? (
                <PieChart
                  data={memoHuascoData}
                  selectedLegend={""}
                  onLegendClick={handleLegendClick}
                  data-test-id="pie-chart-huasco"
                  title="PLAN DE TRABAJO HUASCO"
                  titleSize={16}
                  font="Helvetica"
                />
              ) : (
                <div className="flex items-center justify-center h-full"><LoadingSpinner /></div>
              )}
            </div>
          </div>
          
          {/* Plan de trabajo Elqui */}
          <div className="flex flex-col p-4 border-t border-gray-300 lg:border-t-0">
            <div className="w-full h-64 lg:h-80 xl:h-96">
              {ElquiData ? (
                <PieChart
                  data={memoElquiData}
                  selectedLegend={""}
                  onLegendClick={handleLegendClick}
                  data-test-id="pie-chart-elqui"
                  title="PLAN DE TRABAJO ELQUI"
                  titleSize={16}
                  font="Helvetica"
                />
              ) : (
                <div className="flex items-center justify-center h-full"><LoadingSpinner /></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}