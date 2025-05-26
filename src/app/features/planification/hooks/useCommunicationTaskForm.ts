import { useCallback, useState, useEffect, useMemo } from "react";
import { useHooks } from "../../hooks/useHooks";
import { ITask, ITaskStatus } from "@/app/models/ITasks";
import { GET_TASK, GET_TASK_STATUSES, GET_TASK_TOTAL_BUDGET, GET_TASK_TOTAL_EXPENSE } from "@/app/api/tasks";
import { useLazyQuery, useQuery } from "@apollo/client";

export const useCommunicationTaskForm = (
    onSave: any, 
    isEditing?: boolean,
    selectedTask?: ITask,
    userRole?: string
) => {

    const [getTask] = useLazyQuery(GET_TASK);
    const [getTaskBudget] = useLazyQuery(GET_TASK_TOTAL_BUDGET);
    const [getTaskExpenses] = useLazyQuery(GET_TASK_TOTAL_EXPENSE);
    const {data: taskStateData} = useQuery(GET_TASK_STATUSES);

    const status = taskStateData?.taskStatuses || [];

    const taskStatuses = status.map((s: ITaskStatus) => s.name);

    const isPublicAffair = userRole === "encargado asuntos públicos" 

    const { valleysName, faenasName } = useHooks();

    /**
     * Estado del formulario
     * @description Maneja el estado del formulario para la creación o edición de tareas
     */
    const [formState, setFormState] = useState({
        name: "",
        description: "",
        valleyId: "",
        faenaId: "",
        statusId: 0,
        budget: 0,
        expense: 0,
    });

    /**
     * Función para obtener una tarea por su ID
     * @description Maneja la obtención de una tarea específica utilizando su ID
     * @param id ID de la tarea a obtener
     * @returns 
     */
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

    /**
     * Función para obtener el presupuesto de una tarea por su ID
     * @description Maneja la obtención del presupuesto total de una tarea específica utilizando su ID
     * @param id ID de la tarea para obtener el presupuesto
     * @returns 
     */
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


    /**
     * Función para obtener los gastos de una tarea por su ID
     * @description Maneja la obtención del total de gastos de una tarea específica utilizando su ID
     * @param id ID de la tarea para obtener los gastos
     * @returns 
     */
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

    /**
     * Función para obtener los valores iniciales del formulario
     * @description Maneja la obtención de los valores iniciales del formulario para una tarea específica
     */
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

    /**
     * Hook para manejar los efectos secundarios relacionados con la edición de tareas
     * @description Este hook se ejecuta cuando se cambia el estado de edición o la tarea seleccionada
     */
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


    /**
     * Función para manejar los cambios en los campos del formulario
     * @param field Campo del formulario que se está actualizando
     * @param value Nuevo valor para el campo del formulario
     * @description Actualiza el estado del formulario con el nuevo valor del campo especificado
     */
    const handleInputChange = useCallback((field: string, value: string) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    }, []);


    /**
     * Función para manejar el guardado del formulario
     * @description Maneja el guardado de los datos del formulario, ya sea creando una nueva tarea o actualizando una existente
     */
    const handleSave = useCallback(() => {
        let newTask ={};

        if (!isEditing) {
            newTask = {
                ...formState,
                statusId: 1,
                valleyId: valleysName.findIndex((v) => v === "Transversal") + 1,
                faenaId: faenasName.findIndex((f) => f === "Transversal") + 1,
                processId: isPublicAffair ? 5 : 4,
            };
        }else {
            newTask = {
                ...formState,
                statusId: Number(formState.statusId) ? Number(formState.statusId) : taskStatuses.findIndex((s: string | number) => s === formState.statusId) + 1,
                processId: isPublicAffair ? 5 : 4,
            }
        }
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