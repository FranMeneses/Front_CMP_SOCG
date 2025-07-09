'use client'
import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_TASKS_BY_PROCESS } from "@/app/api/tasks";
import { ValleyColors, ValleyColorsHover } from "@/constants/colors";
import { useData } from "@/context/DataContext";

export function usePieChart() {
    const [valleysTasks, setValleysTasks] = useState<number[]>([0, 0, 0]);
    const [processTask] = useLazyQuery(GET_TASKS_BY_PROCESS);

    const {valleys} = useData();
    const Valleys = valleys ? valleys.map(valley => valley.name) : [];

    /**
     * Función para manejar las tareas del Valle de Copiapó.
     * @description Realiza una consulta para obtener el número de tareas del valle y actualiza el estado correspondiente.
     * @param {number} processId - ID del proceso para el Valle de Copiapó.
     * @returns {Promise<void>} Retorna una promesa que se resuelve cuando se han obtenido las tareas del valle.
     * @returns {void}
     */
    const handleCopiapoValleyTasks = async () => {
        try {
            const { data } = await processTask({
                variables: { processId: 1 },
            });
            if (data && Array.isArray(data.tasksByProcess)) {
                setValleysTasks((prevTasks) => {
                    const updatedTasks = [...prevTasks];
                    updatedTasks[0] = data.tasksByProcess.length; 
                    return updatedTasks;
                });
            }
        } catch (error) {
            console.error("Error fetching public affairs tasks:", error);
        }
    }
    
    /**
     * Función para manejar las tareas del Valle del Huasco.
     * @description Realiza una consulta para obtener el número de tareas del valle y actualiza el estado correspondiente.
     * @param {number} processId - ID del proceso para el Valle del Huasco.
     * @returns {Promise<void>} Retorna una promesa que se resuelve cuando se han obtenido las tareas del valle.
     * @returns {void}
     */
    const handleHuascoValleyTasks = async () => {
        try {
            const { data } = await processTask({
                variables: { processId: 2 },
            });
            if (data && Array.isArray(data.tasksByProcess)) {
                setValleysTasks((prevTasks) => {
                    const updatedTasks = [...prevTasks];
                    updatedTasks[1] = data.tasksByProcess.length; 
                    return updatedTasks;
                });
            }
        } catch (error) {
            console.error("Error fetching public affairs tasks:", error);
        }
    };
    
    /**
     * Función para manejar las tareas del Valle de Elqui.
     * @description Realiza una consulta para obtener el número de tareas del valle y actualiza el estado correspondiente.
     * @param {number} processId - ID del proceso para el Valle de Elqui.
     * @returns {Promise<void>} Retorna una promesa que se resuelve cuando se han obtenido las tareas del valle.
     * @returns {void}
     */
    const handleElquiValleyTasks = async () => {
        try {
            const { data } = await processTask({
                variables: { processId: 3 },
            });
            if (data && Array.isArray(data.tasksByProcess)) {
                setValleysTasks((prevTasks) => {
                    const updatedTasks = [...prevTasks];
                    updatedTasks[2] = data.tasksByProcess.length; 
                    return updatedTasks;
                });
            }
        } catch (error) {
            console.error("Error fetching public affairs tasks:", error);
        }
    };

    /**
     * Hook para inicializar las tareas de los valles.
     * @description Este efecto se ejecuta una vez al cargar el componente, llamando a las funciones para manejar las tareas de cada valle.
     */
    useEffect(() => {
        handleCopiapoValleyTasks();
        handleHuascoValleyTasks();
        handleElquiValleyTasks();
    }, []);

    const pieChartData = {
        labels: Valleys.filter((valley) => valley !== "Transversal"),
        datasets: [
            {
                data: valleysTasks,
                id: valleysTasks,
                backgroundColor: ValleyColors,
                hoverBackgroundColor: ValleyColorsHover
            },
        ],
    }

    return {
        pieChartData
    };
}