"use client";
import { useEffect, useRef, useState } from "react";
import Gantt from "frappe-gantt";
import DropdownMenu from "@/components/Dropdown";
import "./styles/frappe-gantt.css";

export default function GanttChart() {
  const ganttRef = useRef<HTMLDivElement | null>(null);
  const [viewMode, setViewMode] = useState<"Day" | "Week" | "Month">("Day");

  useEffect(() => {
    if (!ganttRef.current) return;

    ganttRef.current.innerHTML = "";

    const getColor = (percentage: number) => {
      if (percentage === 100) return 'rgba(84, 184, 126, 0.5)';
      if (percentage > 30 && percentage < 100) return 'rgba(230, 183, 55, 0.5)'; 
      return 'rgba(230, 76, 55, 0.5)'; 
    };

    const tasks = [
      {
        id: "Task 1",
        name: "Diseño UI",
        start: "2025-04-10",
        end: "2025-04-17",
        progress: 100,
        dependencies: "",
        color:getColor(100),
        color_progress: "rgba(84, 184, 126, 0.5)",
      },
      {
        id: "Task 2",
        name: "API Backend",
        start: "2025-04-18",
        end: "2025-04-25",
        progress: 70,
        dependencies: "Task 1",
        color: getColor(70), 
        color_progress: "rgba(230, 183, 55, 0.5)",
      },
      {
        id: "Task 3",
        name: "Integración",
        start: "2025-04-26",
        end: "2025-05-05",
        progress: 0,
        dependencies: "Task 2",
        color: getColor(0), 
        color_progress: "rgba(230, 76, 55, 0.5)",
      },
    ];

    const gantt = new Gantt(ganttRef.current, tasks, {
      view_mode: viewMode,
      language: "es",
      container_height: screen.availHeight,
      readonly: true,
      arrow_curve: 0.5,
      scroll_to: "today",
      today_button: true,
    });

    return () => {
      if (ganttRef.current) {
        ganttRef.current.innerHTML = "";
      }
    };
  }, [viewMode]);


  return (
    <div className="h-fit w-full">
      <div className="mb-4 flex justify-between">
        <DropdownMenu
          buttonText="Día"
          items={["Día", "Semana", "Mes"]}
          onSelect={(item: string) => {
            if (item === "Día") setViewMode("Day");
            else if (item === "Semana") setViewMode("Week");
            else if (item === "Mes") setViewMode("Month");
          }}
        />
      </div>
      <div
        ref={ganttRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}