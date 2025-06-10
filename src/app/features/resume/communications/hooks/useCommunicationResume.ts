import { GET_TASKS_BY_PROCESS } from "@/app/api/tasks";
import { ITask } from "@/app/models/ITasks";
import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";

export function useCommunicationResume() {
    const [ getTasksByProcess] = useLazyQuery(GET_TASKS_BY_PROCESS);
    const [isLoadingTaskDetails, setIsLoadingTaskDetails] = useState(false);
    const [budgetLoading, setBudgetLoading] = useState(false);
    const [tasksData, setTasksData] = useState<ITask[]>([]);

        const loadCommunicationProcessesTasks = async () => {
            const communicationProcessIds = [4, 5, 6, 7]; 
            const allTasks: ITask[] = [];
            
            setIsLoadingTaskDetails(true);
            
            try {
            for (const processId of communicationProcessIds) {
                const { data } = await getTasksByProcess({
                variables: { processId },
                });
                const processTasks = data?.tasksByProcess || [];
                allTasks.push(...processTasks);
            }
            
            return allTasks;
            } catch (error) {
            console.error("Error loading communication processes tasks:", error);
            return [];
            } finally {
            setIsLoadingTaskDetails(false);
            }
        };

        useEffect(() => {
          const loadInitialCommunicationTasks = async () => {
              try {
                setIsLoadingTaskDetails(true);
                const communicationTasks = await loadCommunicationProcessesTasks();
                setTasksData(communicationTasks);
                
              } catch (error) {
                console.error("Error loading initial communication tasks:", error);
              } finally {
                setIsLoadingTaskDetails(false);
              }
          };
          loadInitialCommunicationTasks();
        }, []);

        return {
            loadCommunicationProcessesTasks,
            isLoadingTaskDetails,
            tasksData,
        };
};