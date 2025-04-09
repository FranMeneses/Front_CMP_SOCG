'use client'
import { Doughnut } from "react-chartjs-2"
import {Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions, Title} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend,Title);

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

    const options: ChartOptions<'doughnut'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 20,
                    font: {
                        size: 12,
                        weight: 'bold',
                        family: 'Roboto, sans-serif',
                        style: 'italic',
                    },
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
                    bottom: 30,
                },
            },
        },
    }
    
    return (
        <div className='flex-1 border border-gray-300 p-4 bg-white'>
            <Doughnut data={data} options={options}/>
        </div>
    )
}

export default PieChart;