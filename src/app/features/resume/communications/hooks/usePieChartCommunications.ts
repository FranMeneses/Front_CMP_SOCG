import { GET_TASKS_BY_PROCESS } from "@/app/api/tasks";
import { CommunicationsColors, CommunicationsColorsHover } from "@/constants/colors";
import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";

export function usePieChartCommunications() {

    const [processesTask, setprocessesTask] = useState<number[]>([0, 0, 0, 0]);
    const [processTask] = useLazyQuery(GET_TASKS_BY_PROCESS);
    

    /**
     * Función para obtener las tareas de Asuntos Públicos.
     * @description Realiza una consulta para obtener las tareas asociadas al proceso de Asuntos Públicos y maneja los datos obtenidos.
     */
    const handlePublicAffairsTasks = async () => {
        try {
            const { data } = await processTask({
                variables: { processId: 6 },
            });
            if (data && Array.isArray(data.tasksByProcess)) {
                setprocessesTask((prevTasks) => {
                    const updatedTasks = [...prevTasks];
                    updatedTasks[2] = data.tasksByProcess.length; 
                    return updatedTasks;
                });
            }
        } catch (error) {
            console.error("Error fetching public affairs tasks:", error);
        }
    }

    /**
     * Función para obtener las tareas de Comunicaciones Externas.
     * @description Realiza una consulta para obtener las tareas asociadas al proceso de Comunicaciones Externas y maneja los datos obtenidos.
     */
    const handleExternalCommunicationsTasks = async () => {
        try {
            const { data } = await processTask({
                variables: { processId: 5 },
            });
            if (data && Array.isArray(data.tasksByProcess)) {
                setprocessesTask((prevTasks) => {
                    const updatedTasks = [...prevTasks];
                    updatedTasks[1] = data.tasksByProcess.length; 
                    return updatedTasks;
                });
            }
        } catch (error) {
            console.error("Error fetching community relations tasks:", error);
        }
    }

    /**
     * Función para obtener las tareas de Comunicaciones Internas.
     * @description Realiza una consulta para obtener las tareas asociadas al proceso de Comunicaciones Internas y maneja los datos obtenidos.
     */
    const handleInternalCommunicationsTasks = async () => {
        try {
            const { data } = await processTask({
                variables: { processId: 4 },
            });
            if (data && Array.isArray(data.tasksByProcess)) {
                setprocessesTask((prevTasks) => {
                    const updatedTasks = [...prevTasks];
                    updatedTasks[0] = data.tasksByProcess.length; 
                    return updatedTasks;
                });
            }
        } catch (error) {
            console.error("Error fetching community relations tasks:", error);
        }
    }

    /**
     * Función para obtener las tareas Transversales.
     * @description Realiza una consulta para obtener las tareas asociadas al proceso Transversal y maneja los datos obtenidos.
     */
    const handleTransversalTasks = async () => {
        try {
            const { data } = await processTask({
                variables: { processId: 7 },
            });
            if (data && Array.isArray(data.tasksByProcess)) {
                setprocessesTask((prevTasks) => {
                    const updatedTasks = [...prevTasks];
                    updatedTasks[3] = data.tasksByProcess.length; 
                    return updatedTasks;
                });
            }
        }
        catch (error) {
            console.error("Error fetching transversal tasks:", error);
        }
    }

    /**
    * Hook para inicializar las tareas de los procesos.
    * @description Este efecto se ejecuta una vez al cargar el componente, llamando a las funciones para manejar las tareas de cada valle.
    */
    useEffect(() => {
        handleInternalCommunicationsTasks();
        handleExternalCommunicationsTasks();
        handlePublicAffairsTasks();
        handleTransversalTasks();
    }, []);

    const pieChartData = {
        labels: ["Comunicaciones Internas", "Comunicaciones Externas","Asuntos Públicos", "Transversales"],
        datasets: [
            {
                data: processesTask,
                id: processesTask,
                backgroundColor: CommunicationsColors,
                hoverBackgroundColor: CommunicationsColorsHover
            },
        ],
    }

    return {
        pieChartData
    };
}