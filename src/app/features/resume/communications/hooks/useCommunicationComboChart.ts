import { GET_PROCESS_MONTHLY_BUDGETS, GET_PROCESS_MONTHLY_EXPENSES } from "@/app/api/tasks";
import { ITaskBudget, ITaskExpense } from "@/app/models/ITasks";
import { Months } from "@/constants/months";
import { CommunicationsColors } from "@/constants/colors";
import { useLazyQuery } from "@apollo/client/react";
import { useState, useEffect } from "react";

export function useCommunicationComboChart() {
  const [getMonthlyBudgets] = useLazyQuery(GET_PROCESS_MONTHLY_BUDGETS);
  const [getMonthlyExpenses] = useLazyQuery(GET_PROCESS_MONTHLY_EXPENSES);
  const [loading, setLoading] = useState(true);

  const [internalCommunicationsBudget, setInternalCommunicationsBudget] = useState<number[]>([]);
  const [externalCommunicationsBudget, setExternalCommunicationsBudget] = useState<number[]>([]);
  const [publicAffairsBudget, setPublicAffairsBudget] = useState<number[]>([]);
  const [transversalBudget, setTransversalBudget] = useState<number[]>([]);

  const [internalCommunicationsExpenses, setInternalCommunicationsExpenses] = useState<number[]>([]);
  const [externalCommunicationsExpenses, setExternalCommunicationsExpenses] = useState<number[]>([]);
  const [publicAffairsExpenses, setPublicAffairsExpenses] = useState<number[]>([]);
  const [transversalExpenses, setTransversalExpenses] = useState<number[]>([]);

  const [comboChartData, setComboChartData] = useState<{
    labels: string[];
    datasets: { label: string; data: number[]; borderColor: string; backgroundColor: string; borderDash?:[number,number], hidden?:boolean , id?:string}[];
  }>({
    labels: Months,
    datasets: [],
  });


  /**
   * Effect para obtener los presupuestos y gastos mensuales de los valles.
   * @description Este efecto se ejecuta una vez al cargar el componente, obteniendo los presupuestos y gastos mensuales de los valles Copiapó, Huasco y Elqui.
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const internalCommunicationsBudgetResponse = await getMonthlyBudgets({
          variables: { processId: 4, year: new Date().getFullYear() },
        });
        const internalCommunicationsBudgetData = internalCommunicationsBudgetResponse.data?.processMonthlyBudgets?.map(
          (budget: ITaskBudget) => budget.budget
        ) || [];
        setInternalCommunicationsBudget(internalCommunicationsBudgetData);

        const externalCommunicationsBudgetResponse = await getMonthlyBudgets({
          variables: { processId: 5, year: new Date().getFullYear() },
        });
        const externalCommunicationsBudgetData = externalCommunicationsBudgetResponse.data?.processMonthlyBudgets?.map(
          (budget: ITaskBudget) => budget.budget
        ) || [];
        setExternalCommunicationsBudget(externalCommunicationsBudgetData);

        const publicAffairsBudgetResponse = await getMonthlyBudgets({
          variables: { processId: 6, year: new Date().getFullYear() },
        });
        const publicAffairsBudgetData = publicAffairsBudgetResponse.data?.processMonthlyBudgets?.map(
          (budget: ITaskBudget) => budget.budget
        ) || [];
        setPublicAffairsBudget(publicAffairsBudgetData);


        const transversalBudgetResponse = await getMonthlyBudgets({
          variables: { processId: 7, year: new Date().getFullYear() },
        });
        const transversalBudgetData = transversalBudgetResponse.data?.processMonthlyBudgets?.map(
          (budget: ITaskBudget) => budget.budget
        ) || [];
        setTransversalBudget(transversalBudgetData);

        const internalCommunicationsExpensesResponse = await getMonthlyExpenses({
          variables: { processId: 4, year: new Date().getFullYear() },
        });
        const internalCommunicationsExpensesData = internalCommunicationsExpensesResponse.data?.processMonthlyExpenses?.map(
          (expense: ITaskExpense) => expense.expense
        ) || [];
        setInternalCommunicationsExpenses(internalCommunicationsExpensesData);

        const externalCommunicationsExpensesResponse = await getMonthlyExpenses({
          variables: { processId: 5, year: new Date().getFullYear() },
        });
        const externalCommunicationsExpensesData = externalCommunicationsExpensesResponse.data?.processMonthlyExpenses?.map(
          (expense: ITaskExpense) => expense.expense
        ) || [];
        setExternalCommunicationsExpenses(externalCommunicationsExpensesData);

        const publicAffairsExpensesResponse = await getMonthlyExpenses({
          variables: { processId: 6, year: new Date().getFullYear() },
        });
        const publicAffairsExpensesData = publicAffairsExpensesResponse.data?.processMonthlyExpenses?.map(
          (expense: ITaskExpense) => expense.expense
        ) || [];
        setPublicAffairsExpenses(publicAffairsExpensesData);

        const transversalExpensesResponse = await getMonthlyExpenses({
          variables: { processId: 7, year: new Date().getFullYear() },
        });
        const transversalExpensesData = transversalExpensesResponse.data?.processMonthlyExpenses?.map(
          (expense: ITaskExpense) => expense.expense
        ) || [];
        setTransversalExpenses(transversalExpensesData);
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
          label: 'Comunicaciones Internas',
          id: 'Valle de Copiapó',
          data: internalCommunicationsBudget,
          borderColor: CommunicationsColors[0],
          backgroundColor: CommunicationsColors[0],
        },
        {
          label: 'Comunicaciones Externas',
          id: 'Valle del Huasco',
          data: externalCommunicationsBudget,
          borderColor: CommunicationsColors[1],
          backgroundColor: CommunicationsColors[1],
        },
        {
          label: 'Asuntos Públicos',
          id: 'Valle del Elqui',
          data: publicAffairsBudget,
          borderColor: CommunicationsColors[2],
          backgroundColor: CommunicationsColors[2],
        },
        {
          label: 'Transversales',
          id: 'Transversal',
          data: transversalBudget,
          borderColor: CommunicationsColors[3],
          backgroundColor: CommunicationsColors[3],
        },
        {
          label: 'Gastos Comunicaciones Internas',
          id: 'Valle de Copiapó',
          data: internalCommunicationsExpenses,
          borderColor: CommunicationsColors[0],
          backgroundColor: CommunicationsColors[0],
          borderDash: [5, 5],
        },
        {
          label: 'Gastos Comunicaciones Externas',
          id: 'Valle del Huasco',
          data: externalCommunicationsExpenses,
          borderColor: CommunicationsColors[1],
          backgroundColor: CommunicationsColors[1],
          borderDash: [5, 5],
        },
        {
          label: 'Gastos Asuntos Públicos',
          id: 'Valle del Elqui',
          data: publicAffairsExpenses,
          borderColor: CommunicationsColors[2],
          backgroundColor: CommunicationsColors[2],
          borderDash: [5, 5],
        },
        {
          label: 'Gastos Transversales',
          id: 'Transversal',
          data: transversalExpenses,
          borderColor: CommunicationsColors[3],
          backgroundColor: CommunicationsColors[3],
        }
      ],
    })
  }, [internalCommunicationsBudget, externalCommunicationsBudget, publicAffairsBudget, internalCommunicationsExpenses, externalCommunicationsExpenses, publicAffairsExpenses]);

  return {
    comboChartData,
    loading
  };
}