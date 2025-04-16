'use client';
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import LineChart from "@/components/Charts/LineChart";
import { tasksMock } from "../../../mocks/tasksMock";
import PieChart from "@/components/Charts/PieChart";
import BarChart from "@/components/Charts/BarChart";
import { barChartDataSummaryMock, chartDataSummaryMock, pieChartDataSummaryMock } from "../../../mocks/chartDataSummaryMock";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadinSpinner";

const getColor = (percentage: number) => {
  if (percentage === 100) return 'bg-green-500'; 
  if (percentage > 30 && percentage < 100) return 'bg-yellow-500'; 
  return 'bg-red-500'; 
};


export default function Resume() {
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
  
  return (
    <div className="overflow-x-hidden">
      <Header/>
      <div className= "grid flex-1 md:grid-cols-[220px_1fr] text-black bg-white">
        <aside className="hidden border-r md:block h-full">
          <Sidebar />
        </aside>
        <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Resumen</h1>
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-4.5">
              <div className="w-full aspect-w-16 aspect-h-9 mx-auto">
                <LineChart data={chartDataSummaryMock} />
              </div>
              <div className="w-full h-[50%] mx-auto">
                <PieChart data={pieChartDataSummaryMock} />
              </div>
            </div>
            
            <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 w-full border border-gray-300">
                <h1 className="text-2xl font-bold mt-4 ml-3">Tareas</h1>
                <div className="overflow-y-scroll max-h-64">
                  <table className="table-auto w-full">
                    <thead className=" bg-white">
                      <tr className="text-sm">
                        <th className="px-4 py-2 text-start font-bold text-[#7D7D7D]">Código</th>
                        <th className="px-4 py-2 text-center font-bold text-[#7D7D7D]">Dias restantes</th>
                        <th className="px-4 py-2 text-center font-bold text-[#7D7D7D]">Fecha termino</th>
                        <th className="px-4 py-2 text-center font-bold text-[#7D7D7D]">Porcentaje de avance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasksMock.map((task) => (
                        <tr key={task.id} className="hover:bg-gray-50 text-sm">
                          <td className="px-4 py-2 border-b border-gray-300 ">{task.code}</td>
                          <td className="px-4 py-2 text-center border-b border-gray-300 ">{task.remainingDays}</td>
                          <td className="px-4 py-2 text-center border-b border-gray-300 ">{task.endDate}</td>
                          <td className="px-4 py-2 text-center border-b border-gray-300">
                            <div className="flex items-center text-end relative">
                              <div
                                className={`h-4 ${getColor(task.progressPercentage)} rounded`}
                                style={{ width: `${task.progressPercentage}%` }}
                              ></div>
                              <h3 className="absolute text-sm font-medium text-white ml-2">{task.progressPercentage}%</h3>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="w-full aspect-w-16 aspect-h-9 mx-auto">
                <BarChart data={barChartDataSummaryMock} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
