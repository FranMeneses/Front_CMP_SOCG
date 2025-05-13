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

    useEffect(() => {
        handleCopiapoValleyTasks();
        handleHuascoValleyTasks();
        handleElquiValleyTasks();
        handleTransversalValleyTasks();
    }, []);

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