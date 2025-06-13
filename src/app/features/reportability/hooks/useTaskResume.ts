import { GET_SUBTASKS_BY_MONTH_YEAR_AND_PROCESS } from "@/app/api/subtasks";
import { GET_TASK_PROGRESS, GET_TASKS_BY_PROCESS } from "@/app/api/tasks";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { useHooks } from "../../hooks/useHooks";
import { ITask } from "@/app/models/ITasks";

export function useTaskResume() {
    const [GetSubtasksByMonthYearAndProcess, 
        {data: subtasksByMonthYearAndProcessData, 
        loading: subtasksByMonthYearAndProcessLoading, 
        error: subtasksByMonthYearAndProcessError}] = useLazyQuery(GET_SUBTASKS_BY_MONTH_YEAR_AND_PROCESS, {
            fetchPolicy: "network-only"
    })

    const { currentProcess } = useHooks();

    const { data: taskData, loading: taskLoading, error: taskError } = useQuery(GET_TASKS_BY_PROCESS, {
        fetchPolicy: "network-only",
        variables: {
            processId: currentProcess?.id || null
        }
    });

    const [GetTaskProgress] = useLazyQuery(GET_TASK_PROGRESS);
    const [tasksPercentage, setTasksPercentage] = useState<number[]>([]);
    const [ProcessPercentage, setProcessPercentage] = useState<number>(0);

    const handleGetTasksPercentage = useCallback(async () => {
        if (!taskData) return;

        setTasksPercentage([]);

        const promises = taskData.tasksByProcess.map(async (task: ITask) => {
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

    const handleGetSubtasksByMonthYearAndProcess = useCallback(async (month: string, processId: number, year: number) => { 
        try {
            const { data } = await GetSubtasksByMonthYearAndProcess({
                variables: {
                    monthName: month,
                    year: year,
                    processId: processId
                }
            });
            
            return data.subtasksByMonthYearAndProcess.length;

        }
        catch (error) {
            console.error("Error obtaining subtasks:", error);
            return 0; 
        }
    }, [GetSubtasksByMonthYearAndProcess]);

    const handleGetTotalSubtasksByMonthYear = useCallback(async (month: string, year: number, processes: any[]) => {
        try {
            let totalTasks = 0;

            for (const process of processes) {
                const count = await handleGetSubtasksByMonthYearAndProcess(month, process.id, year);
                totalTasks += count;
            }
            
            return totalTasks;
        } catch (error) {
            console.error("Error obtaining total subtasks:", error);
            return 0;
        }
    }, [handleGetSubtasksByMonthYearAndProcess]);

    useEffect(() => {
        if (taskData && !taskLoading && !taskError) {
            handleGetTasksPercentage();
        }
    }, [taskData, taskLoading, taskError, handleGetTasksPercentage]);

    const handleGetTotalPercentage = useCallback(() => {
        if (tasksPercentage.length === 0) return;

        const total = tasksPercentage.reduce((acc, curr) => acc + curr, 0);
        const averagePercentage = total / tasksPercentage.length;
        const roundedPercentage = Math.round(averagePercentage * 100) / 100; 
        setProcessPercentage(roundedPercentage);
    }, [tasksPercentage]);

    useEffect(() => {
        handleGetTotalPercentage();
    }, [handleGetTotalPercentage]);

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
        tasksPercentage
    }
}