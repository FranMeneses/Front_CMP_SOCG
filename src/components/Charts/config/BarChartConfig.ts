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

export const referenceLinePlugin = {
  id: 'referenceLine',
  beforeDraw: (chart: any) => {
    const { ctx, chartArea, scales, data } = chart;
    
    if (scales.y && data.datasets && data.datasets.length > 0) {
      let maxValue = 0;
      
      data.datasets.forEach((dataset: any) => {
        if (dataset.data && Array.isArray(dataset.data)) {
          dataset.data.forEach((value: number) => {
            if (value > maxValue) {
              maxValue = value;
            }
          });
        }
      });
      
      if (chart.options.scales?.x?.stacked && chart.options.scales?.y?.stacked) {
        const categoryTotals: number[] = [];
        const numCategories = data.labels?.length || 0;
        
        for (let i = 0; i < numCategories; i++) {
          categoryTotals[i] = 0;
        }
        
        data.datasets.forEach((dataset: any) => {
          if (dataset.data && Array.isArray(dataset.data)) {
            dataset.data.forEach((value: number, index: number) => {
              categoryTotals[index] += value;
            });
          }
        });
        
        maxValue = Math.max(...categoryTotals);
      }
      
      const yPosition = scales.y.getPixelForValue(maxValue);
      
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(chartArea.left, yPosition);
      ctx.lineTo(chartArea.right, yPosition);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ff0000'; 
      ctx.setLineDash([5, 5]); 
      ctx.stroke();
      ctx.restore();
    }
  }
};