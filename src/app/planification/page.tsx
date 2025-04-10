'use client'
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { ArrowUpFromLine } from 'lucide-react';
import LoadingSpinner from "@/components/LoadinSpinner";
import { useState, useEffect } from "react";

export default function Planification() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false); 
      }, 2000);
  
      return () => clearTimeout(timer);
    }, []);
  
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner/>
        </div>
      );
    }
    
    const handleAddTask = () => {
        console.log("Añadir tarea");
    }  

    return (
        <div className="h-screen w-screen overflow-hidden">
            <Header />
            <div className="grid grid-cols-[220px_1fr] h-full text-black bg-white">
                <aside className="hidden md:block border-r h-full">
                    <Sidebar />
                </aside>
                <main className="p-4 h-full overflow-auto">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-2xl font-bold">Planificación</h1>
                        <div className="flex flex-row">
                            <div className="ml-4 flex-1">
                                <button
                                    className="flex flex-row justify-end items-center p-4 rounded-lg mb-4 cursor-pointer"
                                    onClick={() => {handleAddTask}}
                                >
                                    <ArrowUpFromLine className="text-black" size={24} />
                                    <span className="ml-2">Añadir tarea</span>
                                </button>
                                <div className="overflow-auto w-full border border-gray-300 max-h-3/4">
                                    <table className="table-auto w-full text-sm text-left text-gray-500">
                                        <thead>
                                            <tr className="text-black uppercase text-sm leading-normal">
                                                <th className="py-3 px-6 text-center border-b border-gray-300">Código</th>
                                                <th className="py-3 px-6 text-center border-b border-gray-300">Tarea</th>
                                                <th className="py-3 px-6 text-center border-b border-gray-300">Origen Iniciativa</th>
                                                <th className="py-3 px-6 text-center border-b border-gray-300">Tipo Iniciativa</th>
                                                <th className="py-3 px-6 text-center border-b border-gray-300">Alcance Iniciativa</th>
                                                <th className="py-3 px-6 text-center border-b border-gray-300">Tipo Interacción Operacional</th>
                                                <th className="py-3 px-6 text-center border-b border-gray-300">Tipo Riesgo Operacional</th>
                                                <th className="py-3 px-6 text-center border-b border-gray-300">Compliance</th>
                                                <th className="py-3 px-6 text-center border-b border-gray-300">Prioridad</th>
                                                <th className="py-3 px-6 text-center border-b border-gray-300">Estado</th>
                                                <th className="py-3 px-6 text-center border-b border-gray-300">Asignado</th>
                                                <th className="py-3 px-6 text-center border-b border-gray-300">Presupuesto</th>
                                                <th className="py-3 px-6 text-center border-b border-gray-300">Gasto Real</th>
                                                <th className="py-3 px-6 text-center border-b border-gray-300">GC Presupuesto</th>
                                                <th className="py-3 px-6 text-center border-b border-gray-300">Diferencia</th>
                                                <th className="py-3 px-6 text-center border-b border-gray-300">Mes de Imputación</th>
                                                <th className="py-3 px-6 text-center border-b border-gray-300">Fecha Inicio</th>
                                                <th className="py-3 px-6 text-center border-b border-gray-300">Fecha Finalización</th>
                                                <th className="py-3 px-6 text-center border-b border-gray-300">Dias restantes</th>
                                                <th className="py-3 px-6 text-center border-b border-gray-300">Fecha Termino</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.from({ length: 20 }).map((_, index) => (
                                                <tr key={index} className="text-center border-b border-gray-300">
                                                    <td className="py-3 px-6">Código {index + 1}</td>
                                                    <td className="py-3 px-6">Tarea {index + 1}</td>
                                                    <td className="py-3 px-6">Origen {index + 1}</td>
                                                    <td className="py-3 px-6">Tipo {index + 1}</td>
                                                    <td className="py-3 px-6">Alcance {index + 1}</td>
                                                    <td className="py-3 px-6">Interacción {index + 1}</td>
                                                    <td className="py-3 px-6">Riesgo {index + 1}</td>
                                                    <td className="py-3 px-6">Compliance {index + 1}</td>
                                                    <td className="py-3 px-6">Prioridad {index + 1}</td>
                                                    <td className="py-3 px-6">Estado {index + 1}</td>
                                                    <td className="py-3 px-6">Asignado {index + 1}</td>
                                                    <td className="py-3 px-6">Presupuesto {index + 1}</td>
                                                    <td className="py-3 px-6">Gasto Real {index + 1}</td>
                                                    <td className="py-3 px-6">GC Presupuesto {index + 1}</td>
                                                    <td className="py-3 px-6">Diferencia {index + 1}</td>
                                                    <td className="py-3 px-6">Mes {index + 1}</td>
                                                    <td className="py-3 px-6">Inicio {index + 1}</td>
                                                    <td className="py-3 px-6">Finalización {index + 1}</td>
                                                    <td className="py-3 px-6">Restantes {index + 1}</td>
                                                    <td className="py-3 px-6">Término {index + 1}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}