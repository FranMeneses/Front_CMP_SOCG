'use client';
import { Line } from 'react-chartjs-2';
import { useRef, useState } from 'react';
import {
  CategoryScale,
  ChartEvent,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { LineChartOptions } from './config/ChartConfig';
import { LineChartData } from './interfaces/ChartInterfaces';
import DropdownMenu from '../Dropdown';
import { useExchangeRates } from './hooks/useExchangeRates';
import { useResizeCharts } from './hooks/useResizeCharts';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({
  data,
  selectedLegend,
  onLegendClick,
}: {
  data: LineChartData;
  selectedLegend: string | null;
  onLegendClick: (legend: string) => void;
}) => {
  const chartRef = useRef<ChartJS | null>(null);
  const [chartKey, setChartKey] = useState<number>(0);
  const exchangeRates = useExchangeRates(); 
  const [currency, setCurrency] = useState<keyof typeof exchangeRates>('USD');

  useResizeCharts(chartRef);

  const filteredData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      data:
        selectedLegend && dataset.id !== data.datasets.find(ds => ds.label === selectedLegend)?.id
          ? []
          : dataset.data.map((value) => {
              if (value === undefined) return null;
              if (currency === 'USD') return value;
              if (currency === 'UF') return Math.round(value / exchangeRates.UF);
              if (currency === 'CLP') return value * exchangeRates.CLP;
              return null;
            }),
    })),
  };

  const chartOptions = {
    ...LineChartOptions({ currency }),
    plugins: {
      ...LineChartOptions({ currency }).plugins,
      legend: {
        ...LineChartOptions({ currency }).plugins?.legend,
        onClick: (_event: ChartEvent, legendItem: { text: string }) => {
          const legend = legendItem.text;
          const clickedId = data.datasets.find(ds => ds.label === legend)?.id;
          
          // Si se encontró un ID, seleccionar todos los datasets con ese ID
          if (clickedId) {
            onLegendClick(legend);
            setChartKey((prevKey) => prevKey + 1);
          } else {
            onLegendClick(legend);
            setChartKey((prevKey) => prevKey + 1);
          }
        },
      },
    },
  };

  return (
    <div className="w-full h-full p-4 bg-white">
      <DropdownMenu
        buttonText="USD"
        items={['USD', 'UF', 'CLP']}
        onSelect={(item) => setCurrency(item as keyof typeof exchangeRates)}
      />
      <Line
        key={chartKey}
        ref={(instance) => {
          if (instance) {
            chartRef.current = instance;
          }
        }}
        data={filteredData}
        options={chartOptions}
      />
    </div>
  );
};

export default LineChart;