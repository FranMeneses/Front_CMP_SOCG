import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_TASKS_BY_PROCESS, GET_TOTAL_BUDGET_BY_MONTH, GET_TOTAL_EXPENSE_BY_MONTH } from "@/app/api/tasks";
import { GET_TASK_SUBTASKS } from "@/app/api/tasks";
import { ISubtask } from "@/app/models/ISubtasks";
import { Months } from "@/constants/months";
import { ITask } from "@/app/models/ITasks";

export function useResume() {
    
    const [isLoadingTaskDetails, setIsLoadingTaskDetails] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [selectedLegend, setSelectedLegend] = useState<string | null>(null);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [tasksData, setTasksData] = useState<ITask[]>([]);  
    const [yearlyBudgetTotal, setYearlyBudgetTotal] = useState(0);
    const [yearlyExpensesTotal, setYearlyExpensesTotal] = useState(0);
    const [subtasks, setSubtasks] = useState<ISubtask[]>([]);
    const [budgetLoading, setBudgetLoading] = useState(true);
    const [formattedBudget, setFormattedBudget] = useState("");
    const [formattedExpenses, setFormattedExpenses] = useState("");
    
    const [getSubtasks, { data: subtasksData, loading: subtasksLoading } ]= useLazyQuery(GET_TASK_SUBTASKS);
    const [ getTasksByProcess] = useLazyQuery(GET_TASKS_BY_PROCESS);
    const [getMonthBudget] = useLazyQuery(GET_TOTAL_BUDGET_BY_MONTH)
    const [getMonthExpenses] = useLazyQuery(GET_TOTAL_EXPENSE_BY_MONTH)

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
     * Función para cargar las tareas de los procesos de relacionamiento.
     * @description Realiza una consulta para obtener las tareas de los procesos de relacionamiento y las almacena en el estado.
     * @returns 
     */
    const loadRelationshipProcessesTask = async () => {
      const communicationProcessIds = [1, 2, 3]; 
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
    
    const loading = isLoadingTaskDetails || budgetLoading;

    /**
     * Hook para cargar las tareas de los procesos de relacionamiento al montar el componente.
     * @description Este efecto se ejecuta una vez al montar el componente, cargando las tareas de los procesos de relacionamiento.
     */
    useEffect(() => {
      const loadInitialCommunicationTasks = async () => {
        try {
          setIsLoadingTaskDetails(true);
          const communicationTasks = await loadRelationshipProcessesTask();
          setTasksData(communicationTasks);
        } catch (error) {
          console.error("Error loading initial communication tasks:", error);
        } finally {
          setIsLoadingTaskDetails(false);
        }
      };
      loadInitialCommunicationTasks();
    }, []);

    return {
        loading,
        budgetLoading,
        tasksData,
        isSidebarOpen,
        selectedLegend,
        selectedTaskId,
        subtasks,
        subtasksLoading,
        formattedBudget,
        formattedExpenses,
        handleLegendClick,
        handleTaskClick,
    };
}