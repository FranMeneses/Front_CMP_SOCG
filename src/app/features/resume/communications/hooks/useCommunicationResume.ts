import { GET_TASK_SUBTASKS, GET_TASKS_BY_PROCESS } from "@/app/api/tasks";
import { ISubtask } from "@/app/models/ISubtasks";
import { ITask } from "@/app/models/ITasks";
import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";

export function useCommunicationResume() {
    const [isLoadingTaskDetails, setIsLoadingTaskDetails] = useState(false);
    const [budgetLoading, setBudgetLoading] = useState(false);
    const [tasksData, setTasksData] = useState<ITask[]>([]);    
    const [subtasks, setSubtasks] = useState<ISubtask[]>([]);
    const [selectedLegend, setSelectedLegend] = useState<string | null>(null);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    
    
    const [ getTasksByProcess] = useLazyQuery(GET_TASKS_BY_PROCESS);
    const [ getSubtasks, { data: subtasksData, loading: subtasksLoading } ]= useLazyQuery(GET_TASK_SUBTASKS);


    /**
     * Función para manejar el clic en una leyenda del gráfico.
     * @description Cambia la leyenda seleccionada o la deselecciona si ya estaba seleccionada.
     * @param legend Leyenda que se ha hecho clic.
     */
    const handleLegendClick = (legend: string) => {
        setSelectedLegend((prev) => (prev === legend ? null : legend));
    };
    
    /**
     * Función para manejar el clic en una tarea.
     * @description Si la tarea ya está seleccionada, la deselecciona y limpia las subtareas. Si no, selecciona la tarea y obtiene sus subtareas.
     * @param taskId ID de la tarea que se ha hecho clic.
     */
    const handleTaskClick = async (taskId: string) => {
      if (selectedTaskId === taskId) {
            setSelectedTaskId(null);
            setSubtasks([]);
        } else {
            setSelectedTaskId(taskId);
            await handleGetSubtasks(taskId);
        }
    };


    /**
     * Función para obtener las subtareas de una tarea seleccionada.
     * @description Realiza una consulta para obtener las subtareas de la tarea seleccionada por su ID.
     * @param selectedTaskId ID de la tarea seleccionada para obtener sus subtareas.
     */
    const handleGetSubtasks = async (selectedTaskId: string) => {
        try {
            const { data } = await getSubtasks({
                variables: { id: selectedTaskId }, 
            });
            if (data && data.taskSubtasks) {
                setSubtasks(data.taskSubtasks);
            } else {
                console.warn("No subtasks found for task ID:", selectedTaskId);
                setSubtasks([]);
            }
        } catch (error) {
            setSubtasks([]);
            console.error("Error fetching subtasks:", error);
        }
    };

    /**
     * Función para cargar las tareas de los procesos de comunicación.
     * @description Realiza una consulta para obtener las tareas de los procesos de comunicación y las almacena en el estado.
     */
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
    
    /**
     * Hook para cargar las tareas de los procesos de comunicación al montar el componente.
     * @description Utiliza useEffect para cargar las tareas de los procesos de comunicación al montar el componente.
     */
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
    handleLegendClick,
    handleTaskClick,
    isLoadingTaskDetails,
    tasksData,
    selectedTaskId,
    selectedLegend,
    subtasks,
  };
};