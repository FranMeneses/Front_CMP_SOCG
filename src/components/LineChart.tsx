'use client'
import {Line} from 'react-chartjs-2';
import {CategoryScale, Chart as ChartJS, ChartOptions, Legend, LinearScale, LineElement, PointElement, Title, Tooltip} from 'chart.js';

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

const LineChart = ({data}: {data: LineChartData}) => {
    const options: ChartOptions<'line'> = {
        responsive: true,
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
        <div className='flex-1 border border-gray-300 p-4 bg-white'>
            <Line data={data} options={options} />
        </div>
    );
};

export default LineChart;