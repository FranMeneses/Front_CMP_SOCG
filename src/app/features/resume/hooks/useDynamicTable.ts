import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_TASK_TOTAL_BUDGET, GET_TASK_TOTAL_EXPENSE, GET_TASK_PROGRESS } from "@/app/api/tasks";
import { ITask } from "@/app/models/ITasks";
import { GET_TASK_COMPLIANCE } from "@/app/api/compliance";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { GET_ALL_INTERACTIONS, GET_ALL_INVESTMENTS, GET_ALL_ORIGINS, GET_ALL_RISKS, GET_ALL_SCOPES, GET_ALL_TYPES } from "@/app/api/infoTask";

export function useDynamicTable(tasks: ITask[]) {
    const [getTaskBudget] = useLazyQuery(GET_TASK_TOTAL_BUDGET);
    const [getTaskExpense] = useLazyQuery(GET_TASK_TOTAL_EXPENSE);
    const [getTaskCompliance] = useLazyQuery(GET_TASK_COMPLIANCE);
    const [getTaskProgress] = useLazyQuery(GET_TASK_PROGRESS);
    const [taskProgressMap, setTaskProgressMap] = useState<Record<string, number>>({});

    
    const {data: riskData} = useQuery(GET_ALL_RISKS);
    const {data: originData} = useQuery(GET_ALL_ORIGINS);
    const {data: investmentData} = useQuery(GET_ALL_INVESTMENTS);
    const {data: interactionData} = useQuery(GET_ALL_INTERACTIONS);
    const {data: scopeData} = useQuery(GET_ALL_SCOPES);
    const {data: typeData} = useQuery(GET_ALL_TYPES);

    const risks = riskData?.risks || [];
    const origins = originData?.origins || [];
    const investments = investmentData?.investments || [];
    const interactions = interactionData?.interactions || [];
    const scopes = scopeData?.scopes || [];
    const types = typeData?.types || [];

    const budgetCache = useRef<Record<string, { value: number | null, timestamp: number }>>({});
    const expenseCache = useRef<Record<string, { value: number | null, timestamp: number }>>({});
    const complianceCache = useRef<Record<string, { value: string, timestamp: number }>>({});
    const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos en ms

    const now = () => new Date().getTime();

    /**
     * Función para obtener el progreso de las tareas
     * @description Realiza una consulta para obtener el progreso de cada tarea y actualiza el estado del mapa de progreso de tareas.
     * @returns {Promise<void>} Retorna una promesa que se resuelve cuando se han obtenido los progresos de todas las tareas.
     * @returns {void}
     */
    const fetchTaskProgress = useCallback(async () => {
        const progressMap: Record<string, number> = {};
        for (const task of tasks) {
            if (task.id) {
                try {
                    const { data } = await getTaskProgress({ variables: { id: task.id } });
                    if (data && data.taskProgress !== undefined) {
                        progressMap[task.id] = data.taskProgress;
                    } else {
                        progressMap[task.id] = 0;
                    }
                } catch {
                    progressMap[task.id] = 0;
                }
            }
        }
        setTaskProgressMap(progressMap);
    }, [tasks, getTaskProgress]);

    useEffect(() => {
        if (tasks.length > 0) {
            fetchTaskProgress();
        }
    }, [tasks, fetchTaskProgress]);

    /**
     * Función para obtener el presupuesto de una tarea
     * @param taskId ID de la tarea 
     * @description Realiza una consulta para obtener el presupuesto total de la tarea y lo almacena en caché. 
     * @returns {Promise<number | null>} Retorna una promesa que resuelve con el presupuesto de la tarea o null si no se encuentra.
     * @returns {void}
     */
    const handleGetTaskBudget = async (taskId: string) => {
        const cached = budgetCache.current[taskId];
        if (cached && now() - cached.timestamp < CACHE_DURATION) {
            return cached.value;
        }
        try {
            const { data: budgetData } = await getTaskBudget({
                variables: { id: taskId },
            });
            const value = budgetData ? budgetData.taskTotalBudget : null;
            budgetCache.current[taskId] = { value, timestamp: now() };
            return value;
        } catch (error) {
            console.error("Error fetching task budget:", error);
            return null;
        }
    };

    /**
     * Función para obtener los gastos asociados a la tarea
     * @param taskId ID de la tarea
     * @description Realiza una consulta para obtener los gastos totales de la tarea y los almacena en caché.
     * @returns {Promise<number | null>} Retorna una promesa que resuelve con los gastos de la tarea o null si no se encuentra.
     * @returns {void}
     */
    const handleGetTaskExpenses = async (taskId: string) => {
        const cached = expenseCache.current[taskId];
        if (cached && now() - cached.timestamp < CACHE_DURATION) {
            return cached.value;
        }
        try {
            const { data: expensesData } = await getTaskExpense({
                variables: { id: taskId },
                fetchPolicy: 'network-only',
            });
            const value = expensesData ? expensesData.taskTotalExpense : null;
            expenseCache.current[taskId] = { value, timestamp: now() };
            return value;
        } catch (error) {
            console.error("Error fetching task expenses:", error);
            return null;
        }
    };

    /**
     * Función para obtener un estado simplificado del compliance
     * @param taskId ID de la tarea
     * @description Realiza una consulta para obtener el estado de cumplimiento de la tarea y lo almacena en caché.
     * @returns {Promise<string>} Retorna una promesa que resuelve con el estado de cumplimiento de la tarea.
     * @returns {void}
     */
    const handleGetComplianceStatus = async (taskId: string) => {
        const cached = complianceCache.current[taskId];
        if (cached && now() - cached.timestamp < CACHE_DURATION) {
            return cached.value;
        }
        const task = tasks.find(t => t.id === taskId);
        if (task && task.applies === false) {
            complianceCache.current[taskId] = { value: "No Aplica", timestamp: now() };
            return "No Aplica";
        }
        try {
            const {data: taskCompliance} = await getTaskCompliance({
                variables: { taskId },
                fetchPolicy: 'network-only'
            });
            let value = "No completado";
            if (taskCompliance && taskCompliance.getTaskCompliance) {
                const statusName = taskCompliance.getTaskCompliance.status?.name;
                if (statusName === "Completado") {
                    value = "Completado";
                }
            }
            complianceCache.current[taskId] = { value, timestamp: now() };
            return value;
        }
        catch (error){
            console.error("Error al obtener el compliance", error);
            return "No completado";
        }
    }

    const infoTaskNames = useMemo(() => ({
        origin: origins || [],
        type: types || [],
        scope: scopes || [],
        interaction: interactions || [],
        investment: investments || [],
        risk: risks || [],
    }), [origins, types, scopes, interactions, investments, risks]);

    return {
        handleGetTaskBudget,
        handleGetTaskExpenses,
        handleGetComplianceStatus,
        taskProgressMap,
        infoTaskNames
    };
}