'use client';
import { Line } from 'react-chartjs-2';
import { useRef, useEffect, useState } from 'react';
import {
    CategoryScale,
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
  const [chartKey, setChartKey] = useState(0); 
  const [exchangeRates, setExchangeRates] = useState({
    USD: 1,
    UF: 1,
    CLP: 1,
  });
  const [currency, setCurrency] = useState<keyof typeof exchangeRates>('USD');

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch('https://mindicador.cl/api');
        const data = await response.json();

        const usdToClp = data.dolar.valor;
        const ufToUsd = data.uf.valor / data.dolar.valor;
        setExchangeRates({
          USD: 1,
          UF: Math.round(ufToUsd), 
          CLP: usdToClp, 
        });
      } catch (error) {
        console.error('Error al obtener las tasas de cambio:', error);
      }
    };

    fetchExchangeRates();
  }, []);

  useEffect(() => {
    const handleResize = () => {
        if (chartRef.current) {
            chartRef.current.resize(); 
        }
    };

    window.addEventListener('resize', handleResize); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const filteredData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      data: selectedLegend && dataset.label !== selectedLegend
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

  return (
    <div className="w-full h-full border border-gray-300 p-4 bg-white">
      <DropdownMenu
        buttonText='USD'
        items={['USD', 'UF', 'CLP']}
        onSelect={(item) => {
          setCurrency(item as keyof typeof exchangeRates);
        }}
      />
      <Line
        key={chartKey} 
        ref={(instance) => {
          if (instance) {
            chartRef.current = instance;
          }
        }}
        data={filteredData}
        options={{
          ...LineChartOptions ({currency}) ,
          plugins: {
            ...LineChartOptions ({currency}).plugins,
            legend: {
              ...LineChartOptions ({currency}).plugins?.legend,
              onClick: (_event, legendItem) => {
                const legend = legendItem.text;
                onLegendClick(legend);
                setChartKey((prevKey) => prevKey + 1); 
              },
            },
          },
        }}
      />
    </div>
  );
};

export default LineChart;