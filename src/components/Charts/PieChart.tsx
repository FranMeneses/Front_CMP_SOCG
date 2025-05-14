'use client';
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { useRef, useState } from 'react';
import { PieChartOptions } from "./config/ChartConfig";
import { PieChartProps } from "./interfaces/ChartInterfaces";
import { useResizeCharts } from "./hooks/useResizeCharts";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = ({
  data,
  selectedLegend,
  onLegendClick = () => {}, 
  userRole,
}: {
  data: PieChartProps;
  selectedLegend: string | null;
  onLegendClick?: (legend: string) => void;
  userRole: string;
}) => {
  
  const chartRef = useRef<ChartJS | null>(null);
  const [visibleLegend, setVisibleLegend] = useState<string | null>(null);

  useResizeCharts(chartRef);

  const filteredData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      data:
        (userRole === "gerente" || userRole === "superintendente")
          ? (selectedLegend || visibleLegend)
            ? dataset.data.map((value, index) =>
                data.labels[index] === (selectedLegend || visibleLegend) ? value : 0
              )
            : dataset.data
          : visibleLegend
          ? dataset.data.map((value, index) =>
              data.labels[index] === visibleLegend ? value : 0
            )
          : dataset.data, 
      backgroundColor:
        (userRole === "gerente" || userRole === "superintendente")
          ? (selectedLegend || visibleLegend)
            ? dataset.backgroundColor.map((color, index) =>
                data.labels[index] === (selectedLegend || visibleLegend)
                  ? color
                  : `${color}80`
              )
            : dataset.backgroundColor
          : dataset.backgroundColor.map((color, index) =>
              visibleLegend === null || data.labels[index] === visibleLegend
                ? color
                : `${color}80`
            ), 
    })),
  };
  
  const handleLegendClick = (legend: string) => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const labelIndex = data.labels.indexOf(legend);

      if (labelIndex !== -1) {
        setVisibleLegend((prev) => (prev === legend ? null : legend));
        
        chart.setActiveElements([
          {
            datasetIndex: 0,
            index: labelIndex,
          },
        ]);
        chart.tooltip?.setActiveElements(
          [
            {
              datasetIndex: 0,
              index: labelIndex,
            },
          ],
          { x: 0, y: 0 }
        );
        chart.update();
      }
    }
      onLegendClick(legend);
  };

  return (
    <div className="w-full h-full p-4 bg-white mx-auto">
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
                onLegendClick(legend);
              },
            },
            title: {
              ...PieChartOptions.plugins?.title,
              display: true,
              text: userRole === "encargado cumplimiento" ? "Compliance" : "Iniciativas por valle",
            },
          },
        }}
      />
    </div>
  );
};

export default PieChart;