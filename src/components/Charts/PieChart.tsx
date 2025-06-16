'use client';
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { useRef, useState } from 'react';
import { PieChartOptions, pieChartPlugins } from "./config/PieChartConfig";
import { PieChartProps } from "./interfaces/ChartInterfaces";
import { useResizeCharts } from "./hooks/useResizeCharts";
import { Button } from '../ui/button';
import { useCharts } from '@/app/features/resume/hooks/useCharts';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = ({
  data,
  selectedLegend,
  onLegendClick = () => {}, 
  title,
  titleSize,
  font,
}: {
  data: PieChartProps;
  selectedLegend: string | null;
  onLegendClick?: (legend: string) => void;
  title: string;
  titleSize: number;
  font: string;
}) => {

  const chartRef = useRef<ChartJS | null>(null);
  const { downloadChart } = useCharts();

  const filteredData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      // Usar solo selectedLegend, no visibleLegend
      data: selectedLegend
        ? dataset.data.map((value, index) =>
            data.labels[index] === selectedLegend ? value : 0
          )
        : dataset.data,
      backgroundColor: selectedLegend
        ? dataset.backgroundColor.map((color, index) =>
            data.labels[index] === selectedLegend
              ? color
              : `${color}80`
          )
        : dataset.backgroundColor,
    })),
  };
  
  const handleLegendClick = (legend: string) => {
    onLegendClick(legend);
  };

  return (
    <div className="w-full h-full p-4 bg-white mx-auto font-[Helvetica]">
      <div className="flex justify-end mb-2">
        <Button
          variant={'default'}
          onClick={() => downloadChart(chartRef, 'pie-chart', 'png')}
          className="flex items-center gap-2 px-4 py-2 bg-[#0068D1] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Descargar Gráfico
        </Button>
      </div>
      <Doughnut
        ref={(instance) => {
          if (instance) {
            chartRef.current = instance;
          }
        }}
        data={filteredData}
        options={{
          ...PieChartOptions,
          plugins: {
            ...PieChartOptions.plugins,
            legend: {
              ...PieChartOptions.plugins?.legend,
              onClick: (_event, legendItem) => {
                const legend = legendItem.text;
                handleLegendClick(legend);
              },
            },
            title: {
              ...PieChartOptions.plugins?.title,
              display: true,
              text: title,
              font: {
                size: titleSize || 16,
                family: font || 'Helvetica',
              },
            },
          },
        }}
        plugins={pieChartPlugins}
      />
    </div>
  );
};

export default PieChart;