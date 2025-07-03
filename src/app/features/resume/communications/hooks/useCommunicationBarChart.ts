import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_PROCESS_MONTHLY_EXPENSES } from "@/app/api/tasks";
import { ITaskExpense } from "@/app/models/ITasks";
import { CommunicationsColors } from "@/constants/colors";

export const useCommunicationBarChart = () => {
    const [loading, setLoading] = useState(true);
    const [internalCommunicationsTotal, setInternalCommunicationsTotal] = useState<number>(0);
    const [externalCommunicationsTotal, setExternalCommunicationsTotal] = useState<number>(0);
    const [publicAffairsTotal, setPublicAffairsTotal] = useState<number>(0);
    const [transversalTotal, setTransversalTotal] = useState<number>(0);

    const [getMonthlyExpenses] = useLazyQuery(GET_PROCESS_MONTHLY_EXPENSES);

    /**
     * Effect para obtener los gastos totales de cada tipo de comunicación.
     * @description Este efecto obtiene los gastos mensuales y los suma para obtener el total anual de cada proceso.
     */
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [
                    internalResponse,
                    externalResponse,
                    publicAffairsResponse,
                    transversalResponse
                ] = await Promise.all([
                    getMonthlyExpenses({
                        variables: { processId: 4, year: new Date().getFullYear() },
                    }),
                    getMonthlyExpenses({
                        variables: { processId: 5, year: new Date().getFullYear() },
                    }),
                    getMonthlyExpenses({
                        variables: { processId: 6, year: new Date().getFullYear() },
                    }),
                    getMonthlyExpenses({
                        variables: { processId: 7, year: new Date().getFullYear() },
                    })
                ]);

                const internalTotal = internalResponse.data?.processMonthlyExpenses?.reduce(
                    (sum: number, expense: ITaskExpense) => sum + (expense.expense || 0), 0
                ) || 0;

                const externalTotal = externalResponse.data?.processMonthlyExpenses?.reduce(
                    (sum: number, expense: ITaskExpense) => sum + (expense.expense || 0), 0
                ) || 0;

                const publicAffairsTotal = publicAffairsResponse.data?.processMonthlyExpenses?.reduce(
                    (sum: number, expense: ITaskExpense) => sum + (expense.expense || 0), 0
                ) || 0;

                const transversalTotal = transversalResponse.data?.processMonthlyExpenses?.reduce(
                    (sum: number, expense: ITaskExpense) => sum + (expense.expense || 0), 0
                ) || 0;

                setInternalCommunicationsTotal(internalTotal);
                setExternalCommunicationsTotal(externalTotal);
                setPublicAffairsTotal(publicAffairsTotal);
                setTransversalTotal(transversalTotal);

            } catch (error) {
                console.error("Error fetching expenses data:", error);
                setInternalCommunicationsTotal(0);
                setExternalCommunicationsTotal(0);
                setPublicAffairsTotal(0);
                setTransversalTotal(0);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [getMonthlyExpenses]);

    const barChartData = {
        labels: ["Comunicaciones Internas", "Comunicaciones Externas", "Asuntos Públicos", "Transversales"],
        datasets: [
            {
                label: "Comunicaciones Internas",
                id: "Comunicaciones Internas",
                data: [internalCommunicationsTotal, 0, 0, 0],    
                backgroundColor: [CommunicationsColors[0]],
                hoverBackgroundColor: [CommunicationsColors[0]],
            },
            {
                label: "Comunicaciones Externas",
                id: "Comunicaciones Externas",
                data: [0, externalCommunicationsTotal, 0, 0],
                backgroundColor: [CommunicationsColors[1]],
                hoverBackgroundColor: [CommunicationsColors[1]],
            },
            {
                label: "Asuntos Públicos",
                id: "Asuntos Públicos",
                data: [0, 0, publicAffairsTotal, 0],
                backgroundColor: [CommunicationsColors[2]],
                hoverBackgroundColor: [CommunicationsColors[2]],
            },
            {
                label: "Transversales",
                id: "Transversales",
                data: [0, 0, 0, transversalTotal],
                backgroundColor: [CommunicationsColors[3]],
                hoverBackgroundColor: [CommunicationsColors[3]],
            }
        ],
    };

    return { barChartData, loading };
};