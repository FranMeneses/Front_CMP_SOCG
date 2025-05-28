import { GET_SUBTASKS_BY_MONTH_YEAR_AND_VALLEY } from "@/app/api/subtasks";
import { useLazyQuery } from "@apollo/client";
import { useCallback } from "react";

export function useTaskResume() {
    const [GetSubtasksByMonthYearAndValley, 
        {data: subtasksByMonthYearAndValleyData, 
        loading: subtasksByMonthYearAndValleyLoading, 
        error: subtasksByMonthYearAndValleyError}] = useLazyQuery(GET_SUBTASKS_BY_MONTH_YEAR_AND_VALLEY);

    const handleGetSubtasksByMonthYearAndValley = useCallback(async (month: string, valleyId: number, year: number) => { 
        try {
            const { data } = await GetSubtasksByMonthYearAndValley({
                variables: {
                    monthName: month,
                    year: year,
                    valleyId: valleyId
                }
            });
            if (data.subtasksByMonthYearAndValley.length > 0) {
                return data.subtasksByMonthYearAndValley.length;
            }
            if (data.subtasksByMonthYearAndValley.length == 0) {
                console.log("CASO B")
                return 0;
            }
        }
        catch (error) {
            console.error("Error obtaining subtasks:", error);
            return 0; 
        }
    }, [GetSubtasksByMonthYearAndValley]);

    const handleGetTotalSubtasksByMonthYear = useCallback(async (month: string, year: number, valleys: any[]) => {
        try {
            let totalTasks = 0;
            
            for (const valley of valleys) {
                const count = await handleGetSubtasksByMonthYearAndValley(month, valley.id, year);
                totalTasks += count;
            }
            
            return totalTasks;
        } catch (error) {
            console.error("Error obtaining total subtasks:", error);
            return 0;
        }
    }, [handleGetSubtasksByMonthYearAndValley]);

    return {
        handleGetSubtasksByMonthYearAndValley,
        handleGetTotalSubtasksByMonthYear, 
        subtasksByMonthYearAndValleyData,
        subtasksByMonthYearAndValleyLoading,
        subtasksByMonthYearAndValleyError
    }
}