import { IEvent } from "@/app/models/ICalendar";
import { IValley } from "@/app/models/IValleys";

export default function TaskResume(calendarEvents: IEvent[], valleys: IValley[], valleyNames: string[], ValleyColors: string[]) {
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
                <p className="text-2xl font-bold">{calendarEvents?.length || 0}</p> {/*TODO: CAMBIAR POR FUNCIÓN CUANDO ESTE DISPONIBLE*/}
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
                            <span className="font-medium">{valleyEvents}</span> {/*TODO: CAMBIAR POR FUNCIÓN CUANDO ESTE DISPONIBLE*/}
                        </div>
                    );
                    })}
                </div>
            </div>
        </div>
    </div>
    )
};