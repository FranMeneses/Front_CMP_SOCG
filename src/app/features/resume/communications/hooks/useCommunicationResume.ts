import { GET_TASK_SUBTASKS, GET_TASKS_BY_PROCESS, GET_TOTAL_BUDGET_BY_MONTH_AND_PROCESS, GET_TOTAL_EXPENSE_BY_MONTH_AND_PROCESS } from "@/app/api/tasks";
import { ISubtask } from "@/app/models/ISubtasks";
import { ITask } from "@/app/models/ITasks";
import { Months } from "@/constants/months";
import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";

export function useCommunicationResume() {
    const [isLoadingTaskDetails, setIsLoadingTaskDetails] = useState(false);
    const [budgetLoading, setBudgetLoading] = useState(false);
    const [tasksData, setTasksData] = useState<ITask[]>([]);    
    const [subtasks, setSubtasks] = useState<ISubtask[]>([]);
    const [selectedLegend, setSelectedLegend] = useState<string | null>(null);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [formattedBudget, setFormattedBudget] = useState("");
    const [formattedExpenses, setFormattedExpenses] = useState("");
    const [yearlyBudgetTotal, setYearlyBudgetTotal] = useState(0);
    const [yearlyExpensesTotal, setYearlyExpensesTotal] = useState(0);
    
    
    const [ getTasksByProcess] = useLazyQuery(GET_TASKS_BY_PROCESS);
    const [ getSubtasks, { data: subtasksData, loading: subtasksLoading } ]= useLazyQuery(GET_TASK_SUBTASKS);
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
     * Función para manejar el clic en una tarea.
     * @description Si la tarea ya está seleccionada, la deselecciona y limpia las subtareas. Si no, selecciona la tarea y obtiene sus subtareas.
     * @param taskId ID de la tarea que se ha hecho clic.
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
     * Función para cargar las tareas de los procesos de comunicación.
     * @description Realiza una consulta para obtener las tareas de los procesos de comunicación y las almacena en el estado.
     */
    const loadCommunicationProcessesTasks = async () => {
      const communicationProcessIds = [4, 5, 6, 7]; 
      const allTasks: ITask[] = [];
            
      setIsLoadingTaskDetails(true);
            
      try {
        for (const processId of communicationProcessIds) {
          const { data } = await getTasksByProcess({
            variables: { processId },
          });
          const processTasks = data?.tasksByProcess || [];
          allTasks.push(...processTasks);
        }
        return allTasks;
      } catch (error) {
        console.error("Error loading communication processes tasks:", error);
        return [];
      } finally {
        setIsLoadingTaskDetails(false);
      }
    };
    
    /**
     * Función para calcular los presupuestos anuales de un proceso específico.
     * @description Recorre los meses del año y suma los gastos mensuales de un proceso específico.
     * @param processId ID del proceso para el cual se calcularán los gastos anuales.
     * @returns Total de gastos anuales del proceso.
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
        console.log("Total Budget for process", processId, ":", totalBudget);
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
     * Función para formatear un valor numérico como moneda.
     * @description Utiliza Intl.NumberFormat para formatear el valor numérico a una cadena de texto con formato de moneda.
     * @param value Valor numérico a formatear.
     * @returns 
     */
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('es-CL', {
            maximumFractionDigits: 0
        }).format(value);
    };

    /**
     * Hook para cargar las tareas de los procesos de comunicación al montar el componente.
     * @description Utiliza useEffect para cargar las tareas de los procesos de comunicación al montar el componente.
     */
    useEffect(() => {
      const loadInitialCommunicationTasks = async () => {
        try {
          setIsLoadingTaskDetails(true);
          const communicationTasks = await loadCommunicationProcessesTasks();
          setTasksData(communicationTasks);
        } catch (error) {
          console.error("Error loading initial communication tasks:", error);
        } finally {
          setIsLoadingTaskDetails(false);
        }
      };
      loadInitialCommunicationTasks();
    }, []);

    /**
     * Hook para cargar los datos del presupuesto y gastos anuales.
     * @description Este efecto se ejecuta una vez al montar el componente, cargando los datos del presupuesto y gastos anuales.
     */
    useEffect(() => {
    const loadBudgetData = async () => {
        setBudgetLoading(true);
        try {
            const relationshipProcessIds = [4,5,6,7];
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

  return {
    loadCommunicationProcessesTasks,
    handleLegendClick,
    handleTaskClick,
    isLoadingTaskDetails,
    tasksData,
    selectedTaskId,
    selectedLegend,
    subtasks,
    formattedBudget,
    formattedExpenses,
    loading
  };
};