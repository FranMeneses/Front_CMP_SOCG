import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_TASK_PROGRESS, GET_TASKS_BY_PROCESS, GET_TOTAL_BUDGET_BY_MONTH_AND_PROCESS, GET_TOTAL_EXPENSE_BY_MONTH_AND_PROCESS } from "@/app/api/tasks";
import { Months } from "@/constants/months";
import { ITask } from "@/app/models/ITasks";

export function useResume() {
    
    const [selectedLegend, setSelectedLegend] = useState<string | null>(null);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

    const [tasksData, setTasksData] = useState<ITask[]>([]);  
    const [copiapoTasks, setCopiapoTasks] = useState<ITask[]>([]);
    const [huascoTasks, setHuascoTasks] = useState<ITask[]>([]);
    const [elquiTasks, setElquiTasks] = useState<ITask[]>([]);
    
    const [copiapoPercentage, setCopiapoPercentage] = useState<number>(0);
    const [huascoPercentage, setHuascoPercentage] = useState<number>(0);
    const [elquiPercentage, setElquiPercentage] = useState<number>(0);
    const [yearlyBudgetTotal, setYearlyBudgetTotal] = useState<number>(0);
    const [yearlyExpensesTotal, setYearlyExpensesTotal] = useState<number>(0);

    const [budgetLoading, setBudgetLoading] = useState<boolean>(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [isLoadingTaskDetails, setIsLoadingTaskDetails] = useState<boolean>(false);

    const [formattedBudget, setFormattedBudget] = useState<string>("");
    const [formattedExpenses, setFormattedExpenses] = useState<string>("");

    const [getTasksByProcess] = useLazyQuery(GET_TASKS_BY_PROCESS);
    const [getTaskPercentage] = useLazyQuery(GET_TASK_PROGRESS);
    const [getMonthBudget] = useLazyQuery(GET_TOTAL_BUDGET_BY_MONTH_AND_PROCESS);
    const [getMonthExpenses] = useLazyQuery(GET_TOTAL_EXPENSE_BY_MONTH_AND_PROCESS);

    /**
     * Función para manejar el clic en una leyenda del gráfico.
     * @description Cambia la leyenda seleccionada o la deselecciona si ya estaba seleccionada.
     * @param legend Leyenda que se ha hecho clic.
     */
    const handleLegendClick = (legend: string) => {
        setSelectedLegend((prev) => (prev === legend ? null : legend));
    };

    /**
     * Función para cargar las tareas de los procesos de relacionamiento.
     * @description Realiza una consulta para obtener las tareas de los procesos de relacionamiento y las almacena en el estado.
     * @returns 
     */
    const loadRelationshipProcessesTask = async () => {
      const relationshipProcessIds = [1, 2, 3]; 
      const copiapoTask: ITask[] = [];
      const huascoTask: ITask[] = [];
      const elquiTask: ITask[] = [];
      const allTasks: ITask[] = [];
            
      setIsLoadingTaskDetails(true);
            
      try {
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
      } catch (error) {
        console.error("Error loading relationship processes tasks:", error);
        return [];
      } finally {
        setIsLoadingTaskDetails(false);
      }
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
     * Función para calcular el presupuesto anual.
     * @description Recorre los meses del año y realiza una consulta para obtener el presupuesto total de cada mes, sumando los resultados.
     * @returns 
     */
    const YearlyBudget = async (processId: number) => {
        let totalBudget = 0;
        
        try {
            for (const month of Months) {
                const { data: BudgetData } = await getMonthBudget({
                    variables: { monthName: month, year: new Date().getFullYear(), processId }, 
                });
                
                if (BudgetData && BudgetData.totalBudgetByMonthAndProcess) {
                    totalBudget += BudgetData.totalBudgetByMonthAndProcess || 0;
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
    const YearlyExpenses = async (processId: number) => {
        let totalExpenses = 0;
        
        try {
            for (const month of Months) {
                const { data: ExpensesData } = await getMonthExpenses({
                    variables: { monthName: month, year: new Date().getFullYear(), processId },
                });

                if (ExpensesData && ExpensesData.totalExpenseByMonthAndProcess) {
                    totalExpenses += ExpensesData.totalExpenseByMonthAndProcess || 0;
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
            const relationshipProcessIds = [1, 2, 3];
            let totalBudget = 0;
            
            for (const processId of relationshipProcessIds) {
                const processBudget = await YearlyBudget(processId);
                totalBudget += processBudget;
            }
            
            setYearlyBudgetTotal(totalBudget);
            setFormattedBudget(formatCurrency(totalBudget));
            
            let totalExpenses = 0;
            for (const processId of relationshipProcessIds) {
                const processExpenses = await YearlyExpenses(processId);
                totalExpenses += processExpenses;
            }
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
    useEffect(() => {
      const loadInitialRelationshipTasks = async () => {
        try {
          setIsLoadingTaskDetails(true);
          const relationshipTasks = await loadRelationshipProcessesTask();
          setTasksData(relationshipTasks);
        } catch (error) {
          console.error("Error loading initial relationship tasks:", error);
        } finally {
          setIsLoadingTaskDetails(false);
        }
      };
      loadInitialRelationshipTasks();
    }, []);

    useEffect(() => {
        const fetchAveragePercentages = async () => {
            if (copiapoTasks.length > 0 || huascoTasks.length > 0 || elquiTasks.length > 0) {
                const copiapoPercentage = await handleGetAveragePercentage(copiapoTasks);
                const huascoPercentage = await handleGetAveragePercentage(huascoTasks);
                const elquiPercentage = await handleGetAveragePercentage(elquiTasks);
                setCopiapoPercentage(copiapoPercentage);
                setHuascoPercentage(huascoPercentage);
                setElquiPercentage(elquiPercentage);
            }
        };
        fetchAveragePercentages();
    }, [copiapoTasks, huascoTasks, elquiTasks]);

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
        const total = results.reduce((acc, curr) => acc + curr, 0);
        const average = parseFloat((total / results.length).toFixed(2));
        return average;
    };

    const ElquiData = {
        labels: ["Completado", "Pendiente"],
        datasets: [
            {
                data: [elquiPercentage, 100 - elquiPercentage],
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
                data: [copiapoPercentage, 100 - copiapoPercentage],
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
                data: [huascoPercentage, 100 - huascoPercentage],
                id: [],
                backgroundColor: ['#1964CB', '#E9E9E9'],
                hoverBackgroundColor: ['#1964CB', '#E9E9E9'],
            },
        ],
    };
    return {
        loading,
        budgetLoading,
        tasksData,
        isSidebarOpen,
        selectedLegend,
        selectedTaskId,
        formattedBudget,
        formattedExpenses,
        CopiapoData,
        HuascoData,
        ElquiData,
        handleLegendClick,
    };
}