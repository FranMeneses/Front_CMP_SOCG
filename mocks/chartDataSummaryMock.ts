export const pieChartDataSummaryMock = {
    labels: ['Valle del Huasco', 'Valle de Copiapó', 'Valle del Elqui'],
    datasets: [
        {
            data: [20,15,5],
            backgroundColor: ['#54B87E','#B0A3CC','#EFA585'],
            hoverBackgroundColor: ['#00953E','#573B92','#E66C37'],
            fill: true,
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
            fill: true,
        },
        {
            label: 'Valle de Copiapó',
            data: [4500, 8000, 9000, 12000, 20000, 22000, 28000, 20000, 18000, 34000, 50000, 20000],
            borderColor: '#573B92',
            backgroundColor: '#B0A3CC',
            fill: true,
        },
        {
            label: 'Valle del Elqui',
            data: [6700, 16000, 10000, 14000, 16000, 20000, 42000, 30000, 25000, 53000, 37000, 72000],
            borderColor: '#E66C37',
            backgroundColor: '#EFA585',
            fill: true,
        },
    ],
};

export const barChartDataSummaryMock = {
    labels: ['Calidad de vida','Desarrollo Productivo', 'Infrastructura Comunitaria', 'Fomración y educación', 'Identidad y Cultura'],
    datasets: [
        {
            label: 'Inversión',
            data: [20, 40, 15, 32, 12],
            backgroundColor: ['#E9D160'],
            hoverBackgroundColor: ['#BB9B09'],
        },
    ],
};