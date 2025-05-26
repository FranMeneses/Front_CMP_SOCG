import { GET_ALL_INVESTMENTS, GET_VALLEY_INVESTMENT_TASKS_COUNT } from "@/app/api/infoTask";
import { useData } from "@/context/DataContext";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { IInvestment } from "@/app/models/IInfoTask";

export function useBarChart() {
    const [getValleyInvesment] = useLazyQuery(GET_VALLEY_INVESTMENT_TASKS_COUNT);
    const {data: investmentData} = useQuery(GET_ALL_INVESTMENTS);
    const [copiapoData, setCopiapoData] = useState<number[]>([]);
    const [huascoData, setHuascoData] = useState<number[]>([]);
    const [elquiData, setElquiData] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    
    const { valleys } = useData();
    const valleyNames = valleys ? valleys.map(valley => valley.name) : [];
    const investmentNames = investmentData?.investments.map((investment: IInvestment )=> investment.line) || [];

    /**
     * Función para obtener las inversiones del Valle de Copiapó.
     * @description Realiza una consulta para cada inversión del valle y devuelve un array con el número de tareas por inversión.
     * @returns 
     */
    const handleGetCopiapoInvesment = async () => {
        try {
            const results = await Promise.all(
                Array.from({ length: 6 }, (_, i) => i + 1).map(async (investmentId) => {
                    const { data } = await getValleyInvesment({
                        variables: {
                            valleyId: 1,
                            investmentId,
                        },
                    });
                    return data?.valleyInvestmentTasksCount || 0;
                })
            );
            
            setCopiapoData(results);
            return results;
        }
        catch (error) {
            console.error("Error fetching Copiapó data:", error);
            setCopiapoData([]);
            return [];
        }
    };

    /**
     * Función para obtener las inversiones del Valle del Huasco.
     * @description Realiza una consulta para cada inversión del valle y devuelve un array con el número de tareas por inversión.
     * @returns 
     */
    const handleGetHuascoInvesment = async () => {
        try {
            const results = await Promise.all(
                Array.from({ length: 6 }, (_, i) => i + 1).map(async (investmentId) => {
                    const { data } = await getValleyInvesment({
                        variables: {
                            valleyId: 2,
                            investmentId,
                        },
                    });
                    return data?.valleyInvestmentTasksCount || 0;
                })
            );
            
            setHuascoData(results);
            return results;
        }
        catch (error) {
            console.error("Error fetching Huasco data:", error);
            setHuascoData([]);
            return [];
        }
    };

    /**
     * Función para obtener las inversiones del Valle del Elqui.
     * @description Realiza una consulta para cada inversión del valle y devuelve un array con el número de tareas por inversión.
     * @returns 
     */
    const handleGetElquiInvesment = async () => {
        try {
            const results = await Promise.all(
                Array.from({ length: 6 }, (_, i) => i + 1).map(async (investmentId) => {
                    const { data } = await getValleyInvesment({
                        variables: {
                            valleyId: 3,
                            investmentId,
                        },
                    });
                    return data?.valleyInvestmentTasksCount || 0;
                })
            );
            
            setElquiData(results);
            return results;
        }
        catch (error) {
            console.error("Error fetching Elqui data:", error);
            setElquiData([]);
            return [];
        }
    };

    /**
     * Hook para obtener los datos de las inversiones de los valles.
     * @description Utiliza useEffect para llamar a las funciones de obtención de datos al cargar el componente.
     */
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            await Promise.all([
                handleGetCopiapoInvesment(),
                handleGetHuascoInvesment(),
                handleGetElquiInvesment()
            ]);
            setLoading(false);
        };
        
        fetchAllData();
    }, []); 

    /**
     * Genera los datos para el gráfico de barras.
     * @description Crea un objeto con las etiquetas y los datasets necesarios para el gráfico de barras.
     */
    const barChartData = {
        labels: investmentNames,
        datasets: [
            {
                label: valleyNames[0],
                id: 'Valle de Copiapó',
                data: copiapoData,
                backgroundColor: ['#E9D160'],
                hoverBackgroundColor: ['#BB9B09'],
            },
            {
                label: valleyNames[1],
                id: 'Valle del Huasco',
                data: huascoData,
                backgroundColor: ['#E9D160'],
                hoverBackgroundColor: ['#BB9B09'],
            },
            {
                label: valleyNames[2],
                id: 'Valle del Elqui',
                data: elquiData,
                backgroundColor: ['#E9D160'],
                hoverBackgroundColor: ['#BB9B09'],
            },
        ],
    };

    return {
        barChartData,
        loading
    };
}