'use client';
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { useRef } from 'react';
import { PieChartOptions } from "./config/ChartConfig";
import { PieChartProps } from "./interfaces/ChartInterfaces";
import { useResizeCharts } from "./hooks/useResizeCharts";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = ({
  data,
  selectedLegend,
  onLegendClick,
}: {
  data: PieChartProps;
  selectedLegend: string | null;
  onLegendClick: (legend: string) => void;
}) => {
  const chartRef = useRef<ChartJS | null>(null);

  useResizeCharts(chartRef);

  const filteredData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor.map((color, index) =>
        selectedLegend === data.labels[index] ? color : `${color}80` 
      ),
    })),
  };

  return (
    <div className="w-full h-full border border-gray-300 p-4 bg-white mx-auto">
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
                onLegendClick(legend);
              },
            },
          },
        }}
      />
    </div>
  );
};

export default PieChart;