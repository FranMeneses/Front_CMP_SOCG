'use client';
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { useRef, useState } from 'react';
import { PieChartOptions, pieChartPlugins } from "./config/PieChartConfig";
import { PieChartProps } from "./interfaces/ChartInterfaces";
import { useResizeCharts } from "./hooks/useResizeCharts";

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
  const [visibleLegend, setVisibleLegend] = useState<string | null>(null);

  useResizeCharts(chartRef);

  const filteredData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      data: (selectedLegend || visibleLegend)
        ? dataset.data.map((value, index) =>
            data.labels[index] === (selectedLegend || visibleLegend) ? value : 0
          )
        : dataset.data,
      backgroundColor: (selectedLegend || visibleLegend)
        ? dataset.backgroundColor.map((color, index) =>
            data.labels[index] === (selectedLegend || visibleLegend)
              ? color
              : `${color}80`
          )
        : dataset.backgroundColor,
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
    <div className="w-full h-full p-4 bg-white mx-auto font-[Helvetica]">
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