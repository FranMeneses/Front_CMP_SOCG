import { IEvent } from "@/app/models/ICalendar";
import { useTaskResume } from "../../app/features/reportability/hooks/useTaskResume";
import { useEffect, useState, useCallback } from "react";
import { useHooks } from "../../app/features/hooks/useHooks";
import { IProcess } from "@/app/models/IProcess";
import PieChart from "@/components/Charts/PieChart";

interface TaskResumeProps {
    calendarEvents: IEvent[];
    valleys: IProcess[];
    valleyNames: string[];
    ValleyColors: string[];
    selectedValley: string;
    month: string;
    year: number;
}

export default function TaskResume({ 
    calendarEvents, 
    valleys,
    ValleyColors, 
    month, 
    selectedValley,
    year 
}: TaskResumeProps) {
    
    const { handleGetSubtasksByMonthYearAndProcess, handleGetTotalSubtasksByMonthYear, handleGetSubtasksByProcess, pieChartData } = useTaskResume();
    const { userRole, currentProcess, isManager } = useHooks();
    const [valleySubtasks, setValleySubtasks] = useState<Record<string, number>>({});
    const [totalSubtasks, setTotalSubtasks] = useState<number>(0);
    const [totalValleySubtasks, setTotalValleySubtasks] = useState<Record<string, number>>({});

    const loadSubtasks = useCallback(async () => {
        if (!month || !year || !valleys?.length) return;
        
        const subtasksData: Record<string, number> = {};

        if (userRole === 'Jefe Relacionamiento VH' || userRole === 'Jefe Relacionamiento VC' || userRole === 'Jefe Relacionamiento VE') {
            if (currentProcess?.id) {
                try {
                    const count = await handleGetSubtasksByMonthYearAndProcess(month, Number(currentProcess.id), year);
                    subtasksData[currentProcess.id] = count || 0;
                    setValleySubtasks(subtasksData);
                    setTotalSubtasks(count || 0);
                } catch (error) {
                    console.error(`Error loading subtasks for valley ${currentProcess.id}:`, error);
                    setValleySubtasks({ [currentProcess.id]: 0 });
                    setTotalSubtasks(0);
                }
            } else {
                console.warn("Valley not found for user role:", userRole);
                setValleySubtasks({});
                setTotalSubtasks(0);
            }
        }
        else {
            if (selectedValley === "Transversales") {
                for (const valley of valleys) {
                    try {
                        const count = await handleGetSubtasksByMonthYearAndProcess(month, Number(valley.id), year);
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
            } else {
                const valley = valleys.find((v: IProcess) => v.name === selectedValley);
                const count = valley?.id !== undefined 
                    ? await handleGetSubtasksByMonthYearAndProcess(month, Number(valley.id), year) 
                    : 0;
                
                if (valley?.id !== undefined) {
                    subtasksData[valley.id] = count;
                    setValleySubtasks(subtasksData);
                }
                
                setTotalSubtasks(count);
            }
        }
        
    }, [month, year, valleys, selectedValley, handleGetSubtasksByMonthYearAndProcess, handleGetTotalSubtasksByMonthYear]);

    const loadTotalValleySubtasks = useCallback(async () => {
        if (!valleys?.length) return;
        const result: Record<string, number> = {};
        for (const valley of valleys) {
            try {
                const count = await handleGetSubtasksByProcess(Number(valley.id));
                result[valley.id] = count || 0;
            } catch (error) {
                result[valley.id] = 0;
                console.error("Error al obtener subtareas por proceso", error)
            }
        }
        setTotalValleySubtasks(result);
    }, [valleys]);

    useEffect(() => {
        loadSubtasks();
        loadTotalValleySubtasks();
    }, [loadSubtasks, loadTotalValleySubtasks]);

    return (
    <div className="mt-4 border-t pt-4 font-[Helvetica]">
        {(isManager || userRole === "Encargado Cumplimiento" || userRole === 'Admin') && (
            <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">RESUMEN DE TAREAS</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded shadow-sm border p-3">
                        <p className="text-sm text-gray-500">Tareas planeadas</p>
                        <p className="text-2xl font-bold">{calendarEvents?.length || 0}</p> 
                    </div>
                    <div className="border p-3 rounded shadow-sm">
                        <p className="text-sm text-gray-500">Distribución por valle</p>
                        <div className="text-sm mt-1">
                            {valleys?.filter(valley => valley.name !== "Transversal").map((valley, index) => {
                                const valleyEvents = totalValleySubtasks[valley.id] ?? 0;
                                return (
                                    <div key={valley.id} className="flex justify-between items-center mt-1">
                                        <span className="flex items-center">
                                            <span 
                                                className="inline-block w-3 h-3 rounded-full mr-2" 
                                                style={{backgroundColor: ValleyColors[index] }}
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
        )}
        
        <div>
            <h2 className="text-xl font-bold mb-3">RESUMEN DE TAREAS POR MES</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded shadow-sm border p-3">
                    <p className="text-sm text-gray-500">Tareas planeadas por mes</p>
                    <p className="text-2xl font-bold">{totalSubtasks}</p>
                </div>
                <div className="border p-3 rounded shadow-sm">
                    {(userRole != "Jefe Relacionamiento VH" && userRole != "Jefe Relacionamiento VC" && userRole != "Jefe Relacionamiento VE") ? (
                        <>
                            <p className="text-sm text-gray-500">Distribución por valle</p>
                            <div className="text-sm mt-1">
                                {valleys?.filter(valley => valley.name !== "Transversal").map((valley, index) => {
                                    const valleyEvents = valleySubtasks[valley.id] ?? 0;
                                    return (
                                        <div key={valley.id} className="flex justify-between items-center mt-1">
                                            <span className="flex items-center">
                                                <span
                                                    className="inline-block w-3 h-3 rounded-full mr-2"
                                                    style={{ backgroundColor: ValleyColors[index] }}
                                                ></span>
                                                {valley.name}:
                                            </span>
                                            <span className="font-medium">{valleyEvents}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="w-full overflow-hidden">
                            <h2 className="font-[Helvetica] font-bold text-lg mb-4">AVANCE PLAN DE TRABAJO VALLES</h2>
                            <div className="w-full h-64 max-w-full overflow-hidden">
                                <PieChart 
                                    data={pieChartData} 
                                    selectedLegend={""} 
                                    title="" 
                                    titleSize={16} 
                                    font="Helvetica" 
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
);
};