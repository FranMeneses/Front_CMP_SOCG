export interface GanttChartData {
    datasets: Array<{
        data: Array<{
            x: [number, number]; 
            y: string; 
            assigned: string;
            progress: number;
        }>;
        backgroundColor: string[];
        hoverBackgroundColor: string[];
    }>;
}

export interface BarChartData {
    labels: string[];
    datasets: Array<{
        label: string;
        data: number[];
        backgroundColor: string[];
        hoverBackgroundColor: string[];
    }>;
}