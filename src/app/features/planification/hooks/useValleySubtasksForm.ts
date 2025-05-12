import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { GET_BENEFICIARIES } from "@/app/api/beneficiaries";
import { GET_PRIORITIES, GET_SUBTASK_STATUSES } from "@/app/api/subtasks";
import { IPriority, ISubtasksStatus } from "@/app/models/ISubtasks";

interface Beneficiary {
    id: string;
    legalName: string;
  }  

interface SubtasksInitialValues {
    name?: string;
    number?: string;
    description?: string;
    budget?: string;
    expenses?: string;
    startDate?: string;
    endDate?: string;
    finishDate?: string;
    beneficiary?: string;
    state?: string;
    priority?: string;
}

// TODO: Define the type for the subtask object

export const useValleySubtasksForm = (onSave: (subtask: any) => void, subtask?: any) => {
    const [subtasksInitialValues, setSubtasksInitialValues] = useState<SubtasksInitialValues | undefined>(undefined);
    const {data: beneficiariesData} = useQuery(GET_BENEFICIARIES);

    const [beneficiariesMap, setBeneficiariesMap] = useState<Record<string, string>>({});
    
    const [beneficiariesIdToNameMap, setBeneficiariesIdToNameMap] = useState<Record<string, string>>({});

    const {data: subtaskPriorityData} = useQuery(GET_PRIORITIES);
    const {data: subtaskStateData} = useQuery(GET_SUBTASK_STATUSES);

    const priority = subtaskPriorityData?.priorities || [];
    const state = subtaskStateData?.subtaskStatuses || [];

    const subtaskPriority = priority.map((p: IPriority) => p.name);
    const subtaskState = state.map((s: ISubtasksStatus) => s.name);

    const [subtaskFormState, setSubtaskFormState] = useState({
        name: subtasksInitialValues?.name || "",
        number: subtasksInitialValues?.number || "",
        description: subtasksInitialValues?.description || "",
        budget: subtasksInitialValues?.budget || "",
        expenses: subtasksInitialValues?.expenses || "",
        startDate: subtasksInitialValues?.startDate || "",
        endDate: subtasksInitialValues?.endDate || "",
        finishDate: subtasksInitialValues?.finishDate || "",
        beneficiary: subtasksInitialValues?.beneficiary || "",
        state: subtasksInitialValues?.state || "",
        priority: subtasksInitialValues?.priority || "",
    });

    useEffect(() => {
        if (beneficiariesData?.beneficiaries) {
            const nameToIdMap: Record<string, string> = {};
            const idToNameMap: Record<string, string> = {};
            
            beneficiariesData.beneficiaries.forEach((beneficiary: Beneficiary) => {
                nameToIdMap[beneficiary.legalName] = beneficiary.id;
                idToNameMap[beneficiary.id] = beneficiary.legalName;
            });
            
            setBeneficiariesMap(nameToIdMap);
            setBeneficiariesIdToNameMap(idToNameMap);
        }
    }, [beneficiariesData]);

    const fetchSubtaskInitialValues = async () => {
        if (subtask) {
            try {
                const formatDateForInput = (dateString: string | null | undefined) => {
                    if (!dateString) return "";
                    const date = new Date(dateString);
                    if (isNaN(date.getTime())) return "";
                    return date.toISOString().split('T')[0]; 
                };

                let beneficiaryName = "";
                if (subtask.beneficiaryId) {
                    beneficiaryName = beneficiariesIdToNameMap[subtask.beneficiaryId] || "";
                }

                setSubtasksInitialValues({
                    name: subtask.name || "",
                    number: subtask.number || "",
                    description: subtask.description || "",
                    budget: subtask.budget || "",
                    expenses: subtask.expense || "",
                    startDate: formatDateForInput(subtask.startDate) || "",
                    endDate: formatDateForInput(subtask.endDate) || "",
                    finishDate: formatDateForInput(subtask.finalDate) || "", 
                    beneficiary: beneficiaryName, 
                    state: subtask.statusId || "",
                    priority: subtask.priorityId || "",
                });
            }
            catch (error) {
                console.error("Error fetching subtask initial values:", error);
            }
        }
    };

    useEffect(() => {
        if (Object.keys(beneficiariesIdToNameMap).length > 0) {
            fetchSubtaskInitialValues();
        }
    }, [subtask, beneficiariesIdToNameMap]);

    useEffect(() => {
        if (subtasksInitialValues) {
            setSubtaskFormState({
                name: subtasksInitialValues.name || "",
                number: subtasksInitialValues.number || "",
                description: subtasksInitialValues.description || "",
                budget: subtasksInitialValues.budget || "",
                expenses: subtasksInitialValues.expenses || "",
                startDate: subtasksInitialValues.startDate || "",
                endDate: subtasksInitialValues.endDate || "",
                finishDate: subtasksInitialValues.finishDate || "",
                beneficiary: subtasksInitialValues.beneficiary || "",
                state: subtasksInitialValues.state || "",
                priority: subtasksInitialValues.priority || "",
            });
        }
    }, [subtasksInitialValues]);

    const handleSubtaskInputChange = useCallback((field: string, value: string) => {
        setSubtaskFormState((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleSaveSubtask = useCallback(() => {
        const beneficiaryId = beneficiariesMap[subtaskFormState.beneficiary] || "";
        
        const subtaskDetails = {
            ...subtaskFormState,
            number: parseInt(subtaskFormState.number) || 1,
            budget: parseInt(subtaskFormState.budget) || 0,
            expenses: parseInt(subtaskFormState.expenses) || 0,
            priority: Number(subtaskFormState.priority) ? Number(subtaskFormState.priority) : subtaskPriority.findIndex((p: string | number) => p === subtaskFormState.priority) + 1,
            status: Number(subtaskFormState.state) ? Number(subtaskFormState.state) : subtaskState.findIndex((s: string | number) => s === subtaskFormState.state) + 1,
            beneficiaryId: beneficiaryId,
        };
        
        onSave(subtaskDetails);
        setSubtaskFormState({
            name: "",
            number: "",
            description: "",
            budget: "",
            expenses: "",
            startDate: "",
            endDate: "",
            finishDate: "",
            beneficiary: "",
            state: "",
            priority: "",
        });
    }, [subtaskFormState, onSave, beneficiariesMap]);

    const dropdownItems = useMemo(() => {
        const beneficiaryNames = beneficiariesData?.beneficiaries
            ? beneficiariesData.beneficiaries.map((beneficiary: any) => beneficiary.legalName)
            : [];

        return {
            subtaskState: subtaskState,
            subtaskPriority: subtaskPriority,
            beneficiaries: beneficiaryNames,
        };
    }, [beneficiariesData]);

    return {
        subtaskFormState,
        dropdownItems,
        handleSubtaskInputChange,
        handleSaveSubtask,
    };
};