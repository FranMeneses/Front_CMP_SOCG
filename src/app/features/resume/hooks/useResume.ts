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

    const handleGetSubtasks = async (selectedTaskId: string) => {
        try {
            console.log("Fetching subtasks for task ID:", selectedTaskId);
            const { data } = await getSubtasks({
                variables: { id: selectedTaskId }, 
            });
            if (data && data.taskSubtasks) {
                console.log("Subtasks data:", data.taskSubtasks);
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

    const YearlyBudget = async () => {
        let totalBudget = 0;
        
        try {
            for (const month of Months) {
                const { data: BudgetData } = await getMonthBudget({
                    variables: { monthName: month, year: new Date().getFullYear() },
                });
                
                console.log(`Budget data for ${month}:`, BudgetData);
                
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

    const YearlyExpenses = async () => {
        let totalExpenses = 0;
        
        try {
            for (const month of Months) {
                const { data: ExpensesData } = await getMonthExpenses({
                    variables: { monthName: month, year: new Date().getFullYear()},
                });
                
                console.log("Monthly expenses data:", ExpensesData);
                
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
  
    useEffect(() => {
        const loadBudgetData = async () => {
            setBudgetLoading(true);
            try {
                const budgetTotal = await YearlyBudget();
                setYearlyBudgetTotal(budgetTotal);
                
                const expensesTotal = await YearlyExpenses();
                setYearlyExpensesTotal(expensesTotal);
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
        yearlyBudgetTotal,
        yearlyExpensesTotal,
        handleLegendClick,
        handleTaskClick,
        toggleSidebar,
    };
}