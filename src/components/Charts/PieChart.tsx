'use client';
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions, Title } from 'chart.js';
import { useRef, useEffect, MutableRefObject } from 'react';
import { PieChartOptions } from "./config/ChartConfig";

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

  
  return (
    <div className="w-full h-full border border-gray-300 p-4 bg-white mx-auto">
      <Doughnut
        ref={(instance) => {
          if (instance) {
            chartRef.current = instance; 
          }
        }}
        data={data}
        options={PieChartOptions}
      />
    </div>
  );
};

export default PieChart;