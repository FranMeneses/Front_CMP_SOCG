'use client';
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions, Title } from 'chart.js';
import { useRef, useEffect, MutableRefObject } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface PieChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      data: number[];
      backgroundColor: string[];
      hoverBackgroundColor: string[];
    }>;
  };
}

const PieChart = ({ data }: PieChartProps) => {
  const chartRef = useRef<ChartJS | null>(null); 

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.resize(); 
      }
    };

    window.addEventListener('resize', handleResize); 
    return () => window.removeEventListener('resize', handleResize); 
  }, []);

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 10,
          font: {
            size: 12,
            weight: 'bold',
            family: 'Roboto, sans-serif',
            style: 'italic',
          },
        },
        onHover: (event) => {
          const target = event.native?.target as HTMLElement;
          if (target) {
              target.style.cursor = 'pointer';
          }
        },
      },
      tooltip: {
        enabled: true,
      },
      title: {
        display: true,
        text: 'Iniciativas por valle',
        color: '#000',
        position: 'top',
        align: 'start',
        font: {
          size: 24,
          weight: 'bold',
          family: 'Roboto, sans-serif',
        },
        padding: {
          top: 10,
          bottom: 10,
        },
      },
    },
  };

  return (
    <div className="w-full h-full border border-gray-300 p-4 bg-white mx-auto">
      <Doughnut
        ref={(instance) => {
          if (instance) {
            chartRef.current = instance; 
          }
        }}
        data={data}
        options={options}
      />
    </div>
  );
};

export default PieChart;