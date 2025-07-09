import { useState, useEffect, useCallback, useMemo } from "react";
import { GET_ALL_RISKS, GET_ALL_ORIGINS, GET_ALL_INVESTMENTS, GET_ALL_INTERACTIONS, GET_ALL_SCOPES, GET_ALL_TYPES, GET_TASK_INFO } from "@/app/api/infoTask";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { IInteraction, IInvestment, IOrigin, IRisk, IScope, IType } from "@/app/models/IInfoTask";
import { GET_TASK_STATUSES, GET_TASK_TOTAL_BUDGET, GET_TASK_TOTAL_EXPENSE, UPDATE_TASK, DELETE_TASK } from "@/app/api/tasks";
import { IInfoTask, ITaskStatus } from "@/app/models/ITasks";
import { UPDATE_INFO_TASK } from "@/app/api/infoTask";
import { TaskInitialValues as InitialValues, TaskDetails } from "@/app/models/ITaskForm";
import { useHooks } from "../../hooks/useHooks";
import { CREATE_COMPLIANCE } from "@/app/api/compliance";
import { GET_BENEFICIARIES } from "@/app/api/beneficiaries";
import { IBeneficiary } from "@/app/models/IBeneficiary";

export const useValleyTaskForm = (onSave: (task: TaskDetails) => void, valley:string, isEditing?:boolean, infoTask?:IInfoTask) => {
    
    const [initialValues, setInitialValues] = useState<InitialValues | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);
    const [updateTask] = useMutation(UPDATE_TASK);;
    const [createCompliance] = useMutation(CREATE_COMPLIANCE);
    const [updateInfoTask] = useMutation(UPDATE_INFO_TASK);
    const [deleteTask] = useMutation(DELETE_TASK);
    
    const [getTaskBudget] = useLazyQuery(GET_TASK_TOTAL_BUDGET);
    const [getTaskExpenses] = useLazyQuery(GET_TASK_TOTAL_EXPENSE);
    const [getInfoTask] = useLazyQuery(GET_TASK_INFO);

    const {valleysName: valleyNames} = useHooks();

    const {data: riskData} = useQuery(GET_ALL_RISKS);
    const {data: originData} = useQuery(GET_ALL_ORIGINS);
    const {data: investmentData} = useQuery(GET_ALL_INVESTMENTS);
    const {data: interactionData} = useQuery(GET_ALL_INTERACTIONS);
    const {data: scopeData} = useQuery(GET_ALL_SCOPES);
    const {data: typeData} = useQuery(GET_ALL_TYPES);
    const {data: taskStateData} = useQuery(GET_TASK_STATUSES);
    const {data: beneficiariesData} = useQuery(GET_BENEFICIARIES);

    const risks = riskData?.risks || [];
    const origins = originData?.origins || [];
    const investments = investmentData?.investments || [];
    const interactions = interactionData?.interactions || [];
    const scopes = scopeData?.scopes || [];
    const types = typeData?.types || [];
    const states = taskStateData?.taskStatuses || [];
    const beneficiaries = beneficiariesData?.beneficiaries || [];

    const taskRisk = risks.map((r: IRisk) => r.type);
    const taskOrigin = origins.map((o: IOrigin) => o.name);
    const taskInvestment = investments.map((i: IInvestment) => i.line);
    const taskInteraction = interactions.map((i: IInteraction) => i.operation);
    const taskScope = scopes.map((s: IScope) => s.name);
    const taskType = types.map((t: IType) => t.name);
    const taskState = initialValues?.compliance? states.map((s: ITaskStatus) => s.name) : states.filter((s: ITaskStatus) => s.name !== "Due Diligence").map((s: ITaskStatus) => s.name);
    const taskBeneficiaries = beneficiaries.map((b: IBeneficiary) => b.legalName);

    /**
     * Función para eliminar una tarea
     * @description Maneja la eliminación de una tarea utilizando su ID
     * @param taskId ID de la tarea a eliminar
     */
    const handleDeleteTask = async (taskId: string) => {
        try {
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
            };
            if (data?.updateTask.status.id === 3) {
                await createCompliance({
                    variables: {
                        input: {
                            taskId: data.updateTask.id,
                            statusId: 1,
                        },
                    },
                });
            };

            await updateInfoTask({
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
        beneficiary: string | number;
        compliance?: boolean;
        valley: string;
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
        beneficiary: initialValues?.beneficiary || "",
        compliance: initialValues?.compliance ?? undefined,
        valley: valley,
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
              beneficiary: typeof infoTask.task.beneficiaryId === "string" ? infoTask.task.beneficiaryId : undefined,
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
        beneficiary: initialValues.beneficiary || "",
        compliance: initialValues.compliance ?? false,
        valley: valley,
        });
    }
    }, [initialValues]); 
    
    /**
     * Función para validar la transición de estado de una tarea
     * @description Verifica si la transición de estado es válida según las reglas definidas
     * @param currentState Estado actual de la tarea
     * @param newState Nuevo estado al que se quiere cambiar
     * @return Booleano que indica si la transición es válida
     */
    const isValidStateTransition = useCallback((currentState: string | number, newState: string) => {
        const isCurrentStateInProcess = 
            currentState === "En Proceso" || 
            (typeof currentState === 'number' && states.find((s: ITaskStatus) => s.id === currentState)?.name === "En Proceso");
        
        if (isCurrentStateInProcess && ["NO iniciada", "En Espera", "Due Diligence"].includes(newState)) {
            return false;
        }
        
        return true;
    }, [states]);
    

    /**
     * Función para manejar los cambios en los campos del formulario
     * @description Actualiza el estado del formulario cuando un campo cambia
     * @param field Nombre del campo que cambió
     * @param value Nuevo valor del campo
     */
    const handleInputChange = useCallback((field: string, value: string | number | boolean) => {
        if (field === "state") {
            const newState = value as string;
            if (!isValidStateTransition(formState.state, newState)) {
                const currentState = typeof formState.state === 'number' ? states.find((s: ITaskStatus) => s.id === formState.state)?.name : formState.state;
                setError(`No se permite cambiar de '${currentState}' a '${newState}'`);
                return;
            }
        setError(null);
    }
    
    setFormState((prev) => ({ ...prev, [field]: value }));
    }, [formState, isValidStateTransition]);

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
                valley: valleyNames.findIndex((v) => v === formState.valley) + 1,
                risk: Number(formState.risk) ? Number(formState.risk) : taskRisk.findIndex((r: string | number) => r === formState.risk) + 1,
                state: Number(formState.state) ? Number(formState.state) : taskState.findIndex((s: string | number) => s === formState.state) + 1,
                interaction: Number(formState.interaction) ? Number(formState.interaction) : taskInteraction.findIndex((i: string | number) => i === formState.interaction) + 1,
                scope: Number(formState.scope) ? Number(formState.scope) : taskScope.findIndex((s: string | number) => s === formState.scope) + 1,
                type: Number(formState.type) ? Number(formState.type) : taskType.findIndex((t: string | number) => t === formState.type) + 1,
                origin: Number(formState.origin) ? Number(formState.origin) : taskOrigin.findIndex((o: string | number) => o === formState.origin) + 1,
                investment: Number(formState.investment) ? Number(formState.investment) : taskInvestment.findIndex((i: string | number) => i === formState.investment) + 1,
                beneficiary: formState.beneficiary ? beneficiaries.find((b: IBeneficiary) => b.legalName === formState.beneficiary).id : null,
                process: formState.valley === "Valle de Copiapó" ? 1 : formState.valley === "Valle del Huasco" ? 2 : formState.valley === "Valle del Elqui" ? 3 : null,                compliance: formState.compliance ?? false,
            };
        } else {
            taskDetails = {
                ...formState,
                risk: Number(formState.risk) ? Number(formState.risk) : taskRisk.findIndex((r: string | number) => r === formState.risk) + 1,
                state: states.find((s: ITaskStatus) => s.name === formState.state || s.id === formState.state)?.id || null,
                interaction: Number(formState.interaction) ? Number(formState.interaction) : taskInteraction.findIndex((i: string | number) => i === formState.interaction) + 1,
                scope: Number(formState.scope) ? Number(formState.scope) : taskScope.findIndex((s: string | number) => s === formState.scope) + 1,
                type: Number(formState.type) ? Number(formState.type) : taskType.findIndex((t: string | number) => t === formState.type) + 1,
                origin: Number(formState.origin) ? Number(formState.origin) : taskOrigin.findIndex((o: string | number) => o === formState.origin) + 1,
                investment: Number(formState.investment) ? Number(formState.investment) : taskInvestment.findIndex((i: string | number) => i === formState.investment) + 1,
                beneficiary: formState.beneficiary ? beneficiaries.find((b: IBeneficiary) => b.legalName === formState.beneficiary).id : null,
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
            beneficiary: "",
            compliance: undefined,
            valley: valley,
        });
    }, [formState, onSave]);

    const dropdownItems = useMemo(() => ({
        origin: taskOrigin || [],
        type: taskType || [],
        scope: taskScope || [],
        interaction: taskInteraction || [],
        investment: taskInvestment || [],
        state: taskState || [],
        risk: taskRisk || [],
        beneficiaries: taskBeneficiaries || [],
        valleyNames: valleyNames.filter((v) => v !== "Transversal") || []
    }), [taskOrigin, taskType, taskScope, taskInteraction, taskState, taskRisk, taskBeneficiaries, valleyNames]);

    /**
     * Hook para validar el formulario
     * @description Utiliza useMemo para calcular si el formulario es válido según los campos requeridos
     * @returns Booleano que indica si el formulario es válido
     */
    const isFormValid = useMemo(() => {
        if (error) return false;
        
        if (!isEditing) {
            return Boolean(
                formState.name && 
                formState.origin && 
                formState.investment && 
                formState.type && 
                formState.scope && 
                formState.interaction && 
                formState.risk && 
                formState.compliance !== undefined
            );
        } else {
            return Boolean(
                formState.name && 
                formState.origin && 
                formState.investment && 
                formState.type && 
                formState.scope && 
                formState.interaction && 
                formState.risk
            );
        }
    }, [formState, isEditing, error]); 

    return {
        formState,
        dropdownItems,
        isFormValid,
        error,
        isValidStateTransition,
        handleInputChange,
        handleComplianceChange,
        handleSave,
        handleDeleteTask,
        handleGetTaskBudget,
        handleGetTaskExpenses,
        handleGetInfoTask,
        handleUpdateTask,
        setError
    };
};