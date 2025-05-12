import { GET_VALLEY_MONTHLY_BUDGETS, GET_VALLEY_MONTHLY_EXPENSES } from "@/app/api/tasks";
import { ITaskBudget, ITaskExpense } from "@/app/models/ITasks";
import { Months } from "@/constants/months";
import { ValleyColors } from "@/constants/valleys";
import { useData } from "@/context/DataContext";
import { useLazyQuery } from "@apollo/client/react";
import { useState, useEffect, useRef } from "react";

export function useLineChart() {
  const [getMonthlyBudgets] = useLazyQuery(GET_VALLEY_MONTHLY_BUDGETS);
  const [getMonthlyExpenses] = useLazyQuery(GET_VALLEY_MONTHLY_EXPENSES);

  const [copiapoBudget, setCopiapoBudget] = useState<number[]>([]);
  const [huascoBudget, setHuascoBudget] = useState<number[]>([]);
  const [elquiBudget, setElquiBudget] = useState<number[]>([]);

  const [copiapoExpenses, setCopiapoExpenses] = useState<number[]>([]);
  const [huascoExpenses, setHuascoExpenses] = useState<number[]>([]);
  const [elquiExpenses, setElquiExpenses] = useState<number[]>([]);
  
  const [lineChartData, setLineChartData] = useState<{
    labels: string[];
    datasets: { label: string; data: number[]; borderColor: string; backgroundColor: string; borderDash?:[number,number], hidden?:boolean }[];
  }>({
    labels: Months,
    datasets: [],
  });

  const { valleys } = useData();
  const valleyNames = useRef<string[]>([]);
  
  useEffect(() => {
    if (valleys) {
      valleyNames.current = valleys.map(valley => valley.name);
    }
  }, [valleys]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const copiapoBudgetResponse = await getMonthlyBudgets({
          variables: { valleyId: 1, year: new Date().getFullYear() },
        });
        const copiapoBudgetData = copiapoBudgetResponse.data?.valleyMonthlyBudgets?.map(
          (budget: ITaskBudget) => budget.budget
        ) || [];
        setCopiapoBudget(copiapoBudgetData);
        
        const huascoBudgetResponse = await getMonthlyBudgets({
          variables: { valleyId: 2, year: new Date().getFullYear() },
        });
        const huascoBudgetData = huascoBudgetResponse.data?.valleyMonthlyBudgets?.map(
          (budget: ITaskBudget) => budget.budget
        ) || [];
        setHuascoBudget(huascoBudgetData);
        
        const elquiBudgetResponse = await getMonthlyBudgets({
          variables: { valleyId: 3, year: new Date().getFullYear() },
        });
        const elquiBudgetData = elquiBudgetResponse.data?.valleyMonthlyBudgets?.map(
          (budget: ITaskBudget) => budget.budget
        ) || [];
        setElquiBudget(elquiBudgetData);

        const copiapoExpensesResponse = await getMonthlyExpenses({
          variables: { valleyId: 1, year: new Date().getFullYear() },
        });
        const copiapoExpensesData = copiapoExpensesResponse.data?.valleyMonthlyExpenses?.map(
          (expense: ITaskExpense) => expense.expense
        ) || [];
        setCopiapoExpenses(copiapoExpensesData);

        const huascoExpensesResponse = await getMonthlyExpenses({
          variables: { valleyId: 2, year: new Date().getFullYear() },
        });
        const huascoExpensesData = huascoExpensesResponse.data?.valleyMonthlyExpenses?.map(
          (expense: ITaskExpense) => expense.expense
        ) || [];
        setHuascoExpenses(huascoExpensesData);

        const elquiExpensesResponse = await getMonthlyExpenses({
          variables: { valleyId: 3, year: new Date().getFullYear() },
        });
        const elquiExpensesData = elquiExpensesResponse.data?.valleyMonthlyExpenses?.map(
          (expense: ITaskExpense) => expense.expense
        ) || [];
        setElquiExpenses(elquiExpensesData);
      } catch (error) {
        console.error("Error fetching budget data:", error);
      }
    };

    fetchData();
  }, [getMonthlyBudgets, getMonthlyExpenses]);

  useEffect(() => {
    setLineChartData({
      labels: Months,
      datasets: [
        {
          label: valleyNames.current[0] || 'Copiapó',
          data: copiapoBudget,
          borderColor: ValleyColors[0],
          backgroundColor: ValleyColors[0],
        },
        {
          label: valleyNames.current[1] || 'Huasco',
          data: huascoBudget,
          borderColor: ValleyColors[1],
          backgroundColor: ValleyColors[1],
        },
        {
          label: valleyNames.current[2] || 'Elqui',
          data: elquiBudget,
          borderColor: ValleyColors[2],
          backgroundColor: ValleyColors[2],
        },
        {
          label: valleyNames.current[0] || 'Copiapó',
          data: copiapoExpenses,
          borderColor: ValleyColors[0],
          backgroundColor: ValleyColors[0],
          borderDash: [5, 5],
        },
        {
          label: valleyNames.current[1] || 'Huasco',
          data: huascoExpenses,
          borderColor: ValleyColors[1],
          backgroundColor: ValleyColors[1],
          borderDash: [5, 5],
        },
        {
          label: valleyNames.current[2] || 'Elqui',
          data: elquiExpenses,
          borderColor: ValleyColors[2],
          backgroundColor: ValleyColors[2],
          borderDash: [5, 5],
        }
      ],
    })
  }, [copiapoBudget, huascoBudget, elquiBudget, copiapoExpenses, huascoExpenses, elquiExpenses]); 

  return {
    lineChartData
  };
}