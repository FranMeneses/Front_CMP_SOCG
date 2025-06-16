import { useCallback } from "react";
import { Chart as ChartJS } from "chart.js";

export const useCharts = () => {

  const downloadChart = useCallback((
    chartRef: React.RefObject<ChartJS | null>,
    fileName: string = 'chart',
    format: 'png' | 'jpeg' = 'png'
  ) => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const url = canvas.toDataURL(`image/${format}`);
      const link = document.createElement('a');
      link.download = `${fileName}.${format}`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  return { downloadChart };
};