import { ChartOptions } from 'chart.js';

export const BarChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
      ticks: {
        stepSize: 10,
      },
      grid: {
        display: false,
      },
    },
    y: {
      min: 0, 
      max: 100, 
      ticks: {
        stepSize: 10,
      },
      stacked: true,
      grid: {
        display: true,
      },
    },
  },
  plugins: {
    tooltip: {
      mode: 'index',
      intersect: false,
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