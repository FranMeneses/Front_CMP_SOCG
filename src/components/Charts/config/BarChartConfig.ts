import { ChartOptions, ChartData, TooltipItem, Chart } from 'chart.js';

type TooltipMode = 'filter-zeros' | 'show-totals';

interface Dataset {
  label?: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

interface ChartDataset extends Dataset {
  [key: string]: unknown;
}

interface BarChartData {
  labels?: string[];
  datasets: ChartDataset[];
}

export const getBarChartOptions = (data: BarChartData, tooltipMode: TooltipMode = 'filter-zeros', onLegendClick?: (legend: string) => void): ChartOptions<'bar'> => {
  const calculateMaxValue = (chartData: BarChartData): number => {
    let maxValue = 0;
    
    if (chartData && chartData.datasets && Array.isArray(chartData.datasets)) {
      if (chartData.datasets.length > 1) {
        const categoryTotals: number[] = [];
        const numCategories = chartData.labels?.length || 0;
        
        for (let i = 0; i < numCategories; i++) {
          categoryTotals[i] = 0;
        }
        
        chartData.datasets.forEach((dataset: ChartDataset) => {
          if (dataset.data && Array.isArray(dataset.data)) {
            dataset.data.forEach((value: number, index: number) => {
              if (typeof value === 'number' && !isNaN(value)) {
                categoryTotals[index] += value;
              }
            });
          }
        });
        
        maxValue = Math.max(...categoryTotals.filter(total => !isNaN(total)));
      } else {
        chartData.datasets.forEach((dataset: ChartDataset) => {
          if (dataset.data && Array.isArray(dataset.data)) {
            dataset.data.forEach((value: number) => {
              if (typeof value === 'number' && !isNaN(value) && value > maxValue) {
                maxValue = value;
              }
            });
          }
        });
      }
    }
    
    return maxValue > 0 ? maxValue + 10 : 100;
  };

  const dynamicMax = calculateMaxValue(data);

  const getTooltipConfig = () => {
    if (tooltipMode === 'show-totals') {
      return {
        mode: 'index' as const,
        intersect: false,
        enabled: true,
        callbacks: {
          title: function(tooltipItems: TooltipItem<'bar'>[]) {
            if (tooltipItems.length > 0) {
              return tooltipItems[0].label;
            }
            return '';
          },
          label: function(tooltipItem: TooltipItem<'bar'>) {
            const label = tooltipItem.dataset.label || '';
            const value = tooltipItem.parsed.y;
            
            const formattedValue = new Intl.NumberFormat('es-CL', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value);
            
            return `${label}: ${formattedValue}`;
          },
          afterBody: function(tooltipItems: TooltipItem<'bar'>[]) {
            let total = 0;
            tooltipItems.forEach((item: TooltipItem<'bar'>) => {
              total += item.parsed.y || 0;
            });
            
            const formattedTotal = new Intl.NumberFormat('es-CL', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(total);
            
            return [`Total: ${formattedTotal}`];
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        footerColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true,
        padding: 10,
      };
    } else {
      return {
        mode: 'index' as const,
        intersect: false,
        enabled: true,
        filter: function(tooltipItem: TooltipItem<'bar'>) {
          return tooltipItem.parsed.y !== 0;
        },
        callbacks: {
          title: function(tooltipItems: TooltipItem<'bar'>[]) {
            if (tooltipItems.length > 0) {
              return tooltipItems[0].label;
            }
            return '';
          },
          label: function(tooltipItem: TooltipItem<'bar'>) {
            if (tooltipItem.parsed.y === 0) {
              return '';
            }
            
            const label = tooltipItem.dataset.label || '';
            const value = tooltipItem.parsed.y;
            
            const formattedValue = new Intl.NumberFormat('es-CL', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value);
            
            return `${label}: ${formattedValue}`;
          },
          afterLabel: function(tooltipItem: TooltipItem<'bar'>) {
            return tooltipItem.parsed.y === 0 ? '' : '';
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true,
        padding: 10,
      };
    }
  };

  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false,
        ticks: {
          stepSize: 10,
        },
        grid: {
          display: false,
        },
      },
      y: {
        min: 0, 
        max: dynamicMax,
        ticks: {
          stepSize: Math.ceil(dynamicMax / 10),
        },
        stacked: false,
        grid: {
          display: true,
        },
      },
    },
    plugins: {
      tooltip: getTooltipConfig(),
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: 'Helvetica',
          },
        },
        onClick: onLegendClick
          ? (_event, legendItem) => onLegendClick(legendItem.text)
          : undefined,
      },
      title: {
        display: true,
        color: '#000',
        position: 'top' as const,
        align: 'start' as const,
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
};

export const getBarChartOptionsForDepartments = (data: BarChartData, onLegendClick?: (legend: string) => void) => {
  return getBarChartOptions(data, 'filter-zeros', onLegendClick);
};

export const getBarChartOptionsForInvestmentLines = (data: BarChartData, onLegendClick?: (legend: string) => void) => {
  return getBarChartOptions(data, 'show-totals', onLegendClick);
};

export const referenceLinePlugin = {
  id: 'referenceLine',
  beforeDraw: (chart: Chart) => {
    const ctx = chart.ctx;
    const chartArea = chart.chartArea;
    const scales = chart.scales;
    const data = chart.data as ChartData<'bar'>;
    
    if (scales.y && data.datasets && data.datasets.length > 0) {
      let maxValue = 0;
      
      data.datasets.forEach((dataset) => {
        if (dataset.data && Array.isArray(dataset.data)) {
          dataset.data.forEach((value) => {
            const numValue = typeof value === 'number' ? value : 0;
            if (numValue > maxValue) {
              maxValue = numValue;
            }
          });
        }
      });
      
      if (
        (chart.options.scales?.x as { stacked?: boolean })?.stacked &&
        (chart.options.scales?.y as { stacked?: boolean })?.stacked
      ) {
        const categoryTotals: number[] = [];
        const numCategories = data.labels?.length || 0;
        
        for (let i = 0; i < numCategories; i++) {
          categoryTotals[i] = 0;
        }
        
        data.datasets.forEach((dataset) => {
          if (dataset.data && Array.isArray(dataset.data)) {
            dataset.data.forEach((value, index) => {
              const numValue = typeof value === 'number' ? value : 0;
              categoryTotals[index] += numValue;
            });
          }
        });
        
        if (categoryTotals.length > 0) {
          maxValue = Math.max(...categoryTotals);
        }
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