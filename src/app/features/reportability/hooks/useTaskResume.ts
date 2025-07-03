import { GET_SUBTASKS_BY_MONTH_YEAR_AND_PROCESS } from "@/app/api/subtasks";
import { GET_TASK_PROGRESS, GET_TASKS_BY_PROCESS } from "@/app/api/tasks";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { useHooks } from "../../hooks/useHooks";
import { ITask } from "@/app/models/ITasks";
import { IProcess } from "@/app/models/IProcess";
import { SUBTASKS_BY_PROCESS } from "@/app/api/subtasks";

export function useTaskResume() {
    const [GetSubtasksByMonthYearAndProcess, 
        {data: subtasksByMonthYearAndProcessData, 
        loading: subtasksByMonthYearAndProcessLoading, 
        error: subtasksByMonthYearAndProcessError}] = useLazyQuery(GET_SUBTASKS_BY_MONTH_YEAR_AND_PROCESS, {
            fetchPolicy: "network-only"
    })

    const { currentProcess } = useHooks();

    const skipTaskQuery = !currentProcess?.id;
    
    const { data: taskData, loading: taskLoading, error: taskError } = useQuery(GET_TASKS_BY_PROCESS, {
        fetchPolicy: "network-only",
        variables: {
            processId: currentProcess?.id || 0 
        },
        skip: skipTaskQuery 
    });

    const [GetTaskProgress] = useLazyQuery(GET_TASK_PROGRESS);
    const [tasksPercentage, setTasksPercentage] = useState<number[]>([]);
    const [ProcessPercentage, setProcessPercentage] = useState<number>(0);

    const [GetSubtasksByProcess] = useLazyQuery(SUBTASKS_BY_PROCESS, { fetchPolicy: "network-only" });

    /**
     * Función para obtener el porcentaje de tareas completadas por proceso.
     * @description Utiliza la consulta GET_TASK_PROGRESS para obtener el progreso de cada tarea.
     */
    const handleGetTasksPercentage = useCallback(async () => {
        if (!taskData?.tasksByProcess || !Array.isArray(taskData.tasksByProcess)) {
            console.error("No task data available or invalid format");
            return;
        }

        setTasksPercentage([]);

        const promises = taskData.tasksByProcess.map(async (task: ITask) => {
            if (!task?.id) {
                console.warn("Task without ID found");
                return 0;
            }
            
            try {
                const { data } = await GetTaskProgress({
                    variables: {
                        id: task.id
                    }
                });
                
                return data?.taskProgress || 0;
            } catch (error) {
                console.error("Error getting task progress:", error);
                return 0;
            }
        });

        try {
            const percentages = await Promise.all(promises);
            setTasksPercentage(percentages);
        } catch (error) {
            console.error("Error in Promise.all:", error);
            setTasksPercentage([]);
        }
    }, [taskData, GetTaskProgress]);


    /**
     * Función para obtener el número de subtareas completadas por mes, año y proceso.
     * @description Utiliza la consulta GET_SUBTASKS_BY_MONTH_YEAR_AND_PROCESS para obtener el número de subtareas.
     * @param month - Nombre del mes (ej. "Enero").
     * @param processId - ID del proceso.
     * @param year - Año.
     * @returns Número de subtareas completadas.
     */
    const handleGetSubtasksByMonthYearAndProcess = useCallback(async (month: string, processId: number, year: number) => { 
        if (!month || !year || !processId) {
            console.warn("Invalid parameters for subtasks query:", { month, year, processId });
            return 0;
        }

        try {
            const { data } = await GetSubtasksByMonthYearAndProcess({
                variables: {
                    monthName: month,
                    year: year,
                    processId: processId
                }
            });
            
            if (!data?.subtasksByMonthYearAndProcess) {
                console.warn("No subtasks data returned");
                return 0;
            }
            
            return data.subtasksByMonthYearAndProcess.length;

        }
        catch (error) {
            console.error("Error obtaining subtasks:", error);
            return 0; 
        }
    }, [GetSubtasksByMonthYearAndProcess]);


    /**
     * Función para obtener el número total de subtareas completadas por mes y año para todos los procesos.
     * @description Itera sobre los procesos y utiliza handleGetSubtasksByMonthYearAndProcess para obtener el número de subtareas por cada proceso.
     * @param month - Nombre del mes (ej. "Enero").
     * @param year - Año.
     * @param processes - Lista de procesos.
     * @returns Número total de subtareas completadas.
     */
    const handleGetTotalSubtasksByMonthYear = useCallback(async (month: string, year: number, processes: IProcess[]) => {
        if (!month || !year || !Array.isArray(processes) || processes.length === 0) {
            console.warn("Invalid parameters for total subtasks:", { month, year, processesLength: processes?.length });
            return 0;
        }

        try {
            let totalTasks = 0;

            for (const process of processes) {
                if (!process?.id) {
                    console.warn("Process without ID found");
                    continue;
                }
                
                const count = await handleGetSubtasksByMonthYearAndProcess(month, process.id, year);
                totalTasks += count;
            }
            
            return totalTasks;
        } catch (error) {
            console.error("Error obtaining total subtasks:", error);
            return 0;
        }
    }, [handleGetSubtasksByMonthYearAndProcess]);

    /**
     * Hook para manejar el estado de las tareas y subtareas.
     * @description Inicializa el estado de las tareas y subtareas, y configura los efectos secundarios para cargar los datos.
     */
    useEffect(() => {
        if (taskData && !taskLoading && !taskError) {
            handleGetTasksPercentage();
        }
    }, [taskData, taskLoading, taskError, handleGetTasksPercentage]);

    /**
     * Hook para calcular el porcentaje total de tareas completadas.
     * @description Utiliza tasksPercentage para calcular el porcentaje total de tareas completadas.
     * @param tasksPercentage - Array de porcentajes de tareas completadas.
     * @returns Porcentaje total de tareas completadas.
     */
    const handleGetTotalPercentage = useCallback(() => {
        if (tasksPercentage.length === 0) return;

        const total = tasksPercentage.reduce((acc, curr) => acc + curr, 0);
        const averagePercentage = total / tasksPercentage.length;
        const roundedPercentage = Math.round(averagePercentage * 100) / 100; 
        setProcessPercentage(roundedPercentage);
    }, [tasksPercentage]);

    /** 
    * Hook para calcular el porcentaje total de tareas completadas.
    * @description Utiliza handleGetTotalPercentage para calcular el porcentaje total de tareas completadas.
    */
    useEffect(() => {
        handleGetTotalPercentage();
    }, [handleGetTotalPercentage]);

    /**
     * Función para obtener el total de subtareas por proceso (sin filtrar por mes/año)
     * @param processId - ID del proceso
     * @returns Número de subtareas
     */
    const handleGetSubtasksByProcess = useCallback(async (processId: number) => {
        if (!processId) return 0;
        try {
            const { data } = await GetSubtasksByProcess({ variables: { processId } });
            if (!data?.subtasksByProcess) return 0;
            return data.subtasksByProcess.length;
        } catch (error) {
            console.error("Error al obtener las subtareas por proceso", error)
            return 0;
        }
    }, [GetSubtasksByProcess]);

    const pieChartData = {
        labels: ['Completado', 'Pendiente'],
        datasets: [
            {
                data: [ProcessPercentage, 100 - ProcessPercentage],
                id: [],
                backgroundColor: ['#1964CB', '#E9E9E9'],
                hoverBackgroundColor: ['#1964CB', '#E9E9E9'],
            },
        ],
    };

    return {
        handleGetSubtasksByMonthYearAndProcess,
        handleGetTotalSubtasksByMonthYear, 
        subtasksByMonthYearAndProcessData,
        subtasksByMonthYearAndProcessLoading,
        subtasksByMonthYearAndProcessError,
        pieChartData,
        ProcessPercentage,
        tasksPercentage,
        handleGetSubtasksByProcess
    }
}