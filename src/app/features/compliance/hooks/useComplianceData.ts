import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_APPLIED_COMPLIANCES } from "@/app/api/compliance";
import { TaskDetails } from "@/app/models/ITaskForm";
import { ICompliance } from "@/app/models/ICompliance";

export const useComplianceData = (currentValleyId: number | undefined, userRole:string) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [tasksData, setTasksData] = useState<ICompliance[]>([]);

  const [isLoadingSubtasks, setIsLoadingSubtasks] = useState<boolean>(false);
  const [isLoadingTaskDetails, setIsLoadingTaskDetails] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);


  const dummyTask = (task: TaskDetails) => {};

  const { 
    data: allCompliancesData, 
    loading: allCompliancesLoading, 
    error: allCompliancesError,
    refetch: refetchAllTasks 
  } = useQuery(GET_APPLIED_COMPLIANCES);
;

  const error = allCompliancesError;
  const mainQueryLoading =  allCompliancesLoading;
  
  // Modificar refetch para considerar los roles de comunicación
  const refetch = async () => {
    return refetchAllTasks();
  };
  

  const loading = mainQueryLoading || isLoadingSubtasks || isLoadingTaskDetails || 
                  isInitialLoad 


  /**
   * Hook para manejar el estado de las tareas
   * @description Inicializa el estado de las tareas y subtareas, y configura los efectos secundarios para cargar los datos
   */
  useEffect(() => {
    const newTasks = (allCompliancesData?.getAppliedCompliances || []);
    setTasksData(newTasks);
    setIsInitialLoad(false); // Actualizar isInitialLoad a false después de cargar los datos
  }, [allCompliancesData]);


  const unifiedData :ICompliance[] =  allCompliancesData?.getAppliedCompliances || [] ;

  return {
    data: unifiedData,
    loading,
    error,
    activeFilter,
    refetch,
    setActiveFilter,
  };
};