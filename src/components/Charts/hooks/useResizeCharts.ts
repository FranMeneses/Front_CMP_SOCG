import { useEffect, RefObject } from "react";

interface Resizable {
  resize: () => void;
}

export const useResizeCharts = <T extends Resizable>(chartRef: RefObject<T | null>) => {
    useEffect(() => {
        const handleResize = () => {
            if (chartRef.current) {
                chartRef.current.resize(); 
            } else {
                console.error('Chart reference is null');
            }
        };
        window.addEventListener('resize', handleResize); 

        return () => window.removeEventListener('resize', handleResize); 
    }, [chartRef]);
}