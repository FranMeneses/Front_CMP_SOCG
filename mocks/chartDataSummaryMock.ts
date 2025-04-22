
export const pieChartDataSummaryMock = {
    labels: ['Valle del Huasco', 'Valle de Copiapó', 'Valle del Elqui'],
    datasets: [
        {
            data: [20,15,5],
            backgroundColor: ['#54B87E','#B0A3CC','#EFA585'],
            hoverBackgroundColor: ['#00953E','#573B92','#E66C37'],
            fill: false,
        },
    ],
};

export const pieChartDataSummarySpecialistMock = {
    labels: ['Especialista Gestión Cumplimiento', 'Comite de Donaciones', 'Directorio'],
    datasets: [
        {
            data: [100,30,35],
            backgroundColor: ['#54B87E','#B0A3CC','#EFA585'],
            hoverBackgroundColor: ['#00953E','#573B92','#E66C37'],
            fill: false,
        },
    ],
};

export const chartDataSummaryMock = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [
        {
            label: 'Valle del Huasco',
            data: [5000, 10000, 12000, 20000, 23000, 30000, 28000, 40000, 43000, 48000, 55000, 60000],
            borderColor: '#00953E',
            backgroundColor: '#54B87E',
            fill: false,
        },
        {
            label: 'Valle de Copiapó',
            data: [4500, 8000, 9000, 12000, 20000, 22000, 28000, 20000, 18000, 34000, 50000, 20000],
            borderColor: '#573B92',
            backgroundColor: '#B0A3CC',
            fill: false,
        },
        {
            label: 'Valle del Elqui',
            data: [6700, 16000, 10000, 14000, 16000, 20000, 42000, 30000, 25000, 53000, 37000, 72000],
            borderColor: '#E66C37',
            backgroundColor: '#EFA585',
            fill: false,
        },
    ],
};

export const barChartDataSummaryMock = {
    labels: ['Calidad de vida','Desarrollo Productivo', 'Infrastructura Comunitaria', 'Formación y educación', 'Identidad y Cultura'],
    datasets: [
        {
            label:'Valle de Copiapó',
            data: [10, 20, 5, 17, 4],
            backgroundColor: ['#E9D160'],
            hoverBackgroundColor: ['#BB9B09'],

        },
        {
            label:'Valle del Elqui',
            data: [5, 15, 5, 15, 5],
            backgroundColor: ['#E9D160'],
            hoverBackgroundColor: ['#BB9B09'],
        },
        {
            label:'Valle del Huasco',
            data: [20, 40, 15, 32, 12],
            backgroundColor: ['#E9D160'],
            hoverBackgroundColor: ['#BB9B09'],
        },
    ],
};

const getColor = (percentage: number) => {
    if (percentage === 1) return 'rgba(84, 184, 126, 0.5)';
    if (percentage > 0.3 && percentage < 1) return 'rgba(230, 183, 55, 0.5)'; 
    return 'rgba(230, 76, 55, 0.5)'; 
};

const getHover = (percentage: number) => {
    if (percentage === 1) return 'rgba(84, 184, 126, 1)'; 
    if (percentage > 0.3 && percentage < 1) return 'rgba(230, 183, 55, 1)'; 
    return 'rgba(230, 76, 55, 1)'; 
};


export const ganttChartDataMock = {
    datasets: [
        {
            data: [
                { x: [Date.parse('03-24-2025'), Date.parse('04-16-2025')] as [number, number], y: 'Tarea 1', assigned: 'Juan Pérez', progress: 1 },
                { x: [Date.parse('04-03-2025'), Date.parse('04-17-2025')] as [number, number], y: 'Tarea 2', assigned: 'Joe Doe', progress: 0.8 },
                { x: [Date.parse('04-07-2025'), Date.parse('04-27-2025')] as [number, number], y: 'Tarea 3', assigned: 'Ana María', progress: 0.7 },
                { x: [Date.parse('04-24-2025'), Date.parse('04-30-2025')] as [number, number], y: 'Tarea 4', assigned: 'Pedro Pérez', progress: 0 },
                { x: [Date.parse('05-01-2025'), Date.parse('05-07-2025')] as [number, number], y: 'Tarea 5', assigned: 'Charly García', progress: 0 },
                { x: [Date.parse('05-08-2025'), Date.parse('05-15-2025')] as [number, number], y: 'Tarea 6', assigned: 'Luis Fernández', progress: 0 },
            ],
            backgroundColor: [
                getColor(1), 
                getColor(0.8), 
                getColor(0.7),  
                getColor(0.2),  
                getColor(0),  
                getColor(0),  
            ],
            hoverBackgroundColor: [
                getHover(1), 
                getHover(0.8), 
                getHover(0.7), 
                getHover(0), 
                getHover(0), 
                getHover(0), 
                ], 
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: 4,
            borderSkipped: false,
            barPercentage: 0.5,
            categoryPercentage: 0.8,
        },
    ],
};