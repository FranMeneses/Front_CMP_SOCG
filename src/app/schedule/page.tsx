'use client'

import GanttChart from "@/components/GanttChart"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { ganttChartDataMock } from "../../../mocks/chartDataSummaryMock"
import { useState } from "react"
import { Modal } from "@/components/TaskModal"

export default function Schedule() {

    return (
        <div className="overflow-x-hidden">
            <Header />
            <div className={`grid flex-1 md:grid-cols-[220px_1fr] text-black bg-white`}>
                <aside className="hidden border-r md:block h-full">
                    <Sidebar />
                </aside>
                <main className="flex-1 p-4">
                    <div>
                        <div className="flex flex-row justify-between">
                            <h1 className="text-2xl font-bold mb-4">Programación de iniciativas</h1>
                        </div>
                        <GanttChart data={ganttChartDataMock} />
                    </div>
                </main>
            </div>
        </div>
    );
}