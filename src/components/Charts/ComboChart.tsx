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
import { Button } from '../ui/button';
import { useCharts } from '@/app/features/resume/hooks/useCharts';

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

  const { downloadChart } = useCharts();

  useResizeCharts(chartRef);

  const comboData: ChartData = {
    labels: data.labels,
    datasets: data.datasets.map(dataset => {
      const isExpense = dataset.label.includes('GASTOS');
      
      const processedData = selectedLegend && dataset.id !== data.datasets.find(ds => ds.label === selectedLegend)?.id
        ? []
        : dataset.data.map((value) => {
            if (value === undefined) return null;
            if (currency === 'USD') return value;
            if (currency === 'UF') return Math.round(value / exchangeRates.UF);
            if (currency === 'CLP') return value * exchangeRates.CLP;
            return null;
          });
      
      const baseColor = dataset.borderColor;
      
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
        tension: 0.3,
        yAxisID: 'y',
        spanGaps: true,
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
        categoryPercentage: 0.7,
        order: 1,
        yAxisID: 'y',
      };
    }
    })
  };
  
  const chartOptions = ComboChartOptions({ currency });
  
  const chartOptionsWithLegendClick: ChartOptions = {
    ...chartOptions,
    responsive: true,
    maintainAspectRatio: false,
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
    <div className="w-full h-full flex flex-col bg-white font-[Helvetica] overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between p-4 gap-2 flex-shrink-0">
        <div className="flex items-center">
          <DropdownMenu
            buttonText={currency}
            items={['USD', 'UF', 'CLP']}
            onSelect={(item) => setCurrency(item as keyof typeof exchangeRates)}
          />
        </div>
        <Button
          variant={'default'}
          onClick={() => downloadChart(chartRef, 'combo-chart', 'png')}
          className="flex items-center gap-2 px-4 py-2 bg-[#0068D1] text-white font-regular rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="hidden sm:inline">Descargar Gráfico</span>
        </Button>
      </div>
      <div className="flex-1 px-4 pb-4 min-h-0">
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
    </div>
  );
};

export default ComboChart;