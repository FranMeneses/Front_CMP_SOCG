'use client';
import { Bar } from 'react-chartjs-2';
import { useRef, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartData {
    labels: string[];
    datasets: Array<{
        label: string;
        data: number[];
        backgroundColor: string[];
        hoverBackgroundColor: string[];
    }>;
}

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

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                grid: {
                    display: true,
                },
            },
        },
        plugins: {
            tooltip: {
                enabled: true,
            },
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Lineas de Inversión',
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
                    bottom: 20,
                },
            },
        },
    };

    return (
        <div className="w-full h-full border border-gray-300 p-4 bg-white">
            <Bar
            ref={(instance) => {
                if (instance) {
                    chartRef.current = instance; 
                }
            }} 
            data={data} 
            options={options} />
        </div>
    );
};

export default BarChart;