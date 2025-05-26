'use client'
import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_VALLEY_TASKS_COUNT } from "@/app/api/tasks";
import { ValleyColors, ValleyColorsHover } from "@/constants/valleys";
import { useData } from "@/context/DataContext";

export function usePieChart() {
    const [valleysTasks, setValleysTasks] = useState<number[]>([0, 0, 0, 0]);
    const [valleyTasks] = useLazyQuery(GET_VALLEY_TASKS_COUNT);

    const {valleys} = useData();
    const Valleys = valleys ? valleys.map(valley => valley.name) : [];

    /**
     * Función para manejar las tareas del Valle de Copiapó.
     * @description Realiza una consulta para obtener el número de tareas del valle y actualiza el estado correspondiente.
     */
    const handleCopiapoValleyTasks = async () => {
        try {
            const { data } = await valleyTasks({
                variables: { valleyId: 1 },
            });
            if (data && typeof data.valleyTasksCount === "number") {
                setValleysTasks((prevTasks) => {
                    const updatedTasks = [...prevTasks];
                    updatedTasks[0] = data.valleyTasksCount; 
                    return updatedTasks;
                });
            }
        } catch (error) {
            console.error("Error fetching valley tasks:", error);
        }
    };
    
    /**
     * Función para manejar las tareas del Valle del Huasco.
     * @description Realiza una consulta para obtener el número de tareas del valle y actualiza el estado correspondiente.
     */
    const handleHuascoValleyTasks = async () => {
        try {
            const { data } = await valleyTasks({
                variables: { valleyId: 2 },
            });
            if (data && typeof data.valleyTasksCount === "number") {
                setValleysTasks((prevTasks) => {
                    const updatedTasks = [...prevTasks];
                    updatedTasks[1] = data.valleyTasksCount; 
                    return updatedTasks;
                });
            }
        } catch (error) {
            console.error("Error fetching valley tasks:", error);
        }
    };
    
    /**
     * Función para manejar las tareas del Valle de Elqui.
     * @description Realiza una consulta para obtener el número de tareas del valle y actualiza el estado correspondiente.
     */
    const handleElquiValleyTasks = async () => {
        try {
            const { data } = await valleyTasks({
                variables: { valleyId: 3 },
            });
            if (data && typeof data.valleyTasksCount === "number") {
                setValleysTasks((prevTasks) => {
                    const updatedTasks = [...prevTasks];
                    updatedTasks[2] = data.valleyTasksCount; 
                    return updatedTasks;
                });
            }
        } catch (error) {
            console.error("Error fetching valley tasks:", error);
        }
    };
    
    /**
     * Función para manejar las tareas del Valle Transversal.
     * @description Realiza una consulta para obtener el número de tareas del valle y actualiza el estado correspondiente.
     */
    const handleTransversalValleyTasks = async () => {
        try {
            const { data } = await valleyTasks({
                variables: { valleyId: 4 },
            });
            if (data && typeof data.valleyTasksCount === "number") {
                setValleysTasks((prevTasks) => {
                    const updatedTasks = [...prevTasks];
                    updatedTasks[3] = data.valleyTasksCount; 
                    return updatedTasks;
                });
            }
        } catch (error) {
            console.error("Error fetching valley tasks:", error);
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
        handleTransversalValleyTasks();
    }, []);

    /**
     * Datos para el gráfico de pastel.
     * @description Este objeto contiene las etiquetas y los datos para el gráfico de pastel, incluyendo los colores de fondo y de hover.
     */
    const pieChartData = {
        labels: Valleys,
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