import { ChartOptions } from 'chart.js';

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

export const ComboChartOptions = ({
  currency,
}: {
  currency: 'USD' | 'UF' | 'CLP';
}): ChartOptions<'bar'> => {
  const stepSize = currency === 'USD' ? 100000 : currency === 'UF' ? 10000 : 100000000;
  const currencySymbol = currency === 'USD' ? '$' : currency === 'UF' ? '' : '$';

  return {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        position: 'right',
        beginAtZero: true,
        ticks: {
          stepSize: stepSize,
          precision: 0,
          font: {
            size: isMobile ? 10 : 12,
          },
          callback: function(value) {
            return currencySymbol + value.toLocaleString() + (currency === 'UF' ? ' UF' : '');
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
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
        offset: true,
        stacked: false, 
      },
    },
    plugins: {
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#000',
      bodyColor: '#000',
      borderColor: 'rgba(0, 0, 0, 0.2)',
      borderWidth: 1,
      padding: 10,
      callbacks: {
        title: (tooltipItems) => {
          return tooltipItems[0].label;
        },
        label: (context) => {
          const label = context.dataset.label || '';
          const value = context.parsed.y;
          
          const isExpense = label.includes('Gastos');
          const prefix = isExpense ? 'Gasto' : 'Presupuesto';
          const valleyName = isExpense ? label.replace('Gastos ', '') : label;
          
          let formattedValue = '';
          
          if (value !== null && value !== undefined) {
            if (currency === 'USD') {
              formattedValue = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'USD' }).format(value);
            } else if (currency === 'UF') {
              formattedValue = `${value.toFixed(2)} UF`;
            } else if (currency === 'CLP') {
              formattedValue = `$${value.toLocaleString('es-CL')} CLP`;
            } else {
              formattedValue = `${value}`;
            }
          }
          
          return `${prefix} ${valleyName}: ${formattedValue}`;
        }
      }
    },
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: isMobile ? 7 : 12,
          },
          filter: (legendItem, data) => {
            if (legendItem.text.startsWith('Gastos')) {
              return false;
            }
              
            const datasetLabels = data.datasets.map((dataset) => dataset.label);
            const firstIndex = datasetLabels?.indexOf(legendItem.text);
            return firstIndex === legendItem.datasetIndex;
          },
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
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
        text: `PRESUPUESTO VS GASTO ${new Date().getFullYear()}`,
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