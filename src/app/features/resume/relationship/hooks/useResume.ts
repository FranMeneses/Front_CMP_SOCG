import { useEffect, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_TASKS, GET_TOTAL_BUDGET_BY_MONTH, GET_TOTAL_EXPENSE_BY_MONTH } from "@/app/api/tasks";
import { GET_TASK_SUBTASKS } from "@/app/api/tasks";
import { ISubtask } from "@/app/models/ISubtasks";
import { Months } from "@/constants/months";

export function useResume() {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [selectedLegend, setSelectedLegend] = useState<string | null>(null);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [yearlyBudgetTotal, setYearlyBudgetTotal] = useState(0);
    const [yearlyExpensesTotal, setYearlyExpensesTotal] = useState(0);
    const [subtasks, setSubtasks] = useState<ISubtask[]>([]);
    const [budgetLoading, setBudgetLoading] = useState(true);
    const [formattedBudget, setFormattedBudget] = useState("");
    const [formattedExpenses, setFormattedExpenses] = useState("");
    
    const { data, loading: tasksLoading, error } = useQuery(GET_TASKS);
    const [getSubtasks, { data: subtasksData, loading: subtasksLoading } ]= useLazyQuery(GET_TASK_SUBTASKS);
    const [getMonthBudget] = useLazyQuery(GET_TOTAL_BUDGET_BY_MONTH)
    const [getMonthExpenses] = useLazyQuery(GET_TOTAL_EXPENSE_BY_MONTH)

    const handleLegendClick = (legend: string) => {
        setSelectedLegend((prev) => (prev === legend ? null : legend));
    };

    const handleTaskClick = async (taskId: string) => {
        if (selectedTaskId === taskId) {
            setSelectedTaskId(null);
            setSubtasks([]);
        } else {
            setSelectedTaskId(taskId);
            await handleGetSubtasks(taskId);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    /**
     * Función para formatear un valor numérico como moneda.
     * @description Utiliza Intl.NumberFormat para formatear el valor numérico a una cadena de texto con formato de moneda.
     * @param value Valor numérico a formatear.
     * @returns 
     */
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('es-ES', {
            maximumFractionDigits: 0
        }).format(value);
    };

    /**
     * Función para obtener las subtareas de una tarea seleccionada.
     * @description Realiza una consulta para obtener las subtareas de la tarea seleccionada por su ID.
     * @param selectedTaskId ID de la tarea seleccionada para obtener sus subtareas.
     */
    const handleGetSubtasks = async (selectedTaskId: string) => {
        try {
            const { data } = await getSubtasks({
                variables: { id: selectedTaskId }, 
            });
            if (data && data.taskSubtasks) {
                setSubtasks(data.taskSubtasks);
            } else {
                console.warn("No subtasks found for task ID:", selectedTaskId);
                setSubtasks([]);
            }
        } catch (error) {
            setSubtasks([]);
            console.error("Error fetching subtasks:", error);
        }
    };

    /**
     * Función para calcular el presupuesto anual.
     * @description Recorre los meses del año y realiza una consulta para obtener el presupuesto total de cada mes, sumando los resultados.
     * @returns 
     */
    const YearlyBudget = async () => {
        let totalBudget = 0;
        
        try {
            for (const month of Months) {
                const { data: BudgetData } = await getMonthBudget({
                    variables: { monthName: month, year: new Date().getFullYear() }, //TODO: PEDIR AGREGAR PROCESO AL BACKEND
                });
                
                if (BudgetData && BudgetData.totalBudgetByMonth) {
                    totalBudget += BudgetData.totalBudgetByMonth || 0;
                }
            }
            return totalBudget;
        } catch (error) {
            console.error("Error calculating yearly budget:", error);
            return 0;
        }
    };

    /**
     * Función para calcular los gastos anuales.
     * @description Recorre los meses del año y realiza una consulta para obtener el total de gastos de cada mes, sumando los resultados.
     * @returns 
     */
    const YearlyExpenses = async () => {
        let totalExpenses = 0;
        
        try {
            for (const month of Months) {
                const { data: ExpensesData } = await getMonthExpenses({
                    variables: { monthName: month, year: new Date().getFullYear()}, //TODO: PEDIR AGREGAR PROCESO AL BACKEND
                });
                
                if (ExpensesData && ExpensesData.totalExpenseByMonth) {
                    totalExpenses += ExpensesData.totalExpenseByMonth || 0;
                }
            }
            return totalExpenses;
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
                const budgetTotal = await YearlyBudget();
                setYearlyBudgetTotal(budgetTotal);
                setFormattedBudget(formatCurrency(budgetTotal));
                
                const expensesTotal = await YearlyExpenses();
                setYearlyExpensesTotal(expensesTotal);
                setFormattedExpenses(formatCurrency(expensesTotal));
            } catch (error) {
                console.error("Error loading budget data:", error);
            } finally {
                setBudgetLoading(false);
            }
        };
        
        loadBudgetData();
    }, []); 
    
    const loading = tasksLoading || budgetLoading;

    return {
        loading,
        tasksLoading,
        budgetLoading,
        data,
        isSidebarOpen,
        selectedLegend,
        selectedTaskId,
        subtasks,
        subtasksLoading,
        formattedBudget,
        formattedExpenses,
        handleLegendClick,
        handleTaskClick,
        toggleSidebar,
    };
}