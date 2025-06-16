"use client";
import { useEffect, useRef, useState } from "react";
import Gantt from "frappe-gantt";
import DropdownMenu from "@/components/Dropdown";
import "./styles/frappe-gantt.css";
import { ISubtaskScheduler } from "@/app/models/ISubtasks";
import { useSchedule } from "@/app/features/schedule/hooks/useSchedule";
import { ITask } from "@/app/models/ITasks";
import TaskDetailsModal from "@/components/Schedule/GanttModal";

export default function GanttChart({ subtasks }: { subtasks: ISubtaskScheduler[]; }) {
  const ganttRef = useRef<HTMLDivElement | null>(null);
  const [viewMode, setViewMode] = useState<"Day" | "Week" | "Month">("Day");
  const [selectedSubtask, setSelectedSubtask] = useState<ISubtaskScheduler | null>(null);
  const [taskDetails, setTaskDetails] = useState<ITask | undefined>(undefined);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const { getTaskDetails } = useSchedule();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  /**
   * Hook para inicializar el gráfico de Gantt y manejar la lógica de interacción.
   * Este hook se ejecuta cuando el componente se monta o cuando cambian las dependencias.
   */
  useEffect(() => {
    if (!ganttRef.current) return;

    ganttRef.current.innerHTML = "";

    const ganttChart = new Gantt(ganttRef.current, subtasks, {
      view_mode: viewMode,
      language: "es",
      container_height: screen.availHeight,
      readonly: true,
      arrow_curve: 0.5,
      today_button: true,
      on_click: async (task) => {
        const subtask = subtasks.find(s => s.id === task.id);
        
        if (subtask) {
          const taskElement = ganttRef.current?.querySelector(`.bar-wrapper[data-id="${task.id}"]`);
          if (taskElement) {
            const rect = taskElement.getBoundingClientRect();
            setPopupPosition({ 
              x: rect.left + window.scrollX + rect.width / 2, 
              y: rect.top + window.scrollY 
            });
          }
          
          setSelectedSubtask(subtask);
          setIsModalOpen(true);
          setIsLoading(true); 
          
          try {
            const details = await getTaskDetails(subtask.taskId);
            setTaskDetails(details);
          } catch (error) {
            console.error("Error al obtener los detalles de la tarea:", error);
          } finally {
            setIsLoading(false); 
          }
        } else {
          setSelectedSubtask(null);
          setTaskDetails(undefined);
        }
      }
    });

    if (ganttRef.current) {
      const style = document.createElement('style');
      style.innerHTML = `
        .gantt-container .popup-wrapper {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      if (ganttRef.current) {
        ganttRef.current.innerHTML = "";
      }
    };
  }, [viewMode, subtasks, getTaskDetails]);

  const closePopup = () => {
    setSelectedSubtask(null);
    setTaskDetails(undefined);
    setIsModalOpen(false);
    setIsLoading(false); 
  };

  return (
    <div className="h-fit w-full relative">
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
      <TaskDetailsModal
        isOpen={isModalOpen}
        onClose={closePopup}
        selectedSubtask={selectedSubtask}
        taskDetails={taskDetails}
        isLoading={isLoading} 
      />
    </div>
  );
}