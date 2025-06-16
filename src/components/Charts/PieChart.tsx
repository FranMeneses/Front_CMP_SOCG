'use client';
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { useRef } from 'react';
import { PieChartOptions, pieChartPlugins } from "./config/PieChartConfig";
import { PieChartProps } from "./interfaces/ChartInterfaces";
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
    <div className="w-full h-full flex flex-col bg-white font-[Helvetica] overflow-hidden min-w-0">
      <div className="flex justify-end p-2 lg:p-4 pb-2 flex-shrink-0">
        <Button
          variant={'default'}
          onClick={() => downloadChart(chartRef, 'pie-chart', 'jpeg')}
          className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-[#0068D1] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="hidden sm:inline">Descargar Gráfico</span>
        </Button>
      </div>
      <div className="flex-1 p-2 lg:p-4 pt-0 min-h-0 min-w-0">
        <Doughnut
          ref={(instance) => {
            if (instance) {
              chartRef.current = instance;
            }
          }}
          data={filteredData}
          options={{
            ...PieChartOptions,
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10
              }
            },
            plugins: {
              ...PieChartOptions.plugins,
              legend: {
                ...PieChartOptions.plugins?.legend,
                onClick: (_event, legendItem) => {
                  const legend = legendItem.text;
                  handleLegendClick(legend);
                },
                position: window.innerWidth < 1024 ? 'bottom' : 'right',
                align: 'center',
                labels: {
                  usePointStyle: true,
                  pointStyle: 'rect',
                  padding: window.innerWidth < 1024 ? 10 : 15,
                  font: {
                    size: window.innerWidth < 1024 ? 10 : 12,
                    family: 'Helvetica'
                  },
                  boxWidth: window.innerWidth < 1024 ? 12 : 15,
                  boxHeight: window.innerWidth < 1024 ? 12 : 15
                }
              },
              title: {
                ...PieChartOptions.plugins?.title,
                display: true,
                text: title,
                position: 'top',
                padding: {
                  top: 5,
                  bottom: 10
                },
                font: {
                  size: titleSize || 16,
                  family: font || 'Helvetica',
                  weight: 'bold'
                },
              },
            },
          }}
          plugins={pieChartPlugins}
        />
      </div>
    </div>
  );
};

export default PieChart;