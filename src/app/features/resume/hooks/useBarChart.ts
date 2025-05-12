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

    const barChartData = {
        labels: investmentNames,
        datasets: [
            {
                label: valleyNames[0],
                data: copiapoData,
                backgroundColor: ['#E9D160'],
                hoverBackgroundColor: ['#BB9B09'],
            },
            {
                label: valleyNames[1],
                data: huascoData,
                backgroundColor: ['#E9D160'],
                hoverBackgroundColor: ['#BB9B09'],
            },
            {
                label: valleyNames[2],
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