'use client';
import { Bar } from 'react-chartjs-2';
import { useRef, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, BarElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import 'chartjs-adapter-date-fns';
import { GanttChartData } from '../interfaces/ChartInterfaces';
import { GanttChartOptions } from '../config/ChartConfig';

ChartJS.register(CategoryScale, BarElement, Title, Tooltip, Legend, TimeScale, annotationPlugin);

const GanttChart = ({ data }: { data: GanttChartData }) => {
    const chartRef = useRef<ChartJS<'bar', { x: [number, number]; y: string; assigned?: string; progress: number }[], unknown> | null>(null);

    useEffect(() => {
        const handleResize = () => {
            if (chartRef.current) {
                chartRef.current.resize();
                console.log('Resizing chart:', chartRef.current);
            } else {
                console.log('Chart reference is null');
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
                options={GanttChartOptions({data})}
            />
        </div>
    );
};

export default GanttChart;