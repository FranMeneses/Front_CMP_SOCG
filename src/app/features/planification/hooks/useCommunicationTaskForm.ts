import { useCallback, useState, useEffect, useMemo } from "react";
import { useHooks } from "../../hooks/useHooks";
import { ITask, ITaskStatus } from "@/app/models/ITasks";
import { GET_TASK, GET_TASK_STATUSES, GET_TASK_TOTAL_BUDGET, GET_TASK_TOTAL_EXPENSE } from "@/app/api/tasks";
import { useLazyQuery, useQuery } from "@apollo/client";

export const useCommunicationTaskForm = (
    onSave: any, 
    isEditing?: boolean,
    selectedTask?: ITask
) => {

    const [getTask] = useLazyQuery(GET_TASK);
    const [getTaskBudget] = useLazyQuery(GET_TASK_TOTAL_BUDGET);
    const [getTaskExpenses] = useLazyQuery(GET_TASK_TOTAL_EXPENSE);
    const {data: taskStateData} = useQuery(GET_TASK_STATUSES);

    const status = taskStateData?.taskStatuses || [];

    const taskStatuses = status.map((s: ITaskStatus) => s.name);


    const { valleysName, faenasName } = useHooks();

    const [formState, setFormState] = useState({
        name: "",
        description: "",
        valleyId: "",
        faenaId: "",
        statusId: 0,
        budget: 0,
        expense: 0,
    });

    const handleGetTask = async (id :string) => {
        try {
            const { data } = await getTask({
                variables: { id },
            });
            return data.task;
        } catch (error) {
            console.error("Error fetching task:", error);
            return null;
        }
    };
    const handleGetTaskBudget = async (id: string) => {
        try {
            const { data } = await getTaskBudget({
                variables: { id },
            });
            return data.taskTotalBudget;
        } catch (error) {
            console.error("Error fetching task budget:", error);
            return null;
        }
    };

    const handleGetTaskExpenses = async (id: string) => {
        try {
            const { data } = await getTaskExpenses({
                variables: { id },
            });
            return data.taskTotalExpense;
        } catch (error) {
            console.error("Error fetching task expenses:", error);
            return null;
        }
    };

    const fetchInitialValues = async () => {
        
        const budget = await handleGetTaskBudget(selectedTask?.id ? selectedTask.id : "");
        const expenses = await handleGetTaskExpenses(selectedTask?.id ? selectedTask.id : "");

        if (isEditing && selectedTask && Object.keys(selectedTask).length > 0) {
            const valleyName = selectedTask.valleyId > 0 && selectedTask.valleyId <= valleysName.length 
                ? valleysName[selectedTask.valleyId - 1] 
                : "";
                
            const faenaName = selectedTask.faenaId > 0 && selectedTask.faenaId <= faenasName.length 
                ? faenasName[selectedTask.faenaId - 1] 
                : "";

            setFormState({
                name: selectedTask.name || "",
                description: selectedTask.description || "",
                valleyId: valleyName,
                faenaId: faenaName,
                statusId: selectedTask.statusId || 0,
                budget: budget,
                expense: expenses
            });
        }
    }

    useEffect(() => {
        if (isEditing && selectedTask) {
            fetchInitialValues();
        } else {
            setFormState({
                name: "",
                description: "",
                valleyId: "",
                faenaId: "",
                statusId: 0,
                budget: 0,
                expense: 0,
            });
        }
    }, [isEditing, selectedTask]);


    const handleInputChange = useCallback((field: string, value: string) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    }, []);


    const handleSave = useCallback(() => {
        let newTask ={};

        if (!isEditing) {
            newTask = {
                ...formState,
                statusId: 1,
                valleyId: valleysName.findIndex((v) => v === formState.valleyId) + 1,
                faenaId: faenasName.findIndex((f) => f === formState.faenaId) + 1,
                processId: 4
            };
        }else {
            newTask = {
                ...formState,
                statusId: Number(formState.statusId) ? Number(formState.statusId) : taskStatuses.findIndex((s: string | number) => s === formState.statusId) + 1,
                valleyId: valleysName.findIndex((v) => v === formState.valleyId) + 1,
                faenaId: faenasName.findIndex((f) => f === formState.faenaId) + 1,
                processId: 4,
            }
        }
        console.log("newTask", newTask);
        onSave(newTask);
        
        setFormState({
            name: "",
            description: "",
            valleyId: "",
            faenaId: "",
            statusId: 0,
            budget: 0,
            expense: 0,
        });

    }, [formState, valleysName, faenasName, onSave, isEditing]);

    const dropdownItems = useMemo(() => ({
        statuses: taskStatuses || [],
    }), [taskStatuses]);

    return {
        formState,
        dropdownItems,
        handleInputChange,
        handleSave,
        handleGetTask,
    };
};