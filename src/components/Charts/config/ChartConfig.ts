import { ChartOptions } from 'chart.js';
import { getDynamicTitle, getMinDate, getMaxDate } from '@/components/Charts/GanttChart/functions/scheduleFunctions';
import { GanttChartData } from '../interfaces/ChartInterfaces';

export const BarChartOptions: ChartOptions<'bar'> = {
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

export const GanttChartOptions = ({data}: {data: GanttChartData}): ChartOptions<'bar'> => ({
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: 'y',
    scales: {
        x: {
            type: 'time',
            min: getMinDate({ data }).getTime(),
            max: getMaxDate({ data }).getTime(),
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
                text: getDynamicTitle({ data }),
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
});

export const LineChartOptions: ChartOptions<'line'> = {
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

export const PieChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 10,
          font: {
            size: 12,
            weight: 'bold',
            family: 'Roboto, sans-serif',
            style: 'italic',
          },
        },
        onHover: (event) => {
          const target = event.native?.target as HTMLElement;
          if (target) {
              target.style.cursor = 'pointer';
          }
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
          bottom: 10,
        },
      },
    },
  };