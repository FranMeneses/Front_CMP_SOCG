import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_COMPLIANCES } from "@/app/api/compliance";
import { ICompliance } from "@/app/models/ICompliance";

export const useComplianceData = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [tasksData, setTasksData] = useState<ICompliance[]>([]);

  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  const { 
    data: allCompliancesData, 
    loading: allCompliancesLoading, 
    error: allCompliancesError,
    refetch: refetchAllTasks 
  } = useQuery(GET_ALL_COMPLIANCES, { fetchPolicy: 'network-only' });

  const error = allCompliancesError;
  const mainQueryLoading =  allCompliancesLoading;
  
  const refetch = async () => {
    return refetchAllTasks();
  };
  

  const loading = mainQueryLoading || isInitialLoad 


  /**
   * Hook para manejar el estado de las tareas
   * @description Inicializa el estado de las tareas y subtareas, y configura los efectos secundarios para cargar los datos
   */
  useEffect(() => {
    const newTasks = (allCompliancesData?.findAllCompliances || []);
    setTasksData(newTasks);
    setIsInitialLoad(false); 
  }, [allCompliancesData]);

  const unifiedData :ICompliance[] =  [...(allCompliancesData?.findAllCompliances || [])] ;

  return {
    data: unifiedData,
    loading,
    error,
    activeFilter,
    tasksData,
    refetch,
    setActiveFilter,
  };
};