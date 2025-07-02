import { GET_PROCESS_MONTHLY_BUDGETS, GET_PROCESS_MONTHLY_EXPENSES } from "@/app/api/tasks";
import { ITaskBudget, ITaskExpense } from "@/app/models/ITasks";
import { Months } from "@/constants/months";
import { SecondaryValleyColors, ValleyColors } from "@/constants/colors";
import { useData } from "@/context/DataContext";
import { useLazyQuery } from "@apollo/client/react";
import { useState, useEffect, useRef } from "react";

export function useComboChart() {
  const [getMonthlyBudgets] = useLazyQuery(GET_PROCESS_MONTHLY_BUDGETS);
  const [getMonthlyExpenses] = useLazyQuery(GET_PROCESS_MONTHLY_EXPENSES);
  const [loading, setLoading] = useState(true);

  const [copiapoBudget, setCopiapoBudget] = useState<number[]>([]);
  const [huascoBudget, setHuascoBudget] = useState<number[]>([]);
  const [elquiBudget, setElquiBudget] = useState<number[]>([]);

  const [copiapoExpenses, setCopiapoExpenses] = useState<number[]>([]);
  const [huascoExpenses, setHuascoExpenses] = useState<number[]>([]);
  const [elquiExpenses, setElquiExpenses] = useState<number[]>([]);
  
  const [comboChartData, setComboChartData] = useState<{
    labels: string[];
    datasets: { label: string; data: number[]; borderColor: string; backgroundColor: string; borderDash?:[number,number], hidden?:boolean , id?:string}[];
  }>({
    labels: Months,
    datasets: [],
  });

  const { valleys } = useData();
  const valleyNames = useRef<string[]>([]);
  
  /**
   * Effect para actualizar los nombres de los valles cuando cambian los datos de los valles.
   * @description Este efecto se ejecuta cada vez que los valles cambian, actualizando los nombres de los valles en una referencia.
   */
  useEffect(() => {
    if (valleys) {
      valleyNames.current = valleys.map(valley => valley.name);
    }
  }, [valleys]);

  /**
   * Effect para obtener los presupuestos y gastos mensuales de los valles.
   * @description Este efecto se ejecuta una vez al cargar el componente, obteniendo los presupuestos y gastos mensuales de los valles Copiapó, Huasco y Elqui.
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const copiapoBudgetResponse = await getMonthlyBudgets({
          variables: { processId: 1, year: new Date().getFullYear() },
        });
        const copiapoBudgetData = copiapoBudgetResponse.data?.processMonthlyBudgets?.map(
          (budget: ITaskBudget) => budget.budget
        ) || [];
        setCopiapoBudget(copiapoBudgetData);
        
        const huascoBudgetResponse = await getMonthlyBudgets({
          variables: { processId: 2, year: new Date().getFullYear() },
        });
        const huascoBudgetData = huascoBudgetResponse.data?.processMonthlyBudgets?.map(
          (budget: ITaskBudget) => budget.budget
        ) || [];
        setHuascoBudget(huascoBudgetData);
        
        const elquiBudgetResponse = await getMonthlyBudgets({
          variables: { processId: 3, year: new Date().getFullYear() },
        });
        const elquiBudgetData = elquiBudgetResponse.data?.processMonthlyBudgets?.map(
          (budget: ITaskBudget) => budget.budget
        ) || [];
        setElquiBudget(elquiBudgetData);

        const copiapoExpensesResponse = await getMonthlyExpenses({
          variables: { processId: 1, year: new Date().getFullYear() },
        });
        const copiapoExpensesData = copiapoExpensesResponse.data?.processMonthlyExpenses?.map(
          (expense: ITaskExpense) => expense.expense
        ) || [];
        setCopiapoExpenses(copiapoExpensesData);

        const huascoExpensesResponse = await getMonthlyExpenses({
          variables: { processId: 2, year: new Date().getFullYear() },
        });
        const huascoExpensesData = huascoExpensesResponse.data?.processMonthlyExpenses?.map(
          (expense: ITaskExpense) => expense.expense
        ) || [];
        setHuascoExpenses(huascoExpensesData);

        const elquiExpensesResponse = await getMonthlyExpenses({
          variables: { processId: 3, year: new Date().getFullYear() },
        });
        const elquiExpensesData = elquiExpensesResponse.data?.processMonthlyExpenses?.map(
          (expense: ITaskExpense) => expense.expense
        ) || [];
        setElquiExpenses(elquiExpensesData);
      } catch (error) {
        console.error("Error fetching budget data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getMonthlyBudgets, getMonthlyExpenses]);

  /**
   * Effect para actualizar los datos del gráfico combinado.
   * @description Este efecto se ejecuta cada vez que cambian los presupuestos o gastos de los valles, actualizando los datos del gráfico combinado.
   */
  useEffect(() => {
    setComboChartData({
      labels: Months,
      datasets: [
        {
          label: valleyNames.current[0] || 'Copiapó',
          id: 'Valle de Copiapó',
          data: copiapoBudget,
          borderColor: ValleyColors[0],
          backgroundColor: ValleyColors[0],
        },
        {
          label: 'Gastos ' + (valleyNames.current[0] || 'Copiapó'),
          id: 'Valle de Copiapó',
          data: copiapoExpenses,
          borderColor: SecondaryValleyColors[0],
          backgroundColor: SecondaryValleyColors[0],
          borderDash: [5, 5],
        },
        {
          label: valleyNames.current[1] || 'Huasco',
          id: 'Valle del Huasco',
          data: huascoBudget,
          borderColor: ValleyColors[1],
          backgroundColor: ValleyColors[1],
        },
        {
          label: 'Gastos ' + (valleyNames.current[1] || 'Huasco'),
          id: 'Valle del Huasco',
          data: huascoExpenses,
          borderColor: SecondaryValleyColors[1],
          backgroundColor: SecondaryValleyColors[1],
          borderDash: [5, 5],
        },
        {
          label: valleyNames.current[2] || 'Elqui',
          id: 'Valle del Elqui',
          data: elquiBudget,
          borderColor: ValleyColors[2],
          backgroundColor: ValleyColors[2],
        },
        {
          label: 'Gastos ' + (valleyNames.current[2] || 'Elqui'),
          id: 'Valle del Elqui',
          data: elquiExpenses,
          borderColor: SecondaryValleyColors[2],
          backgroundColor: SecondaryValleyColors[2],
          borderDash: [5, 5],
        }
      ],
    })
  }, [copiapoBudget, huascoBudget, elquiBudget, copiapoExpenses, huascoExpenses, elquiExpenses]); 


  return {
    comboChartData,
    loading
  };
}