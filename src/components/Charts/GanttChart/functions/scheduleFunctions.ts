import { GanttChartData } from "../../interfaces/ChartInterfaces";
   
export const getMaxDate = ({data}: {data: GanttChartData}) => {
    const allDates = data.datasets.flatMap(dataset => 
        dataset.data.map(entry => Array.isArray(entry.x) ? entry.x[1] : entry.x)
    );
    const latestDate = Math.max(...allDates);
    const maxDate = new Date(latestDate);
    maxDate.setDate(maxDate.getDate() + 3); 
    return maxDate;
};

export const getMinDate = ({data}: {data: GanttChartData}) => {
        const allDates = data.datasets.flatMap(dataset => 
            dataset.data.map(entry => Array.isArray(entry.x) ? entry.x[0] : entry.x)
        );
        const earliestDate = Math.min(...allDates);
        const minDate = new Date(earliestDate);
        minDate.setDate(minDate.getDate() - 3); 
        return minDate;
    };

export const getDynamicTitle = ({data}: {data: GanttChartData}) => {
        const minDate = getMinDate({data});
        const maxDate = getMaxDate({data});
    
        const minMonth = minDate.toLocaleDateString('es-CL', { month: 'long' }).replace(/^\w/, (c) => c.toUpperCase());
        const minYear = minDate.getFullYear();
        const maxMonth = maxDate.toLocaleDateString('es-CL', { month: 'long' }).replace(/^\w/, (c) => c.toUpperCase());
        const maxYear = maxDate.getFullYear();
    
        if (minYear === maxYear) {
            return `${minMonth} - ${maxMonth} ${minYear}`;
        }
    
        return `${minMonth} ${minYear} - ${maxMonth} ${maxYear}`;
    };