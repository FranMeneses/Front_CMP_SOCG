import { useEffect } from "react";

export const useResizeCharts = (chartRef: React.RefObject<any>) => {
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