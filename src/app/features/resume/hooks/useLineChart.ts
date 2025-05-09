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
  
  const [lineChartData, setLineChartData] = useState<{
    labels: string[];
    datasets: { label: string; data: number[]; borderColor: string; backgroundColor: string }[];
  }>({
    labels: Months,
    datasets: []
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
          variables: { valleyId: 1 },
        });
        const copiapoBudgetData = copiapoBudgetResponse.data?.valleyMonthlyBudgets?.map(
          (budget: ITaskBudget) => budget.budget
        ) || [];
        setCopiapoBudget(copiapoBudgetData);
        
        const huascoBudgetResponse = await getMonthlyBudgets({
          variables: { valleyId: 2 },
        });
        const huascoBudgetData = huascoBudgetResponse.data?.valleyMonthlyBudgets?.map(
          (budget: ITaskBudget) => budget.budget
        ) || [];
        setHuascoBudget(huascoBudgetData);
        
        const elquiBudgetResponse = await getMonthlyBudgets({
          variables: { valleyId: 3 },
        });
        const elquiBudgetData = elquiBudgetResponse.data?.valleyMonthlyBudgets?.map(
          (budget: ITaskBudget) => budget.budget
        ) || [];
        setElquiBudget(elquiBudgetData);
      } catch (error) {
        console.error("Error fetching budget data:", error);
      }
    };

    fetchData();
  }, [getMonthlyBudgets]);

  {/*TODO: ADD EXPENSES TO CHART*/}
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
      ],
    });
  }, [copiapoBudget, huascoBudget, elquiBudget]); 

  return {
    lineChartData
  };
}