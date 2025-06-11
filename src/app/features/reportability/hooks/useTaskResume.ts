import { GET_SUBTASKS_BY_MONTH_YEAR_AND_PROCESS } from "@/app/api/subtasks";
import { useLazyQuery } from "@apollo/client";
import { useCallback } from "react";

export function useTaskResume() {
    const [GetSubtasksByMonthYearAndProcess, 
        {data: subtasksByMonthYearAndProcessData, 
        loading: subtasksByMonthYearAndProcessLoading, 
        error: subtasksByMonthYearAndProcessError}] = useLazyQuery(GET_SUBTASKS_BY_MONTH_YEAR_AND_PROCESS, {
            fetchPolicy: "network-only"
        })

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
                console.log("Process ID:", process);
                const count = await handleGetSubtasksByMonthYearAndProcess(month, process.id, year);
                totalTasks += count;
            }
            
            return totalTasks;
        } catch (error) {
            console.error("Error obtaining total subtasks:", error);
            return 0;
        }
    }, [handleGetSubtasksByMonthYearAndProcess]);

    return {
        handleGetSubtasksByMonthYearAndProcess,
        handleGetTotalSubtasksByMonthYear, 
        subtasksByMonthYearAndProcessData,
        subtasksByMonthYearAndProcessLoading,
        subtasksByMonthYearAndProcessError
    }
}