import { useState, useEffect, useCallback, useMemo } from "react";
import { HuascoValley, CopiapoValley, ElquiValley } from "@/constants/faenas";
import { taskOrigin, taskType, taskScope, taskInteraction, taskState, taskRisk, taskInvestment } from "@/constants/infoTasks";
import { Valleys } from "@/constants/valleys";
import { usePlanification } from "./usePlanification";

export interface InitialValues {
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

export const useValleyTaskForm = (onSave: (task: any) => void, valley:string,  isEditing?:boolean, infoTask?:any, subtask?: any) => {
    
    const { handleGetTaskBudget, handleGetTaskExpenses, handleGetTaskFaena } = usePlanification();
    const [initialValues, setInitialValues] = useState<InitialValues | undefined>(undefined);
   
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

    const handleInputChange = useCallback((field: string, value: string) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleSave = useCallback(() => {
        let taskDetails = {};
        if (!isEditing) {
            taskDetails = {
                ...formState,
                valley: Valleys.findIndex((v) => v === valley) + 1,
                faena: Number(formState.faena) ? Number(formState.faena) : faenas.findIndex((f) => f === formState.faena) + 1,
                risk: Number(formState.risk) ? Number(formState.risk) : taskRisk.findIndex((r) => r === formState.risk) + 1,
                state: Number(formState.state) ? Number(formState.state) : taskState.findIndex((s) => s === formState.state) + 1,
                interaction: Number(formState.interaction) ? Number(formState.interaction) : taskInteraction.findIndex((i) => i === formState.interaction) + 1,
                scope: Number(formState.scope) ? Number(formState.scope) : taskScope.findIndex((s) => s === formState.scope) + 1,
                type: Number(formState.type) ? Number(formState.type) : taskType.findIndex((t) => t === formState.type) + 1,
                origin: Number(formState.origin) ? Number(formState.origin) : taskOrigin.findIndex((o) => o === formState.origin) + 1,
                investment: Number(formState.investment) ? Number(formState.investment) : taskInvestment.findIndex((i) => i === formState.investment) + 1,
            };
        } else {
            taskDetails = {
                ...formState,
                risk: Number(formState.risk) ? Number(formState.risk) : taskRisk.findIndex((r) => r === formState.risk) + 1,
                state: Number(formState.state) ? Number(formState.state) : taskState.findIndex((s) => s === formState.state) + 1,
                interaction: Number(formState.interaction) ? Number(formState.interaction) : taskInteraction.findIndex((i) => i === formState.interaction) + 1,
                scope: Number(formState.scope) ? Number(formState.scope) : taskScope.findIndex((s) => s === formState.scope) + 1,
                type: Number(formState.type) ? Number(formState.type) : taskType.findIndex((t) => t === formState.type) + 1,
                origin: Number(formState.origin) ? Number(formState.origin) : taskOrigin.findIndex((o) => o === formState.origin) + 1,
                investment: Number(formState.investment) ? Number(formState.investment) : taskInvestment.findIndex((i) => i === formState.investment) + 1,
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
    }, [formState, onSave]);

    const handleValleySelect = useCallback((valley: string) => {
        switch (valley) {
            case "Valle de Copiapó":
                setFaenas(CopiapoValley);
                break;
            case "Valle del Huasco":
                setFaenas(HuascoValley);
                break;
            case "Valle del Elqui":
                setFaenas(ElquiValley);
                break;
            case "Transversal":
                setFaenas(["Transversal"]);
                break;
            default:
                setFaenas([]);
                break;
        }
    }, []);

    useEffect(() => {
        handleValleySelect(valley);
    },[valley]);

    const dropdownItems = useMemo(() => ({
        origin: taskOrigin,
        type: taskType,
        scope: taskScope,
        interaction: taskInteraction,
        state: taskState,
        risk : taskRisk,
        investment: taskInvestment,
    }), []);

    return {
        formState,
        faenas,
        dropdownItems,
        handleInputChange,
        handleSave,
    };
};