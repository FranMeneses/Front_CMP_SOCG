"use client";
import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
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

export interface GanttChartRef {
  scrollToToday: () => void;
}

const GanttChart = forwardRef<GanttChartRef, GanttChartProps>(
  ({ subtasks, viewMode }, ref) => {
    const ganttRef = useRef<HTMLDivElement | null>(null);
    const ganttInstance = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [selectedSubtask, setSelectedSubtask] = useState<ISubtaskScheduler | null>(null);
    const [taskDetails, setTaskDetails] = useState<ITask | undefined>(undefined);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
    const { getTaskDetails } = useSchedule();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useImperativeHandle(ref, () => ({
      scrollToToday: () => {
        setTimeout(() => {
          // Buscar el contenedor de scroll horizontal del Gantt
          const ganttContainer = ganttRef.current?.querySelector('.gantt-container') as HTMLElement;
          const chartArea = ganttRef.current?.querySelector('.chart') as HTMLElement;
          const scrollContainer = containerRef.current?.querySelector('.overflow-x-auto') as HTMLElement;
          
          const targetContainer = ganttContainer || chartArea || scrollContainer || containerRef.current;
          
          if (!targetContainer || subtasks.length === 0) {
            console.log('No se encontró contenedor de scroll o no hay subtasks');
            return;
          }

          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          // Buscar primero si existe un marcador "today" en el Gantt
          const todayMarker = ganttRef.current?.querySelector('.today-highlight, .today, [data-today]') as HTMLElement;
          
          if (todayMarker) {
            // Si encontramos el marcador del día actual, hacer scroll hacia él
            const containerRect = targetContainer.getBoundingClientRect();
            const todayRect = todayMarker.getBoundingClientRect();
            
            const scrollLeft = todayRect.left - containerRect.left + targetContainer.scrollLeft - (targetContainer.clientWidth / 2);
            
            targetContainer.scrollTo({
              left: Math.max(0, scrollLeft),
              behavior: 'smooth'
            });
            
            console.log('Scroll usando marcador today');
            return;
          }

          // Fallback: cálculo manual
          const allDates = subtasks.flatMap(task => [
            new Date(task.start),
            new Date(task.end)
          ]);
          
          const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
          const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
          
          minDate.setHours(0, 0, 0, 0);
          maxDate.setHours(0, 0, 0, 0);
          
          console.log('Rango de fechas:', {
            min: minDate.toDateString(),
            max: maxDate.toDateString(),
            today: today.toDateString()
          });

          // Verificar si today está en el rango
          if (today < minDate || today > maxDate) {
            console.log('Today está fuera del rango del proyecto');
            // Si today está fuera del rango, ir al inicio o final
            const targetScroll = today < minDate ? 0 : targetContainer.scrollWidth - targetContainer.clientWidth;
            targetContainer.scrollTo({
              left: Math.max(0, targetScroll),
              behavior: 'smooth'
            });
            return;
          }

          // Calcular posición usando el rango de fechas del proyecto
          const daysSinceStart = Math.floor((today.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
          const totalProjectDays = Math.floor((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (totalProjectDays === 0) {
            console.log('Proyecto de un solo día');
            return;
          }

          // Calcular porcentaje y posición
          const progressPercentage = daysSinceStart / totalProjectDays;
          const scrollableWidth = targetContainer.scrollWidth - targetContainer.clientWidth;
          const targetScrollPosition = scrollableWidth * progressPercentage;
          
          // Centrar en la vista
          const finalScrollPosition = Math.max(0, targetScrollPosition - (targetContainer.clientWidth / 2));
          
          console.log('Cálculo de scroll:', {
            daysSinceStart,
            totalProjectDays,
            progressPercentage,
            targetScrollPosition,
            finalScrollPosition,
            containerInfo: {
              scrollWidth: targetContainer.scrollWidth,
              clientWidth: targetContainer.clientWidth
            }
          });

          targetContainer.scrollTo({
            left: finalScrollPosition,
            behavior: 'smooth'
          });

        }, 500); // Aumentar delay para asegurar renderizado completo
      }
    }));

    useEffect(() => {
      if (!ganttRef.current) return;

      ganttRef.current.innerHTML = "";

      // Usar una altura más generosa para mostrar todas las tareas
      const baseHeight = 150; // Altura para headers y padding
      const taskHeight = 50;   // Altura por tarea (más generosa)
      const calculatedHeight = baseHeight + (subtasks.length * taskHeight);
      const minHeight = 500;   // Altura mínima más alta
      
      // No limitar la altura máxima, que crezca según el contenido
      const ganttHeight = Math.max(minHeight, calculatedHeight);

      const ganttChart = new Gantt(ganttRef.current, subtasks, {
        view_mode: viewMode,
        language: "es",
        container_height: ganttHeight,
        readonly: true,
        arrow_curve: 0.5,
        today_button: false,
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
      <div className="w-full h-full overflow-auto p-4" ref={containerRef}>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[1500px]">
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
);

GanttChart.displayName = "GanttChart";

export default GanttChart;