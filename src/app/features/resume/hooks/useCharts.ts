import { useCallback } from "react";
import { Chart as ChartJS } from "chart.js";

export const useCharts = () => {

  /**
   * Función para descargar un gráfico como imagen.
   * @description Utiliza la referencia del gráfico para obtener el canvas y convertirlo a una URL de imagen.
   * @param chartRef - Referencia al gráfico de Chart.js.
   * @param fileName - Nombre del archivo a descargar (por defecto 'chart').
   * @param format - Formato de la imagen ('png' o 'jpeg', por defecto 'png').
   * @returns {void}
   */
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