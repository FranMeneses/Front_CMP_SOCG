import { useState, useEffect, useCallback, useMemo } from "react";
import { useData } from "@/context/DataContext";
import { IValley } from "@/app/models/IValleys";
import { GET_ALL_RISKS, GET_ALL_ORIGINS, GET_ALL_INVESTMENTS, GET_ALL_INTERACTIONS, GET_ALL_SCOPES, GET_ALL_TYPES, GET_TASK_INFO } from "@/app/api/infoTask";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { IInteraction, IInvestment, IOrigin, IRisk, IScope, IType } from "@/app/models/IInfoTask";
import { GET_TASK_STATUSES, GET_TASK, GET_TASK_TOTAL_BUDGET, GET_TASK_TOTAL_EXPENSE, UPDATE_TASK } from "@/app/api/tasks";
import { IInfoTask, ITaskStatus } from "@/app/models/ITasks";
import { UPDATE_INFO_TASK } from "@/app/api/infoTask";

interface InitialValues {
    name?: string;
    description?: string;
    origin?: number;
    investment?: number;
    type?: number;
    scope?: number;
    interaction?: number;
    priority?: number;
    state?: number;
    budget?: number;
    expenses?: number;
    startDate?: string;
    endDate?: string;
    risk?: number;
    finishDate?: string;
    faena?: number;
}

export const useValleyTaskForm = (onSave: (task: any) => void, valley:string, isEditing?:boolean, infoTask?:any, subtask?: any) => {
    
    const [initialValues, setInitialValues] = useState<InitialValues | undefined>(undefined);
    const [updateTask] = useMutation(UPDATE_TASK);
    const [updateInfoTask] = useMutation(UPDATE_INFO_TASK);
    
    const [getTaskBudget] = useLazyQuery(GET_TASK_TOTAL_BUDGET);
    const [getTaskExpenses] = useLazyQuery(GET_TASK_TOTAL_EXPENSE);
    const [getTask] = useLazyQuery(GET_TASK);
    const [getInfoTask] = useLazyQuery(GET_TASK_INFO);

    const {valleys, faenas: Faenas} = useData();
    const valleyNames = valleys ? valleys.map((valley: IValley) => valley.name) : [];
    const faenaNames = Faenas ? Faenas.map((faena: IValley) => faena.name) : [];

    const {data: riskData} = useQuery(GET_ALL_RISKS);
    const {data: originData} = useQuery(GET_ALL_ORIGINS);
    const {data: investmentData} = useQuery(GET_ALL_INVESTMENTS);
    const {data: interactionData} = useQuery(GET_ALL_INTERACTIONS);
    const {data: scopeData} = useQuery(GET_ALL_SCOPES);
    const {data: typeData} = useQuery(GET_ALL_TYPES);
    const {data: taskStateData} = useQuery(GET_TASK_STATUSES);

    const risks = riskData?.risks || [];
    const origins = originData?.origins || [];
    const investments = investmentData?.investments || [];
    const interactions = interactionData?.interactions || [];
    const scopes = scopeData?.scopes || [];
    const types = typeData?.types || [];
    const states = taskStateData?.taskStatuses || [];

    const taskRisk = risks.map((r: IRisk) => r.type);
    const taskOrigin = origins.map((o: IOrigin) => o.name);
    const taskInvestment = investments.map((i: IInvestment) => i.line);
    const taskInteraction = interactions.map((i: IInteraction) => i.operation);
    const taskScope = scopes.map((s: IScope) => s.name);
    const taskType = types.map((t: IType) => t.name);
    const taskState = states.map((s: ITaskStatus) => s.name);

    const handleGetTaskBudget = async (taskId: string) => {
        try {
            const { data: budgetData } = await getTaskBudget({
                variables: { id: taskId },
            });
            if (budgetData) {
                return budgetData.taskTotalBudget;
            } else {
                console.warn("No data found for the given task ID:", taskId);
                return null;
            }
        } catch (error) {
            console.error("Error fetching task budget:", error);
            return null;
        }
    };

    const handleGetTaskExpenses = async (taskId: string) => {
        try {
            const { data: expensesData } = await getTaskExpenses({
                variables: { id: taskId },
            });
            if (expensesData) {
                return expensesData.taskTotalExpense;
            } else {
                console.warn("No data found for the given task ID:", taskId);
                return null;
            }
        } catch (error) {
            console.error("Error fetching task expenses:", error);
            return null;
        }
    };

    const handleGetInfoTask = async (taskId: string) => {
        try {
            const { data: infoData } = await getInfoTask({
                variables: { id: taskId },
            });
            if (infoData) {
                return infoData.taskInfo;
            } else {
                console.warn("No data found for the given task ID:", taskId);
                return null;
            }
        } catch (error) {
            console.error("Error fetching task information:", error);
            return null;
        }
    };

    const handleGetTaskFaena = async (taskId: string) => {
        try {
            const { data: taskData } = await getTask({
                variables: { id: taskId },
            });
            if (taskData) {
                return taskData.task.faenaId;
            } else {
                console.warn("No data found for the given task ID:", taskId);
                return null;
            }
        } catch (error) {
            console.error("Error fetching task:", error);
            return null;
        }
    };

    const handleUpdateTask = async (task: any, selectedTaskId: string, selectedInfoTask: IInfoTask | null) => {
        try {
            const { data } = await updateTask({
                variables: {
                    id: selectedTaskId,
                    input: {
                        name: task.name,
                        description: task.description,
                        statusId: task.state,
                    },
                },
            });

            if (!data?.updateTask?.id) {
                throw new Error("Task update failed: ID is undefined.");
            }
            const { data: infoData } = await updateInfoTask({
                variables: {
                    id: selectedInfoTask?.id,
                    input: {
                        taskId: selectedTaskId,
                        originId: task.origin,
                        investmentId: task.investment,
                        typeId: task.type,
                        scopeId: task.scope,
                        interactionId: task.interaction,
                        riskId: task.risk,
                    },
                },
            });

            return data.updateTask.id;
        }
        catch (error) {
            console.error("Error updating task:", error);
            throw error;
        }
    };

    const [formState, setFormState] = useState({
        name: initialValues?.name || "",
        description: initialValues?.description || "",
        origin: initialValues?.origin || "",
        investment: initialValues?.investment || "",
        type: initialValues?.type || "",
        scope: initialValues?.scope || "",
        interaction: initialValues?.interaction || "",
        state: initialValues?.state || "",
        budget: initialValues?.budget || "",
        expenses: initialValues?.expenses || "",
        risk: initialValues?.risk || "",
        faena: initialValues?.faena || "",
    });

    const fetchInitialValues = async () => {
        if (infoTask) {
          try {
            const budget = await handleGetTaskBudget(infoTask.taskId);
            const expenses = await handleGetTaskExpenses(infoTask.taskId);
            const faena = await handleGetTaskFaena(infoTask.taskId);

            setInitialValues({
              name: infoTask.task.name || "",
              description: infoTask.task.description || "",
              origin: infoTask.originId || "",
              investment: infoTask.investmentId || "",
              type: infoTask.typeId || "",
              scope: infoTask.scopeId || "",
              interaction: infoTask.interactionId || "",
              risk: infoTask.riskId || "",
              state: infoTask.task.statusId || "",
              budget: budget || "",
              expenses: expenses || "",
              faena: faena || "",
            });
          }
          catch (error) {
            console.error("Error fetching initial values:", error);
          }
        }
    };

    useEffect(() => {
        fetchInitialValues();
      }, [infoTask,subtask]);

    useEffect(() => {
        if (initialValues) {
            setFormState({
                name: initialValues.name || "",
                description: initialValues.description || "",
                origin: initialValues.origin || "",
                investment: initialValues.investment || "",
                type: initialValues.type || "",
                scope: initialValues.scope || "",
                interaction: initialValues.interaction || "",
                state: initialValues.state || "",
                budget: initialValues.budget || "",
                expenses: initialValues.expenses || "",
                risk: initialValues.risk || "",
                faena: initialValues.faena || "",
            });
        }
    }, [initialValues]);
    
    const [faenas, setFaenas] = useState<string[]>([]);
    const [faenaMap, setFaenaMap] = useState<{ [key: string]: string }>({});

    useEffect(() => {
    if (Faenas) {
        const newFaenaMap: Record<string, number> = {};
        Faenas.forEach((faena: IValley, index) => {
            newFaenaMap[faena.name] = faena.id || index + 1;
        });
        setFaenaMap(Object.fromEntries(Object.entries(newFaenaMap).map(([key, value]) => [key, value.toString()])));
    }
}, [Faenas]);

    const handleInputChange = useCallback((field: string, value: string) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleSave = useCallback(() => {
        let taskDetails = {};
        if (!isEditing) {
            taskDetails = {
                ...formState,
                valley: valleyNames.findIndex((v) => v === valley) + 1,
                faena: formState.faena ? Number(faenaMap[formState.faena]) : null,
                risk: Number(formState.risk) ? Number(formState.risk) : taskRisk.findIndex((r: string | number) => r === formState.risk) + 1,
                state: Number(formState.state) ? Number(formState.state) : taskState.findIndex((s: string | number) => s === formState.state) + 1,
                interaction: Number(formState.interaction) ? Number(formState.interaction) : taskInteraction.findIndex((i: string | number) => i === formState.interaction) + 1,
                scope: Number(formState.scope) ? Number(formState.scope) : taskScope.findIndex((s: string | number) => s === formState.scope) + 1,
                type: Number(formState.type) ? Number(formState.type) : taskType.findIndex((t: string | number) => t === formState.type) + 1,
                origin: Number(formState.origin) ? Number(formState.origin) : taskOrigin.findIndex((o: string | number) => o === formState.origin) + 1,
                investment: Number(formState.investment) ? Number(formState.investment) : taskInvestment.findIndex((i: string | number) => i === formState.investment) + 1,
            };
        } else {
            taskDetails = {
                ...formState,
                risk: Number(formState.risk) ? Number(formState.risk) : taskRisk.findIndex((r: string | number) => r === formState.risk) + 1,
                state: Number(formState.state) ? Number(formState.state) : taskState.findIndex((s: string | number) => s === formState.state) + 1,
                interaction: Number(formState.interaction) ? Number(formState.interaction) : taskInteraction.findIndex((i: string | number) => i === formState.interaction) + 1,
                scope: Number(formState.scope) ? Number(formState.scope) : taskScope.findIndex((s: string | number) => s === formState.scope) + 1,
                type: Number(formState.type) ? Number(formState.type) : taskType.findIndex((t: string | number) => t === formState.type) + 1,
                origin: Number(formState.origin) ? Number(formState.origin) : taskOrigin.findIndex((o: string | number) => o === formState.origin) + 1,
                investment: Number(formState.investment) ? Number(formState.investment) : taskInvestment.findIndex((i: string | number) => i === formState.investment) + 1,
            };
        }
        onSave(taskDetails);
        setFormState({
            name: "",
            description: "",
            origin: "",
            investment: "",
            type: "",
            scope: "",
            interaction: "",
            state: "",
            budget: "",
            expenses: "",
            risk: "",
            faena: "",
        });
        setFaenas([]);
    }, [formState, onSave, faenaMap]);

    const handleValleySelect = useCallback((valleyName: string) => {
        if (!faenaNames || faenaNames.length === 0) {
            setFaenas([]);
            return;
        }

        switch (valleyName) {
            case "Valle de Copiapó":
                const copiapoFaenas = faenaNames.slice(0, Math.min(3, faenaNames.length));
                if (faenaNames.length > 9) {
                    copiapoFaenas.push(faenaNames[9]);
                }
                setFaenas(copiapoFaenas);
                break;
            case "Valle del Huasco":
                if (faenaNames.length > 3) {
                    const huascoFaenas = faenaNames.slice(3, Math.min(6, faenaNames.length));
                    if (faenaNames.length > 9) {
                        huascoFaenas.push(faenaNames[9]);
                    }
                    setFaenas(huascoFaenas);
                }
                break;
            case "Valle del Elqui":
                if (faenaNames.length > 6) {
                    const elquiFaenas = faenaNames.slice(6, Math.min(9, faenaNames.length));
                    if (faenaNames.length > 9) {
                        elquiFaenas.push(faenaNames[9]);
                    }
                    setFaenas(elquiFaenas);
                }  
                break;
            case "Transversal":
                if (faenaNames.length > 9) {
                    setFaenas(faenaNames.slice(9, faenaNames.length));
                }
                break;
            default:
                setFaenas([]);
                break;
        }
    }, [faenaNames]);

    useEffect(() => {
        handleValleySelect(valley);
    },[valley]);

    const dropdownItems = useMemo(() => ({
        origin: taskOrigin || [],
        type: taskType || [],
        scope: taskScope || [],
        interaction: taskInteraction || [],
        investment: taskInvestment || [],
        state: taskState || [],
        risk: taskRisk || []
    }), [taskOrigin, taskType, taskScope, taskInteraction, taskState, taskRisk]);

    const getFaenaNameById = useCallback((id: string | number) => {
        if (!id || !Faenas) return "";
        const faena = Faenas.find(f => (f.id || "").toString() === id.toString());
        return faena ? faena.name : "";
    }, [Faenas]);

    return {
        formState,
        faenas,
        dropdownItems,
        handleInputChange,
        handleSave,
        getFaenaNameById,
        handleGetTaskBudget,
        handleGetTaskExpenses,
        handleGetInfoTask,
        handleGetTaskFaena,
        handleUpdateTask,
    };
};