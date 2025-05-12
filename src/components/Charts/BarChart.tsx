'use client';
import { Bar } from 'react-chartjs-2';
import { useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { BarChartData } from './interfaces/ChartInterfaces';
import { BarChartOptions } from './config/ChartConfig';
import { useResizeCharts } from './hooks/useResizeCharts';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({
    data,
    selectedLegend,
    onLegendClick,
  }: {
    data: BarChartData;
    selectedLegend: string | null;
    onLegendClick: (legend: string) => void;
  }) => {
    const chartRef = useRef<ChartJS | null>(null);
  
    useResizeCharts(chartRef);

    const filteredData = {
      ...data,
      datasets: selectedLegend
        ? data.datasets.filter((dataset) => dataset.label === selectedLegend)
        : data.datasets, 
    };
  
    return (
      <div className="w-full h-full p-4 bg-white">
        <Bar
          ref={(instance) => {
            if (instance) {
              chartRef.current = instance;
            }
          }}
          data={filteredData}
          options={{
            ...BarChartOptions,
            plugins: {
              ...BarChartOptions.plugins,
              legend: {
                ...BarChartOptions.plugins?.legend,
                onClick: (_event, legendItem) => {
                  const legend = legendItem.text;
                  onLegendClick(legend);
                },
              },
            },
          }}
        />
      </div>
    );
  };

export default BarChart;