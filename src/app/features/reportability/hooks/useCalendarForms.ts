import { GET_TASK } from "@/app/api/tasks";
import { useLazyQuery } from "@apollo/client";
import { useCallback } from "react";

export function useCalendarForms() {
    const [getTask, { loading: taskLoading }] = useLazyQuery(GET_TASK);

    const handleGetTaskName = useCallback(async (taskId: string) => {
        try {
            const { data } = await getTask({ variables: { id: taskId } });
            return data.task.name;
        } catch (error) {
            console.error("Error fetching task:", error);
            return null;
        }
    }, [getTask]);

    return {
        handleGetTaskName,
    }
}