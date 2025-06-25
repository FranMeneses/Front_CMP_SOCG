'use client';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useRef } from 'react';
import { getBarChartOptionsForDepartments, getBarChartOptionsForInvestmentLines, referenceLinePlugin } from './config/BarChartConfig';
import { BarChartData } from './interfaces/ChartInterfaces';
import { useResizeCharts } from './hooks/useResizeCharts';
import { Button } from '../ui/button';
import { useCharts } from '@/app/features/resume/hooks/useCharts';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type BarChartType = 'departments' | 'investment-lines';

const BarChart = ({
    data,
    selectedLegend,
    chartType = 'departments',
  }: {
    data: BarChartData;
    selectedLegend: string | null;
    onLegendClick: (legend: string) => void;
    chartType?: BarChartType;
  }) => {
    const chartRef = useRef<ChartJS | null>(null);
    const { downloadChart } = useCharts();
  
    useResizeCharts(chartRef);

    const filteredData = {
      ...data,
      datasets: selectedLegend
        ? data.datasets.filter((dataset) => dataset.id === selectedLegend)
        : data.datasets, 
    };

    const chartOptions = chartType === 'investment-lines' 
      ? getBarChartOptionsForInvestmentLines(filteredData)
      : getBarChartOptionsForDepartments(filteredData);
  
    return (
      <div className="w-full h-full flex flex-col bg-white font-[Helvetica] overflow-hidden">
        <div className="flex justify-end p-4 pb-2 flex-shrink-0">
          <Button
            variant={'default'}
            onClick={() => downloadChart(chartRef, 'bar-chart', 'jpeg')}
            className="flex items-center gap-2 px-4 py-2 bg-[#0068D1] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar Gráfico
          </Button>
        </div>
        <div className="flex-1 p-4 pt-0 min-h-0">
          <Bar
            ref={(instance) => {
              if (instance) {
                chartRef.current = instance;
              }
            }}
            data={filteredData}
            options={chartOptions}
            plugins={[referenceLinePlugin]}
          />
        </div>
      </div>
    );
  };

export default BarChart;