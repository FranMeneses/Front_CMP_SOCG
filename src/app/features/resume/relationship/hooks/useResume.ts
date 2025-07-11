import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_TASK_PROGRESS, GET_TASKS_BY_PROCESS, GET_TOTAL_BUDGET_BY_MONTH_AND_PROCESS, GET_TOTAL_EXPENSE_BY_MONTH_AND_PROCESS, GET_TASKS_BY_MONTH_AND_PROCESS } from "@/app/api/tasks";
import { Months } from "@/constants/months";
import { ITask } from "@/app/models/ITasks";
import { useQuery } from '@tanstack/react-query';

export function useResume(selectedMonth?: string) {
    
    const [selectedLegend, setSelectedLegend] = useState<string | null>(null);

    const [copiapoTasks, setCopiapoTasks] = useState<ITask[]>([]);
    const [huascoTasks, setHuascoTasks] = useState<ITask[]>([]);
    const [elquiTasks, setElquiTasks] = useState<ITask[]>([]);
    
    const [copiapoFinished, setCopiapoFinished] = useState<number>(0);
    const [huascoFinished, setHuascoFinished] = useState<number>(0);
    const [elquiFinished, setElquiFinished] = useState<number>(0);
    const [yearlyBudgetTotal, setYearlyBudgetTotal] = useState<number>(0);
    const [yearlyExpensesTotal, setYearlyExpensesTotal] = useState<number>(0);

    const [budgetLoading, setBudgetLoading] = useState<boolean>(true);
    const [isLoadingTaskDetails, ] = useState<boolean>(false);

    const [formattedBudget, setFormattedBudget] = useState<string>("");
    const [formattedExpenses, setFormattedExpenses] = useState<string>("");

    const [getTasksByProcess] = useLazyQuery(GET_TASKS_BY_PROCESS);
    const [getTaskPercentage] = useLazyQuery(GET_TASK_PROGRESS);
    const [getMonthBudget] = useLazyQuery(GET_TOTAL_BUDGET_BY_MONTH_AND_PROCESS);
    const [getMonthExpenses] = useLazyQuery(GET_TOTAL_EXPENSE_BY_MONTH_AND_PROCESS);
    const [getTasksByMonthAndProcess] = useLazyQuery(GET_TASKS_BY_MONTH_AND_PROCESS);

    /**
     * Función para manejar el clic en una leyenda del gráfico.
     * @description Cambia la leyenda seleccionada o la deselecciona si ya estaba seleccionada.
     * @param legend Leyenda que se ha hecho clic.
     * @returns {void}
     */
    const handleLegendClick = (legend: string) => {
        setSelectedLegend((prev) => (prev === legend ? null : legend));
    };

    /**
     * Función para formatear un valor numérico como moneda.
     * @description Utiliza Intl.NumberFormat para formatear el valor numérico a una cadena de texto con formato de moneda.
     * @param value Valor numérico a formatear.
     * @returns {string} Retorna el valor formateado como cadena de texto.
     * @returns {void}
     */
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('es-ES', {
            maximumFractionDigits: 0
        }).format(value);
    };

    /**
     * Función para calcular el presupuesto anual.
     * @description Recorre los meses del año y realiza una consulta para obtener el presupuesto total de cada mes, sumando los resultados.
     * @param processId ID del proceso para el cual se calculará el presupuesto.
     * @returns {Promise<number>} Retorna una promesa que resuelve con el total del presupuesto anual.
     * @returns {void}
     */
    const YearlyBudget = async (processId: number) => {
        try {
            const promises = Months.map(month =>
                getMonthBudget({
                    variables: { monthName: month, year: new Date().getFullYear(), processId },
                })
            );
            const results = await Promise.all(promises);
            return results.reduce((total, { data }) => total + (data?.totalBudgetByMonthAndProcess || 0), 0);
        } catch (error) {
            console.error("Error calculating yearly budget:", error);
            return 0;
        }
    };

    /**
     * Función para calcular los gastos anuales.
     * @description Recorre los meses del año y realiza una consulta para obtener el total de gastos de cada mes, sumando los resultados.
     * @param processId ID del proceso para el cual se calcularán los gastos anuales.
     * @returns {Promise<number>} Retorna una promesa que resuelve con el total de gastos anuales del proceso.
     * @returns {number} Retorna 0 si hay un error o si no se pueden obtener los datos.
     * @returns {void}
     */
    const YearlyExpenses = async (processId: number) => {
        try {
            const promises = Months.map(month =>
                getMonthExpenses({
                    variables: { monthName: month, year: new Date().getFullYear(), processId },
                })
            );
            const results = await Promise.all(promises);
            return results.reduce((total, { data }) => total + (data?.totalExpenseByMonthAndProcess || 0), 0);
        } catch (error) {
            console.error("Error calculating yearly expenses:", error);
            return 0;
        }
    };
  
    /**
     * Hook para cargar los datos del presupuesto y gastos anuales.
     * @description Este efecto se ejecuta una vez al montar el componente, cargando los datos del presupuesto y gastos anuales.
     */
    useEffect(() => {
        const loadBudgetData = async () => {
            setBudgetLoading(true);
            try {
                const relationshipProcessIds = [1, 2, 3];
                // Paralelizar presupuestos
                const budgetPromises = relationshipProcessIds.map(processId => YearlyBudget(processId));
                const budgets = await Promise.all(budgetPromises);
                const totalBudget = budgets.reduce((acc, val) => acc + val, 0);
                setYearlyBudgetTotal(totalBudget);
                setFormattedBudget(formatCurrency(totalBudget));
                // Paralelizar gastos
                const expensesPromises = relationshipProcessIds.map(processId => YearlyExpenses(processId));
                const expenses = await Promise.all(expensesPromises);
                const totalExpenses = expenses.reduce((acc, val) => acc + val, 0);
                setYearlyExpensesTotal(totalExpenses);
                setFormattedExpenses(formatCurrency(totalExpenses));
            } catch (error) {
                console.error("Error loading budget data:", error);
            } finally {
                setBudgetLoading(false);
            }
        };
        loadBudgetData();
    }, []); 
    
    const loading = isLoadingTaskDetails || budgetLoading;

    /**
     * Hook para cargar las tareas de los procesos de relacionamiento al montar el componente.
     * @description Este efecto se ejecuta una vez al montar el componente, cargando las tareas de los procesos de relacionamiento.
     */
    const {
      data: tasksDataQuery = [],
      refetch: refetchTasks
    } = useQuery({    
        queryKey: ['relationship-tasks', selectedMonth],
        queryFn: async () => {
            // Si hay mes seleccionado, obtener tareas de todos los procesos para ese mes
            if (selectedMonth) {
                const relationshipProcessIds = [1, 2, 3];
                const copiapoTask: ITask[] = [];
                const huascoTask: ITask[] = [];
                const elquiTask: ITask[] = [];
                const allTasks: ITask[] = [];
                for (const processId of relationshipProcessIds) {
                    const { data } = await getTasksByMonthAndProcess({
                        variables: { monthName: selectedMonth, year: new Date().getFullYear(), processId },
                    });
                    const processTasks = data?.tasksByMonthAndProcess || [];
                    if (processId === 1) {
                        copiapoTask.push(...processTasks);
                    } else if (processId === 2) {
                        huascoTask.push(...processTasks);
                    } else if (processId === 3) {
                        elquiTask.push(...processTasks);
                    }
                    allTasks.push(...processTasks);
                }
                setCopiapoTasks(copiapoTask);
                setHuascoTasks(huascoTask);
                setElquiTasks(elquiTask);
                return allTasks;
            }
            // Si no hay filtro, comportamiento original
            const relationshipProcessIds = [1, 2, 3]; 
            const copiapoTask: ITask[] = [];
            const huascoTask: ITask[] = [];
            const elquiTask: ITask[] = [];
            const allTasks: ITask[] = [];
            for (const processId of relationshipProcessIds) {
                const { data } = await getTasksByProcess({
                    variables: { processId },
                });
                const processTasks = data?.tasksByProcess || [];
                if (processId === 1) {
                    copiapoTask.push(...processTasks);
                } else if (processId === 2) {
                    huascoTask.push(...processTasks);
                } else if (processId === 3) {
                    elquiTask.push(...processTasks);
                }
                allTasks.push(...processTasks);
            }
            setCopiapoTasks(copiapoTask);
            setHuascoTasks(huascoTask);
            setElquiTasks(elquiTask);
            return allTasks;
        },
        staleTime: 0, // Siempre refetch
        refetchOnMount: true, // Refresca al montar
        refetchOnWindowFocus: true, // Refresca al volver a la pestaña
    });

    useEffect(() => {
        const fetchAveragePercentages = async () => {
            if (copiapoTasks.length > 0 || huascoTasks.length > 0 || elquiTasks.length > 0) {
                const copiapoFinished = await handleGetAveragePercentage(copiapoTasks);
                const huascoFinished = await handleGetAveragePercentage(huascoTasks);
                const elquiFinished = await handleGetAveragePercentage(elquiTasks);
                setCopiapoFinished(Array.isArray(copiapoFinished) ? copiapoFinished.length : 0);
                setHuascoFinished(Array.isArray(huascoFinished) ? huascoFinished.length : 0);
                setElquiFinished(Array.isArray(elquiFinished) ? elquiFinished.length : 0);
            }
        };
        fetchAveragePercentages();
    }, [copiapoTasks, huascoTasks, elquiTasks]);

    /**
     * Función para obtener el porcentaje de finalización de las tareas.
     * @description Realiza una consulta para obtener el porcentaje de finalización de cada tarea y devuelve un array con los resultados.
     * @param tasks Array de tareas para las cuales se calculará el porcentaje de finalización.
     * @returns {Promise<number[]>} Retorna una promesa que resuelve con un array de porcentajes de finalización.
     * @returns {void}
     */
    const handleGetAveragePercentage = async (tasks: ITask[]) => {
        if (tasks.length === 0) return 0;
        const promises = tasks.map(async (task: ITask) => {
            try {
                const { data } = await getTaskPercentage({
                    variables: { id: task.id },
                });
                return data?.taskProgress || 0;
            } catch (error) {
                console.error("Error getting task progress:", error);
                return 0;
            }
        });
        const results = await Promise.all(promises);
        const finished = results.filter((r:number) => r === 100);
        return finished;
    };

    const ElquiData = {
        labels: ["Completado", "Pendiente"],
        datasets: [
            {
                data: [elquiFinished, elquiTasks.length - elquiFinished],
                id: [],
                backgroundColor: ['#1964CB', '#E9E9E9'],
                hoverBackgroundColor: ['#1964CB', '#E9E9E9'],
            },
        ],
    };

    const CopiapoData = {
        labels: ["Completado", "Pendiente"],
        datasets: [
            {
                data: [copiapoFinished, copiapoTasks.length - copiapoFinished],
                id: [],
                backgroundColor: ['#1964CB', '#E9E9E9'],
                hoverBackgroundColor: ['#1964CB', '#E9E9E9'],
            },
        ],
    };

    const HuascoData = {
        labels: ["Completado", "Pendiente"],
        datasets: [
            {
                data: [huascoFinished, huascoTasks.length - huascoFinished],
                id: [],
                backgroundColor: ['#1964CB', '#E9E9E9'],
                hoverBackgroundColor: ['#1964CB', '#E9E9E9'],
            },
        ],
    };
    return {
        loading,
        budgetLoading,
        tasksData: tasksDataQuery,
        selectedLegend,
        yearlyBudgetTotal,
        yearlyExpensesTotal,
        formattedBudget,
        formattedExpenses,
        CopiapoData,
        HuascoData,
        ElquiData,
        handleLegendClick,
        refetchTasks,
    };
}