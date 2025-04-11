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

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            y: {
                position: 'right',
                min: 0,
                max: 100000,
                ticks: {
                    stepSize: 10000,
                    precision: 0,
                },
                grid: {
                    display: false,
                },
            },
            x: {
                ticks: {
                    minRotation: 90,
                    align: 'center',
                    padding: 10,
                    color: '#000',
                    font: {
                        size: 12,
                        weight: 'bold',
                        family: 'Roboto, sans-serif',
                        style: 'italic',
                    },
                },
                grid: {
                    display: false,
                },
            },
        },
        plugins: {
            tooltip: {
                enabled: true,
            },
            legend: {
                display: true,
                position: 'left',
                labels: {
                    boxWidth: 12,
                    usePointStyle: true,
                    color: '#000',
                },
                onHover: (event) => {
                    const target = event.native?.target as HTMLElement;
                    if (target) {
                        target.style.cursor = 'pointer';
                    }
                },
            },
            title: {
                display: true,
                text: `Presupuesto ${new Date().getFullYear()}`,
                color: '#000',
                font: {
                    size: 24,
                    weight: 'bold',
                },
                padding: {
                    top: 10,
                    bottom: 20,
                },
                align: 'start',
            },
        },
    };

    return (
        <div className="w-full h-full border border-gray-300 p-4 bg-white">
            <Line 
            ref={ (instance) => {
                if (instance) {
                    chartRef.current = instance; 
                }
            }}
            data={data} 
            options={options} />
        </div>
    );
};

export default LineChart;