'use client';
import { Bar } from 'react-chartjs-2';
import { useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { BarChartData } from './interfaces/ChartInterfaces';
import { BarChartOptions, referenceLinePlugin } from './config/BarChartConfig';
import { useResizeCharts } from './hooks/useResizeCharts';
import { Button } from '../ui/button';
import { useCharts } from '@/app/features/resume/hooks/useCharts';

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
    const { downloadChart } = useCharts();
  
    useResizeCharts(chartRef);

  const filteredData = {
    ...data,
    datasets: selectedLegend
      ? data.datasets.filter((dataset) => {
          const selectedId = data.datasets.find(ds => ds.label === selectedLegend)?.id;
          return dataset.id === selectedId;
        })
      : data.datasets, 
  };
  
    return (
      <div className="w-full h-full p-4 bg-white font-[Helvetica]">
        <div className="flex justify-end mb-2">
          <Button
            variant={'default'}
            onClick={() => downloadChart(chartRef, 'bar-chart', 'png')}
            className="flex items-center gap-2 px-4 py-2 bg-[#0068D1] text-white font-regular rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar Gráfico
          </Button>
        </div>
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
          plugins={[referenceLinePlugin]}
        />
      </div>
    );
  };

export default BarChart;