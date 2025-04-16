'use client';
import { Bar } from 'react-chartjs-2';
import { useRef, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { BarChartData } from './interfaces/ChartInterfaces';
import { BarChartOptions } from './config/ChartConfig';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data }: { data: BarChartData }) => {
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
        <div className="w-full h-full border border-gray-300 p-4 bg-white">
            <Bar
            ref={(instance) => {
                if (instance) {
                    chartRef.current = instance; 
                    console.log('Chart instance:', instance);
                }
            }} 
            data={data} 
            options={BarChartOptions} />
        </div>
    );
};

export default BarChart;