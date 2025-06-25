import { ChartOptions } from "chart.js";
import ChartDataLabels, { Context as DataLabelsContext } from 'chartjs-plugin-datalabels';

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
        onHover: function(this, event) {
          const nativeEvent = event.native as Event | null;
          const target = nativeEvent?.target as HTMLElement | null;
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
          weight: 'bold',
          family: 'Roboto, sans-serif',
        },
        padding: {
          top: 10,
          bottom: 10,
        },
      },
      datalabels: {
        display: (context: DataLabelsContext) => {
          const data = (context.dataset?.data ?? []) as Array<number | null | undefined>;
          const value = data[context.dataIndex];
          return typeof value === 'number' && value !== 0;
        },
        color: '#000',
        font: {
          size: 12,
          weight: 'bold',
        },
        formatter: (value: number) => {
          return value.toString();
        },
        anchor: 'end',
        align: 'start',
        offset: 10,
        borderColor: '#000',
        borderRadius: 4,
        borderWidth: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: {
          top: 4,
          bottom: 4,
          left: 6,
          right: 6,
        },
        listeners: {
          enter: function(context: DataLabelsContext) {
            return context.chart.draw();
          },
          leave: function(context: DataLabelsContext) {
            return context.chart.draw();
          }
        }
      },
    },
};

export const pieChartPlugins = [ChartDataLabels];