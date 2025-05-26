"use client";
import { useEffect, useRef, useState } from "react";
import Gantt from "frappe-gantt";
import DropdownMenu from "@/components/Dropdown";
import "./styles/frappe-gantt.css";
import { ISubtaskScheduler } from "@/app/models/ISubtasks";


export default function GanttChart({ subtasks }: { subtasks: ISubtaskScheduler[]; }) {
  const ganttRef = useRef<HTMLDivElement | null>(null);
  const [viewMode, setViewMode] = useState<"Day" | "Week" | "Month">("Day");

  useEffect(() => {
    if (!ganttRef.current) return;

    ganttRef.current.innerHTML = "";

    const gantt = new Gantt(ganttRef.current, subtasks, {
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
  }, [viewMode, subtasks]);

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