import { useState, useEffect, useCallback, useMemo } from "react";
import { IValley } from "@/app/models/IValleys";
import { GET_ALL_RISKS, GET_ALL_ORIGINS, GET_ALL_INVESTMENTS, GET_ALL_INTERACTIONS, GET_ALL_SCOPES, GET_ALL_TYPES, GET_TASK_INFO } from "@/app/api/infoTask";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { IInteraction, IInvestment, IOrigin, IRisk, IScope, IType } from "@/app/models/IInfoTask";
import { GET_TASK_STATUSES, GET_TASK, GET_TASK_TOTAL_BUDGET, GET_TASK_TOTAL_EXPENSE, UPDATE_TASK, DELETE_TASK } from "@/app/api/tasks";
import { IInfoTask, ITaskStatus } from "@/app/models/ITasks";
import { UPDATE_INFO_TASK } from "@/app/api/infoTask";
import { ISubtask } from "@/app/models/ISubtasks";
import { TaskInitialValues as InitialValues, TaskDetails } from "@/app/models/ITaskForm";
import { useHooks } from "../../hooks/useHooks";
import client from "@/lib/apolloClient";

export const useValleyTaskForm = (onSave: (task: TaskDetails) => void, valley:string, isEditing?:boolean, infoTask?:IInfoTask, subtask?: ISubtask) => {
    
    const [initialValues, setInitialValues] = useState<InitialValues | undefined>(undefined);
    const [updateTask] = useMutation(UPDATE_TASK);
    const [updateInfoTask] = useMutation(UPDATE_INFO_TASK);
    const [deleteTask] = useMutation(DELETE_TASK);
    
    const [getTaskBudget] = useLazyQuery(GET_TASK_TOTAL_BUDGET);
    const [getTaskExpenses] = useLazyQuery(GET_TASK_TOTAL_EXPENSE);
    const [getTask] = useLazyQuery(GET_TASK);
    const [getInfoTask] = useLazyQuery(GET_TASK_INFO);

    const {valleysName: valleyNames, faenasName: faenaNames, faenas: Faenas} = useHooks();

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
    const taskState = initialValues?.compliance? states.map((s: ITaskStatus) => s.name) : states.filter((s: ITaskStatus) => s.name !== "En Cumplimiento").map((s: ITaskStatus) => s.name);

    /**
     * Función para eliminar una tarea
     * @description Maneja la eliminación de una tarea utilizando su ID
     * @param taskId ID de la tarea a eliminar
     */
    const handleDeleteTask = async (taskId: string) => {
        try {
            console.log("Deleting task with ID:", taskId);
            const { data } = await deleteTask({
                variables: { id: taskId },
            });
            if (data) {
            } else {
                console.warn("No data found for the given task ID:", taskId);
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    /**
     * Función para obtener el presupuesto de una tarea por su ID
     * @description Maneja la obtención del presupuesto total de una tarea específica utilizando su ID
     * @param taskId ID de la tarea para obtener el presupuesto
     * @returns 
     */
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

    /**
     * Función para obtener los gastos de una tarea por su ID
     * @description Maneja la obtención del total de gastos de una tarea específica utilizando su ID
     * @param taskId ID de la tarea para obtener los gastos
     * @returns 
     */
    const handleGetTaskExpenses = async (taskId: string) => {
        try {
            const { data: expensesData } = await getTaskExpenses({
                variables: { id: taskId },
                fetchPolicy: 'network-only', 
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

    /**
     * Función para obtener información de una tarea por su ID
     * @description Maneja la obtención de información detallada de una tarea específica utilizando su ID
     * @param taskId ID de la tarea para obtener la información
     * @returns 
     */
    const handleGetInfoTask = async (taskId: string) => {
        try {
            const { data: infoData } = await getInfoTask({
                variables: { id: taskId },
                fetchPolicy: 'network-only', 
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

    /**
     * Función para obtener el ID de la faena asociada a una tarea por su ID
     * @description Maneja la obtención del ID de la faena asociada a una tarea específica utilizando su ID
     * @param taskId ID de la tarea para obtener el ID de la faena
     * @returns 
     */
    const handleGetTaskFaena = async (taskId: string) => {
        try {
            const { data: taskData } = await getTask({
                variables: { id: taskId },
                fetchPolicy: 'network-only',
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

    /**
     * Función para actualizar una tarea y su información asociada
     * @description Maneja la actualización de una tarea y su información asociada utilizando los datos proporcionados
     * @param task Detalles de la tarea a actualizar
     * @param selectedTaskId ID de la tarea seleccionada para actualizar
     * @param selectedInfoTask Información de la tarea seleccionada para actualizar
     * @returns 
     */
    const handleUpdateTask = async (task: TaskDetails, selectedTaskId: string, selectedInfoTask: IInfoTask | null) => {
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

    /**
     * Estado del formulario
     * @description Maneja el estado del formulario con los valores iniciales proporcionados o vacíos
     */
    const [formState, setFormState] = useState<{
        name: string;
        description: string;
        origin: string | number;
        investment: string | number;
        type: string | number;
        scope: string | number;
        interaction: string | number;
        state: string | number;
        budget: string | number;
        expenses: string | number;
        risk: string | number;
        faena: string | number;
        compliance?: boolean;
    }>({
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
        compliance: initialValues?.compliance ?? undefined,
    });

    /**
     * Función para obtener los valores iniciales del formulario
     * @description Maneja la obtención de los valores iniciales del formulario basados en la tarea proporcionada
     */
    const fetchInitialValues = async () => {
        if (infoTask) {
          try {
            const budget = await handleGetTaskBudget(infoTask.taskId);
            const expenses = await handleGetTaskExpenses(infoTask.taskId);
            const faena = await handleGetTaskFaena(infoTask.taskId);

            setInitialValues({
              name: infoTask.task.name || "",
              description: infoTask.task.description || "",
              origin: typeof infoTask.originId === "number" ? infoTask.originId : undefined,
              investment: typeof infoTask.investmentId === "number" ? infoTask.investmentId : undefined,
              type: typeof infoTask.typeId === "number" ? infoTask.typeId : undefined,
              scope: typeof infoTask.scopeId === "number" ? infoTask.scopeId : undefined,
              interaction: typeof infoTask.interactionId === "number" ? infoTask.interactionId : undefined,
              risk: typeof infoTask.riskId === "number" ? infoTask.riskId : undefined,
              state: typeof infoTask.task.statusId === "number" ? infoTask.task.statusId : undefined,
              budget: budget || "",
              expenses: expenses || "",
              faena: faena || "",
              compliance: infoTask.task.applies ?? undefined, 
            });
          }
          catch (error) {
            console.error("Error fetching initial values:", error);
          }
        }
    }

    useEffect(() => {
        if (isEditing && infoTask) {
            fetchInitialValues();
        }
    }, [isEditing, infoTask]);

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
        compliance: initialValues.compliance ?? false,
        });
    }
    }, [initialValues]); // Keep this dependency array simple
    
    const [faenas, setFaenas] = useState<string[]>([]);
    const [faenaMap, setFaenaMap] = useState<{ [key: string]: string }>({});

    /**
     * Hook para establecer el mapa de faenas
     * @description Utiliza useEffect para crear un mapa de faenas cuando Faenas cambian
     */
    useEffect(() => {
        if (Faenas) {
            const newFaenaMap: Record<string, number> = {};
            Faenas.forEach((faena: IValley, index) => {
                newFaenaMap[faena.name] = faena.id || index + 1;
            });
            setFaenaMap(Object.fromEntries(Object.entries(newFaenaMap).map(([key, value]) => [key, value.toString()])));
        }
    }, [Faenas]);

    /**
     * Función para manejar los cambios en los campos del formulario
     * @description Actualiza el estado del formulario cuando un campo cambia
     * @param field Nombre del campo que cambió
     * @param value Nuevo valor del campo
     */
    const handleInputChange = useCallback((field: string, value: string) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    }, []);

    /**
     * Hook para manejar el estado del compliance
     * @description Utiliza useCallback para actualizar el estado del compliance cuando cambia
     * @param value Nuevo valor del compliance
     */
    const handleComplianceChange = useCallback((value: boolean) => {
        setFormState((prev) => ({ ...prev, compliance: value }));
    }, []);

    /**
     * Función para manejar el guardado del formulario
     * @description Prepara los datos de la tarea y llama a la función onSave con los detalles de la tarea
     */
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
                process: valley === "Valle de Copiapó" ? 1 : valley === "Valle del Huasco" ? 2 : valley === "Valle del Elqui" ? 3 : null,
                compliance: formState.compliance ?? false,
            };
        } else {
            taskDetails = {
                ...formState,
                risk: Number(formState.risk) ? Number(formState.risk) : taskRisk.findIndex((r: string | number) => r === formState.risk) + 1,
                state: states.find((s: ITaskStatus) => s.name === formState.state)?.id || 0,
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
            compliance: undefined,
        });
        setFaenas([]);
    }, [formState, onSave, faenaMap]);

    /**
     * Función para manejar la selección de un valle
     * @description Actualiza las faenas disponibles según el valle seleccionado
     * @param valleyName Nombre del valle seleccionado
     */
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

    /**
     * Hook para manejar la selección del valle
     * @description Utiliza useEffect para llamar a handleValleySelect cuando el valle cambia
     */
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

    /**
     * Función para obtener el nombre de una faena por su ID
     * @description Busca el nombre de la faena en la lista de faenas utilizando su ID
     * @param id ID de la faena
     * @returns Nombre de la faena o cadena vacía si no se encuentra
     */
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
        handleComplianceChange,
        handleSave,
        getFaenaNameById,
        handleGetTaskBudget,
        handleGetTaskExpenses,
        handleGetInfoTask,
        handleGetTaskFaena,
        handleUpdateTask,
        handleDeleteTask,
    };
};