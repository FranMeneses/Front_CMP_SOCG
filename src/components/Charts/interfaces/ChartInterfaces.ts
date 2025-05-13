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
        id: string;
        data: number[];
        backgroundColor: string[];
        hoverBackgroundColor: string[];
    }>;
}

export interface PieChartProps {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
  }>;
}

export interface LineChartData {
    labels: string[];
    datasets: Array<{
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
        id?: string;
    }>;
}