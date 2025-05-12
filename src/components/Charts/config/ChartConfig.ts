import { ChartOptions } from 'chart.js';

const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

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

export const LineChartOptions = ({
    currency,
  }: {
    currency: 'USD' | 'UF' | 'CLP';
  }): ChartOptions<'line'> => {
    const stepSize = currency === 'USD' ? 1000 : currency === 'UF' ? 100 : 1000000;
  
    return {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          position: 'right',
          min: 0,
          ticks: {
            stepSize: stepSize, 
            precision: 0,
            font: {
              size: isMobile ? 10 : 12,
            },
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
              size: isMobile? 8 : 12,
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
            font: {
              size: isMobile ? 7 : 12,
            },
            filter: (legendItem, data) => {
              const datasetLabels = data.datasets.map((dataset) => dataset.label);
              const firstIndex = datasetLabels?.indexOf(legendItem.text);
              return firstIndex === legendItem.datasetIndex;
            },
            boxWidth: 12,
            usePointStyle: true,
            color: '#000',
          },
          onHover: (_event) => {
            const target = _event.native?.target as HTMLElement;
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
            size: isMobile? 12 : 24,
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
};
  
export const PieChartOptions: ChartOptions<'doughnut'> = {
    animation: {
      animateRotate: true,
    },
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
        onHover: (_event) => {
          const target = _event.native?.target as HTMLElement;
          if (target) {
              target.style.cursor = 'pointer';
          }
        },
      },
      tooltip: {
        enabled: true,
        position: 'nearest',
      },
      title: {
        display: true,
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