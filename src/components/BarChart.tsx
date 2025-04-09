'use client'
import { Bar } from 'react-chartjs-2';
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

const BarChart = ({ data }: {data:BarChartData}) => {
    const options: ChartOptions<'bar'> = {
        responsive: true,
        scales: {
            x:{
                grid:{
                    display: false,
                }
            },
            y: {
                grid: {
                    display: false,
                },
            },
        },
        plugins: {
            tooltip: {
                enabled: true,
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
        <div className='flex-1 border border-gray-300 p-4 bg-white'>
            <Bar data={data} options={options} />
        </div>
    );
}
export default BarChart;