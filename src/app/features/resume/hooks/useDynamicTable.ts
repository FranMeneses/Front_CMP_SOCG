import { useState, useEffect, useCallback } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_TASK_PROGRESS } from "@/app/api/tasks";
import { ITask } from "@/app/models/ITasks";

export function useDynamicTable(tasks: ITask[]) {
    const [taskProgressMap, setTaskProgressMap] = useState<Record<string, number>>({});
    const [getTaskProgress] = useLazyQuery(GET_TASK_PROGRESS);

    const fetchTaskProgress = useCallback(async () => {
        const progressMap: Record<string, number> = {};
        for (const task of tasks) {
            try {
                const { data } = await getTaskProgress({ variables: { id: task.id } });
                if (data && data.taskProgress !== undefined) {
                    progressMap[task.id] = data.taskProgress;
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

    return {
        taskProgressMap,
    };
}