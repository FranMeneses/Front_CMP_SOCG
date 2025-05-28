import { IEvent } from "@/app/models/ICalendar";
import { IValley } from "@/app/models/IValleys";
import { useTaskResume } from "../hooks/useTaskResume";
import { useEffect, useState } from "react";

interface TaskResumeProps {
    calendarEvents: IEvent[];
    valleys: IValley[];
    valleyNames: string[];
    ValleyColors: string[];
    month: string;
    year: number;
}

export default function TaskResume({ 
    calendarEvents, 
    valleys, 
    valleyNames, 
    ValleyColors, 
    month, 
    year 
}: TaskResumeProps) {
    
    const { handleGetSubtasksByMonthYearAndValley, handleGetTotalSubtasksByMonthYear } = useTaskResume();
    const [valleySubtasks, setValleySubtasks] = useState<Record<string, number>>({});
    const [totalSubtasks, setTotalSubtasks] = useState<number>();

    useEffect(() => {
        const loadSubtasks = async () => {
            if (!month || !year || !valleys?.length) return;
            
            const subtasksData: Record<string, number> = {};
            
            for (const valley of valleys) {
                try {
                    const count = await handleGetSubtasksByMonthYearAndValley(month, valley.id, year);
                    subtasksData[valley.id] = count || 0;
                } catch (error) {
                    console.error(`Error loading subtasks for valley ${valley.id}:`, error);
                    subtasksData[valley.id] = 0;
                }
            }
            
            setValleySubtasks(subtasksData);
            
            try {
                const total = await handleGetTotalSubtasksByMonthYear(month, year, valleys);
                setTotalSubtasks(total);
            } catch (error) {
                console.error("Error loading total subtasks:", error);
                setTotalSubtasks(0);
            }
        };

        loadSubtasks();
    }, [month, year, valleys, handleGetSubtasksByMonthYearAndValley, handleGetTotalSubtasksByMonthYear]);

    return (
        <div className="mt-4 border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Resumen de tareas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded shadow-sm border p-3">
                    <p className="text-sm text-gray-500">Tareas planeadas</p>
                    <p className="text-2xl font-bold">{calendarEvents?.length || 0}</p> 
                </div>
                <div className="border p-3 rounded shadow-sm">
                    <p className="text-sm text-gray-500">Distribución por valle</p>
                    <div className="text-sm mt-1">
                        {valleys && valleyNames.map((valley) => {
                            const valleyEvents = calendarEvents?.filter(event => 
                            event.valley === valley
                        ).length || 0;
                        return (
                            <div key={valley} className="flex justify-between items-center mt-1">
                                <span className="flex items-center">
                                    <span 
                                        className="inline-block w-3 h-3 rounded-full mr-2" 
                                            style={{backgroundColor: ValleyColors[valleyNames.indexOf(valley)] || '#888'}}
                                        ></span>
                                        {valley}:
                                    </span>
                                <span className="font-medium">{valleyEvents}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <h2 className="col-span-2 text-lg font-medium mt-3 mb-2">Resumen de tareas por mes</h2>
                
                <div className="rounded shadow-sm border p-3">
                    <p className="text-sm text-gray-500">Tareas planeadas por mes</p>
                    <p className="text-2xl font-bold">{totalSubtasks}</p>
                </div>
                <div className="border p-3 rounded shadow-sm">
                    <p className="text-sm text-gray-500">Distribución por valle</p>
                    <div className="text-sm mt-1">
                        {valleys.map((valley) => {
                            const valleyEvents = valleySubtasks[valley.id] ?? 0;
                            return (
                                <div key={valley.id} className="flex justify-between items-center mt-1">
                                    <span className="flex items-center">
                                        <span 
                                            className="inline-block w-3 h-3 rounded-full mr-2" 
                                            style={{backgroundColor: ValleyColors[valley.id - 1] || '#888'}}
                                        ></span>
                                        {valley.name}:
                                    </span>
                                    <span className="font-medium">{valleyEvents}</span> 
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}