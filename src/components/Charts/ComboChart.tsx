'use client';
import { Chart } from 'react-chartjs-2';
import { useRef, useState } from 'react';
import {
  BarElement,
  CategoryScale,
  ChartEvent,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { ComboChartOptions } from './config/ComboChartConfig';
import { ComboChartData } from './interfaces/ChartInterfaces';
import DropdownMenu from '../Dropdown';
import { useExchangeRates } from './hooks/useExchangeRates';
import { useResizeCharts } from './hooks/useResizeCharts';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend
);

const ComboChart = ({
  data,
  selectedLegend,
  onLegendClick,
}: {
  data: ComboChartData;
  selectedLegend: string | null;
  onLegendClick: (legend: string) => void;
}) => {
  const chartRef = useRef<ChartJS | null>(null);
  const [chartKey, setChartKey] = useState<number>(0);
  const exchangeRates = useExchangeRates(); 
  const [currency, setCurrency] = useState<keyof typeof exchangeRates>('USD');

  useResizeCharts(chartRef);

  const comboData: ChartData = {
    labels: data.labels,
    datasets: data.datasets.map(dataset => {
      const isExpense = dataset.label.includes('Gastos');
      
      const valleyName = isExpense ? dataset.label.replace('Gastos ', '') : dataset.label;
      
      const processedData = selectedLegend && dataset.id !== data.datasets.find(ds => ds.label === selectedLegend)?.id
        ? []
        : dataset.data.map((value) => {
            if (value === undefined) return null;
            if (currency === 'USD') return value;
            if (currency === 'UF') return Math.round(value / exchangeRates.UF);
            if (currency === 'CLP') return value * exchangeRates.CLP;
            return null;
          });
      
      const matchingDataset = isExpense 
        ? data.datasets.find(ds => ds.label === valleyName) 
        : data.datasets.find(ds => ds.label === `Gastos ${dataset.label}`); 
      
      const baseColor = matchingDataset?.borderColor || dataset.borderColor;
      
      if (isExpense) {
        return {
          ...dataset,
          data: processedData,
          type: 'line' as const,
          borderColor: baseColor, 
          backgroundColor: 'transparent', 
          borderWidth: 3, 
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: false,
          order: 0, 
          tension: 0.4,
        };
      } else {
        return {
          ...dataset,
          data: processedData,
          type: 'bar' as const, 
          backgroundColor: `${baseColor}80`, 
          hoverBackgroundColor: baseColor,
          borderColor: baseColor,
          borderWidth: 1,
          barPercentage: 0.7,
          categoryPercentage: 0.8,
          order: 1,
        };
      }
    })
  };
  
  const chartOptions = ComboChartOptions({ currency });
  
  const chartOptionsWithLegendClick: ChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins?.legend,
        onClick: (_event: ChartEvent, legendItem: { text: string }) => {
          onLegendClick(legendItem.text);
          setChartKey((prevKey) => prevKey + 1);
        },
      },
    },
  };

  return (
    <div className="w-full h-full p-4 bg-white">
      <div className="flex justify-end mb-2">
        <DropdownMenu
          buttonText={currency}
          items={['USD', 'UF', 'CLP']}
          onSelect={(item) => setCurrency(item as keyof typeof exchangeRates)}
        />
      </div>
      <Chart
        key={chartKey}
        ref={(instance) => {
          if (instance) {
            chartRef.current = instance;
          }
        }}
        type="bar"
        options={chartOptionsWithLegendClick}
        data={comboData}
      />
    </div>
  );
};

export default ComboChart;