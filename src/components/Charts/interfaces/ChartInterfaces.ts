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

interface BaseChartDataset {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    id?: string;
    borderWidth?: number;
}

interface LineDataset extends BaseChartDataset {
    type: 'line';
    borderDash?: number[];
    pointRadius?: number;
    fill?: boolean;
    order?: number;
    tension?: number;
}

interface BarDataset extends BaseChartDataset {
    type: 'bar';
    hoverBackgroundColor?: string;
    barPercentage?: number;
    categoryPercentage?: number;
    order?: number;
}

export interface ComboChartData {
    labels: string[];
    datasets: Array<LineDataset | BarDataset | (BaseChartDataset & { type?: 'line' | 'bar' })>;
}