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

// Define base interface for shared properties
interface BaseChartDataset {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    id?: string;
    borderWidth?: number;
}

// Line-specific dataset interface
interface LineDataset extends BaseChartDataset {
    type: 'line';
    borderDash?: number[];
    pointRadius?: number;
    fill?: boolean;
    order?: number;
    tension?: number;
}

// Bar-specific dataset interface
interface BarDataset extends BaseChartDataset {
    type: 'bar';
    hoverBackgroundColor?: string;
    barPercentage?: number;
    categoryPercentage?: number;
    order?: number;
}

// Enhanced ComboChartData interface that can handle both dataset types
export interface ComboChartData {
    labels: string[];
    datasets: Array<LineDataset | BarDataset | (BaseChartDataset & { type?: 'line' | 'bar' })>;
}