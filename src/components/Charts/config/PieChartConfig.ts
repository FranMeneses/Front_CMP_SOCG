import { ChartOptions } from "chart.js";

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
        fullSize: false,
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