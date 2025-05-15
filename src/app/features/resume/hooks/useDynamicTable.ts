import { useState, useEffect, useCallback } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_TASK_PROGRESS } from "@/app/api/tasks";
import { ITask } from "@/app/models/ITasks";
import { ISubtask } from "@/app/models/ISubtasks";

export function useDynamicTable(tasks: ITask[]) {
    const [taskProgressMap, setTaskProgressMap] = useState<Record<string, number>>({});
    const [getTaskProgress] = useLazyQuery(GET_TASK_PROGRESS);

    const fetchTaskProgress = useCallback(async () => {
        const progressMap: Record<string, number> = {};
        for (const task of tasks) {
            try {
                const { data } = await getTaskProgress({ variables: { id: task.id } });
                if (data && data.taskProgress !== undefined) {
                    if (task.id) {
                        progressMap[task.id] = data.taskProgress;
                    }
                }
            } catch (error) {
                console.error(`Error fetching progress for task ID: ${task.id}`, error);
            }
        }
        setTaskProgressMap(progressMap);
    }, [tasks, getTaskProgress]);

    useEffect(() => {
        if (tasks.length > 0) {
            fetchTaskProgress();
        }
    }, [tasks, fetchTaskProgress]);

    const calculateRemainingDays = (subtask: ISubtask) => {
        const end = new Date(subtask.endDate);
        if (subtask.status.percentage === 100) {
            const finishDate = new Date(subtask.finalDate);
            const startDate = new Date(subtask.startDate);
            const diffTime = finishDate.getTime() - startDate.getTime(); 
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        }
        const today = new Date();
        const diffTime = end.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const formatDate = (isoDate: string): string => {
        const date = new Date(isoDate);
    
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); 
        const day = String(date.getDate() +1 ).padStart(2, "0");
    
        return `${day}-${month}-${year}`; 
    };

    const getColor = (percentage: number) => {
        if (percentage === 100) return "bg-green-500";
        if (percentage > 30 && percentage < 100) return "bg-yellow-500";
        return "bg-red-500";
    };

    const getWidth = (percentage: number) => {
        if (percentage === 100) return "w-full";
        if (percentage > 70 && percentage < 100) return "w-3/4";
        if (percentage > 50 && percentage < 70) return "w-1/2";
        if (percentage > 30 && percentage < 50) return "w-1/3";
        if (percentage > 0 && percentage < 30) return "w-1/6";
        if (percentage === 0 ) return ;
        return "w-1/4";
    }
    
    return {
        taskProgressMap,
        calculateRemainingDays,
        formatDate,
        getColor,
        getWidth,
    };
}