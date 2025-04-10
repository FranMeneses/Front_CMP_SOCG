'use client';
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import LineChart from "@/components/LineChart";
import { tasksMock } from "../../mocks/tasksMock";
import PieChart from "@/components/PieChart";
import BarChart from "@/components/BarChart";
import { barChartDataSummaryMock, chartDataSummaryMock, pieChartDataSummaryMock } from "../../mocks/chartDataSummaryMock";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadinSpinner";

const getColor = (percentage: number) => {
  if (percentage === 100) return 'bg-green-500'; 
  if (percentage > 30 && percentage < 100) return 'bg-yellow-500'; 
  return 'bg-red-500'; 
};


export default function Home() {
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
    <>
      <Header/>
      <div className= "grid flex-1 md:grid-cols-[220px_1fr] text-black bg-white">
        <aside className="hidden border-r md:block h-full">
          <Sidebar />
        </aside>
        <main className="flex-1 p-4">
          <div className="grid grid-cols-2">
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold">
                Resumen
              </h1>
              <div className="min-w-full max-w-full flex-1">
                <LineChart data={chartDataSummaryMock}/>
              </div>
              <div className="flex flex-col gap-4 mt-4 w-full border border-gray-300">
              <h1 className="text-2xl font-bold mt-4 ml-3">
                Tareas
              </h1>
                <table className="table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-start font-bold text-[#7D7D7D]">Código</th>
                      <th className="px-4 py-2 text-center font-bold text-[#7D7D7D]">Dias restantes</th>
                      <th className="px-4 py-2 text-center font-bold text-[#7D7D7D]">Fecha termino</th>
                      <th className="px-4 py-2 text-center font-bold text-[#7D7D7D]">Porcentaje de avance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasksMock.map((task) => (
                      <tr key={task.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b border-gray-300 font-semibold">{task.code}</td>
                        <td className="px-4 py-2 text-center border-b border-gray-300 font-semibold">{task.remainingDays}</td>
                        <td className="px-4 py-2 text-center border-b border-gray-300 font-semibold">{task.endDate}</td>
                        <td className="px-4 py-2 text-center border-b border-gray-300">
                          <div className="flex flex-nowrap items-center text-end">
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
            <div className="grid grid-cols-2 mt-12 ml-12">
              <div className="flex flex-col gap-4">
                <div className="min-w-full max-w-full flex-1">
                  <PieChart data={pieChartDataSummaryMock} />
                </div>
                <div className="w-full h-full mt-8">
                  <BarChart data={barChartDataSummaryMock} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
