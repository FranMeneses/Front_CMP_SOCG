"use client";
import { useEffect, useRef, useState } from "react";
import Gantt from "frappe-gantt";
import "./styles/frappe-gantt.css";
import { ISubtaskScheduler } from "@/app/models/ISubtasks";
import { useSchedule } from "@/app/features/schedule/hooks/useSchedule";
import { ITask } from "@/app/models/ITasks";
import TaskDetailsModal from "@/components/Schedule/GanttModal";

interface GanttChartProps {
  subtasks: ISubtaskScheduler[];
  viewMode: "Day" | "Week" | "Month";
}

  function GanttChart({ subtasks, viewMode }: GanttChartProps) {
    const ganttRef = useRef<HTMLDivElement | null>(null);
    const ganttInstance = useRef<Gantt | null>(null);
    const [selectedSubtask, setSelectedSubtask] = useState<ISubtaskScheduler | null>(null);
    const [taskDetails, setTaskDetails] = useState<ITask | undefined>(undefined);
    const { getTaskDetails } = useSchedule();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      if (!ganttRef.current) return;

      ganttRef.current.innerHTML = "";

      const ganttChart = new Gantt(ganttRef.current, subtasks, {
        view_mode: viewMode,
        language: "es",
        readonly: true,
        arrow_curve: 0.5,
        today_button: true,
        on_click: async (task) => {
          const subtask = subtasks.find(s => s.id === task.id);
          if (subtask) {
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

      ganttInstance.current = ganttChart;

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
        ganttInstance.current = null;
      };
    }, [viewMode, subtasks, getTaskDetails]);

    const closePopup = () => {
      setSelectedSubtask(null);
      setTaskDetails(undefined);
      setIsModalOpen(false);
      setIsLoading(false); 
    };

    return (
      <div className="w-full h-full overflow-auto p-4 relative">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[1000px] relative">
            <div
              ref={ganttRef}
              className="w-full"
            />
          </div>
        </div>
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

GanttChart.displayName = "GanttChart";

export default GanttChart;