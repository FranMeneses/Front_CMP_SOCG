'use client';
import { Line } from 'react-chartjs-2';
import { useRef, useEffect } from 'react';
import {
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { LineChartOptions } from './config/ChartConfig';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface LineChartData {
    labels: string[];
    datasets: Array<{
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
    }>;
}

const LineChart = ({ data }: { data: LineChartData }) => {
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
            <Line 
            ref={ (instance) => {
                if (instance) {
                    chartRef.current = instance; 
                }
            }}
            data={data} 
            options={LineChartOptions} />
        </div>
    );
};

export default LineChart;