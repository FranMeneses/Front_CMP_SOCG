'use client';
import { Bar } from 'react-chartjs-2';
import { useRef, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, BarElement, Title, Tooltip, Legend, ChartOptions, TimeScale } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import 'chartjs-adapter-date-fns';

ChartJS.register(CategoryScale, BarElement, Title, Tooltip, Legend, TimeScale, annotationPlugin);

interface GanttChartData {
    datasets: Array<{
        data: Array<{
            x: [number, number]; 
            y: string; 
            assigned?: string;
            progress: number;
        }>;
        backgroundColor: string[];
        hoverBackgroundColor: string[];
    }>;
}


const GanttChart = ({ data }: { data: GanttChartData }) => {
    
    const chartRef = useRef<ChartJS | null>(null); 

    const getMaxDate = () => {
        const allDates = data.datasets.flatMap(dataset => 
            dataset.data.map(entry => Array.isArray(entry.x) ? entry.x[1] : entry.x)
        );
        const latestDate = Math.max(...allDates);
        const maxDate = new Date(latestDate);
        maxDate.setDate(maxDate.getDate() + 3); 
        return maxDate;
    };

    const getMinDate = () => {
        const allDates = data.datasets.flatMap(dataset => 
            dataset.data.map(entry => Array.isArray(entry.x) ? entry.x[0] : entry.x)
        );
        const earliestDate = Math.min(...allDates);
        const minDate = new Date(earliestDate);
        minDate.setDate(minDate.getDate() - 3); 
        return minDate;
    };

    const getDynamicTitle = () => {
        const minDate = getMinDate();
        const maxDate = getMaxDate();
    
        const minMonth = minDate.toLocaleDateString('es-CL', { month: 'long' }).replace(/^\w/, (c) => c.toUpperCase());
        const minYear = minDate.getFullYear();
        const maxMonth = maxDate.toLocaleDateString('es-CL', { month: 'long' }).replace(/^\w/, (c) => c.toUpperCase());
        const maxYear = maxDate.getFullYear();
    
        if (minYear === maxYear) {
            return `${minMonth} - ${maxMonth} ${minYear}`;
        }
    
        return `${minMonth} ${minYear} - ${maxMonth} ${maxYear}`;
    };

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
        indexAxis: 'y',
        scales: {
            x: {
                type: 'time',
                min: getMinDate().getTime(),
                max: getMaxDate().getTime(),
                time: {
                    unit: 'day',
                    displayFormats: {
                        day: 'd', 
                    },
                },
                grid: {
                    display: false,
                },
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        const date = new Date(value as number);
                        return date.getDate();
                    },
                },
                position: 'top',
                title: {
                    display: true,
                    text: getDynamicTitle(),
                    align: 'start',
                    font: {
                        size: 20,
                        weight: 'bold',
                    },
                    color: '#000',
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
                callbacks: {
                    label: function (tooltipItem) {
                        const datasetIndex = tooltipItem.datasetIndex;
                        const dataIndex = tooltipItem.dataIndex;
                        const dataPoint = data.datasets[datasetIndex].data[dataIndex];
                        const assigned = dataPoint.assigned;
                        const startDate = new Date(dataPoint.x[0]).toLocaleDateString('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit' });
                        const endDate = new Date(dataPoint.x[1]).toLocaleDateString('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit' });
                        const progress = dataPoint.progress;
                        const progressPercentage = Math.round(progress * 100);  
    
                        return [
                            `Asignado a: ${assigned || 'Sin asignar'}`,
                            `Desde: ${startDate}`,
                            `Hasta: ${endDate}`,
                            `Progreso: ${progressPercentage}%`,
                        ];
                    },
                },
            },
            legend: {
                display: false,
            },
            annotation: {
                annotations: {
                    todayLine: {
                        type: 'line',
                        xMin: new Date().getTime(),
                        xMax: new Date().getTime(),
                        borderColor: 'red',
                        borderDash: [5, 3],
                        borderWidth: 1,
                        label: {
                            content: 'Hoy',
                            position: 'start',
                            color: 'black',
                            font: {
                                size: 12,
                            },
                        },
                    },
                },
            },
        },
    };

    return (
        <div className="w-full h-full border border-gray-300 p-4 bg-white">
            <Bar
                data={data} 
                options={options} 
            />
        </div>
    );
};

export default GanttChart;