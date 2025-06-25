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

export const getBarChartOptions = (data: BarChartData, tooltipMode: TooltipMode = 'filter-zeros'): ChartOptions<'bar'> => {
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
    
    return maxValue > 0 ? maxValue + 100 : 100;
  };

  const dynamicMax = calculateMaxValue(data);

  // Configuración del tooltip según el modo
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
            
            // Formatear solo con separadores de miles, sin símbolo de moneda
            const formattedValue = new Intl.NumberFormat('es-CL', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value);
            
            return `${label}: ${formattedValue}`;
          },
          afterBody: function(tooltipItems: TooltipItem<'bar'>[]) {
            // Calcular y mostrar el total de todos los valles para esta categoría
            let total = 0;
            tooltipItems.forEach((item: TooltipItem<'bar'>) => {
              total += item.parsed.y || 0;
            });
            
            // Formatear el total sin símbolo de moneda
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
            
            // Mantener formato USD para gastos por departamento
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

  // Resto del código...
  return {
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
        max: dynamicMax,
        ticks: {
          stepSize: Math.ceil(dynamicMax / 10),
        },
        stacked: true,
        grid: {
          display: true,
        },
      },
    },
    plugins: {
      tooltip: getTooltipConfig(),
      legend: {
        display: false,
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

// Configuraciones específicas para cada tipo de gráfico
export const getBarChartOptionsForDepartments = (data: BarChartData) => {
  return getBarChartOptions(data, 'filter-zeros');
};

export const getBarChartOptionsForInvestmentLines = (data: BarChartData) => {
  return getBarChartOptions(data, 'show-totals');
};

// Plugin para la línea de referencia
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