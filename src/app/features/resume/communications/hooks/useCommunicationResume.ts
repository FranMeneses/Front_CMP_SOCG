import { GET_TASK_SUBTASKS, GET_TASKS_BY_PROCESS, GET_TOTAL_BUDGET_BY_MONTH_AND_PROCESS, GET_TOTAL_EXPENSE_BY_MONTH_AND_PROCESS } from "@/app/api/tasks";
import { ISubtask } from "@/app/models/ISubtasks";
import { ITask } from "@/app/models/ITasks";
import { Months } from "@/constants/months";
import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useQuery } from '@tanstack/react-query';

export function useCommunicationResume() {
    const [budgetLoading, setBudgetLoading] = useState(false);
    const [subtasks, setSubtasks] = useState<ISubtask[]>([]);
    const [selectedLegend, setSelectedLegend] = useState<string | null>(null);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [formattedBudget, setFormattedBudget] = useState("");
    const [formattedExpenses, setFormattedExpenses] = useState("");
    const [yearlyBudgetTotal, setYearlyBudgetTotal] = useState(0);
    const [yearlyExpensesTotal, setYearlyExpensesTotal] = useState(0);
    
    
    const [getTasksByProcess] = useLazyQuery(GET_TASKS_BY_PROCESS);
    const [getSubtasks]= useLazyQuery(GET_TASK_SUBTASKS);
    const [getMonthBudget] = useLazyQuery(GET_TOTAL_BUDGET_BY_MONTH_AND_PROCESS);
    const [getMonthExpenses] = useLazyQuery(GET_TOTAL_EXPENSE_BY_MONTH_AND_PROCESS);

    const {
      data: tasksDataQuery = [],
      isLoading: isLoadingTaskDetailsQuery,
    } = useQuery({
      queryKey: ['communications-tasks'],
      queryFn: async () => {
        const communicationProcessIds = [4, 5, 6, 7]; 
        const allTasks: ITask[] = [];
        for (const processId of communicationProcessIds) {
          const { data } = await getTasksByProcess({
            variables: { processId },
          });
          const processTasks = data?.tasksByProcess || [];
          allTasks.push(...processTasks);
        }
        return allTasks;
      },
      staleTime: 1000 * 60 * 10, // 10 minutos
    });

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
     * Función para manejar el clic en una tarea.
     * @description Si la tarea ya está seleccionada, la deselecciona y limpia las subtareas. Si no, selecciona la tarea y obtiene sus subtareas.
     * @param taskId ID de la tarea que se ha hecho clic.
     * @returns {Promise<void>}
     * @returns {void}
     */
    const handleTaskClick = async (taskId: string) => {
      if (selectedTaskId === taskId) {
            setSelectedTaskId(null);
            setSubtasks([]);
        } else {
            setSelectedTaskId(taskId);
            await handleGetSubtasks(taskId);
        }
    };


    /**
     * Función para obtener las subtareas de una tarea seleccionada.
     * @description Realiza una consulta para obtener las subtareas de la tarea seleccionada por su ID.
     * @param selectedTaskId ID de la tarea seleccionada para obtener sus subtareas.
     * @returns {Promise<void>}
     * @returns {void}
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
     * Función para calcular los presupuestos anuales de un proceso específico.
     * @description Recorre los meses del año y suma los gastos mensuales de un proceso específico.
     * @param processId ID del proceso para el cual se calcularán los gastos anuales.
     * @returns {Promise<number>} Retorna una promesa que resuelve con el total de presupuesto anual del proceso.
     * @returns {number} Retorna 0 si hay un error o si no se pueden obtener los datos.
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
     * Función para formatear un valor numérico como moneda.
     * @description Utiliza Intl.NumberFormat para formatear el valor numérico a una cadena de texto con formato de moneda.
     * @param value Valor numérico a formatear.
     * @returns {string} Retorna el valor formateado como una cadena de texto.
     * @returns {void}
     */
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('es-CL', {
            maximumFractionDigits: 0
        }).format(value);
    };

    /**
     * Hook para cargar los datos del presupuesto y gastos anuales.
     * @description Este efecto se ejecuta una vez al montar el componente, cargando los datos del presupuesto y gastos anuales.
     */
    useEffect(() => {
    const loadBudgetData = async () => {
        setBudgetLoading(true);
        try {
            const relationshipProcessIds = [4,5,6,7];
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

    const loading = isLoadingTaskDetailsQuery || budgetLoading;

  return {
    loading,
    budgetLoading,
    tasksData: tasksDataQuery,
    subtasks,
    selectedLegend,
    selectedTaskId,
    formattedBudget,
    formattedExpenses,
    yearlyBudgetTotal,
    yearlyExpensesTotal,
    handleLegendClick,
    handleTaskClick,
  };
};