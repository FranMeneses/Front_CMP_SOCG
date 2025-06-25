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
    const ganttInstance = useRef<Gantt | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [selectedSubtask, setSelectedSubtask] = useState<ISubtaskScheduler | null>(null);
    const [taskDetails, setTaskDetails] = useState<ITask | undefined>(undefined);
    const [, setPopupPosition] = useState({ x: 0, y: 0 });
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
            console.error('No se encontró contenedor de scroll o no hay subtasks');
            return;
          }

          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          // Enfoque 1: Buscar marcador visual del día actual
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
            
            return;
          }

          // Enfoque 2: Buscar visualmente las barras de tareas y encontrar la fecha más cercana a hoy
          const allBarElements = ganttRef.current?.querySelectorAll('.bar-wrapper') || [];
          if (allBarElements.length > 0) {
            try {
              // Intentar encontrar la barra más cercana a la fecha actual
              const todayTime = today.getTime();
              let closestBar: HTMLElement | null = null;
              let minDistance = Infinity;

              for (const barElement of allBarElements) {
                const taskId = barElement.getAttribute('data-id');
                if (!taskId) continue;

                const subtask = subtasks.find(s => s.id === taskId);
                if (!subtask) continue;

                const startDate = new Date(subtask.start);
                const endDate = new Date(subtask.end);
                
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) continue;
                
                // Si la fecha actual está dentro del rango de la tarea, esta es la mejor candidata
                if (todayTime >= startDate.getTime() && todayTime <= endDate.getTime()) {
                  closestBar = barElement as HTMLElement;
                  break;
                }
                
                // Sino, buscamos la tarea con la fecha más cercana a hoy
                const startDistance = Math.abs(startDate.getTime() - todayTime);
                const endDistance = Math.abs(endDate.getTime() - todayTime);
                const minTaskDistance = Math.min(startDistance, endDistance);
                
                if (minTaskDistance < minDistance) {
                  minDistance = minTaskDistance;
                  closestBar = barElement as HTMLElement;
                }
              }

              if (closestBar) {
                const containerRect = targetContainer.getBoundingClientRect();
                const barRect = closestBar.getBoundingClientRect();
                
                const scrollLeft = barRect.left - containerRect.left + targetContainer.scrollLeft - (targetContainer.clientWidth / 2);
                
                targetContainer.scrollTo({
                  left: Math.max(0, scrollLeft),
                  behavior: 'smooth'
                });
                
                return;
              }
            } catch (e) {
              console.error("Error buscando barras cercanas:", e);
            }
          }

          // Enfoque 3: Cálculo ajustado basado en fechas
          try {
            // Validar y filtrar fechas inválidas
            const validSubtasks = subtasks.filter(task => {
              const startDate = new Date(task.start);
              const endDate = new Date(task.end);
              return !isNaN(startDate.getTime()) && !isNaN(endDate.getTime());
            });
            
            if (validSubtasks.length === 0) return;
            
            const allDates = validSubtasks.flatMap(task => [
              new Date(task.start),
              new Date(task.end)
            ]);
            
            const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
            const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
            
            minDate.setHours(0, 0, 0, 0);
            maxDate.setHours(0, 0, 0, 0);
            
            // Si la fecha de hoy está fuera del rango, ubicamos en el extremo más cercano
            if (today < minDate || today > maxDate) {
              const targetScroll = today < minDate ? 0 : targetContainer.scrollWidth - targetContainer.clientWidth;
              targetContainer.scrollTo({
                left: Math.max(0, targetScroll),
                behavior: 'smooth'
              });
              return;
            }
            
            // Buscar la mejor visualización para la fecha actual
            // Primero, encontrar el elemento visual que mejor representa la fecha actual
            let bestMatch = null;
            let minDateDiff = Infinity;
            
            // Elementos que representan fechas en el gráfico (header cells)
            const dateCells = ganttRef.current?.querySelectorAll('.date-header, .lower-text, .upper-text') || [];
            
            for (const cell of dateCells) {
              const dateText = cell.textContent;
              if (!dateText) continue;
              
              // Intentar extraer la fecha del texto
              try {
                // Esto es un ejemplo - ajustar según el formato de fecha mostrado en el gráfico
                const dateParts = dateText.split(/[/-]/);
                if (dateParts.length < 2) continue;
                
                // Crear un objeto de fecha aproximado basado en el texto
                const cellDate = new Date();
                
                // Ajustar según el formato de frappe-gantt (mes/día o día/mes)
                if (dateParts.length >= 2) {
                  cellDate.setMonth(parseInt(dateParts[0]) - 1);  // 0-indexed
                  cellDate.setDate(parseInt(dateParts[1]));
                }
                
                // Si hay año especificado
                if (dateParts.length >= 3) {
                  cellDate.setFullYear(parseInt(dateParts[2]));
                }
                
                const diff = Math.abs(cellDate.getTime() - today.getTime());
                if (diff < minDateDiff) {
                  minDateDiff = diff;
                  bestMatch = cell as HTMLElement;
                }
              } catch (e) {
                throw new Error(`Error al procesar la fecha del texto: "${dateText}" - ${e}`);
              }
            }
            
            // Si encontramos una celda que representa una fecha cercana a hoy
            if (bestMatch) {
              const containerRect = targetContainer.getBoundingClientRect();
              const cellRect = bestMatch.getBoundingClientRect();
              
              const scrollLeft = cellRect.left - containerRect.left + targetContainer.scrollLeft - (targetContainer.clientWidth / 2);
              
              targetContainer.scrollTo({
                left: Math.max(0, scrollLeft),
                behavior: 'smooth'
              });
              return;
            }
            
            // Como último recurso, usar el cálculo matemático (pero más preciso)
            const totalDuration = maxDate.getTime() - minDate.getTime();
            if (totalDuration <= 0) return;
            
            const elapsedDuration = today.getTime() - minDate.getTime();
            const scrollPercentage = elapsedDuration / totalDuration;
            
            // Asegurar que el porcentaje esté entre 0 y 1
            const clampedPercentage = Math.max(0, Math.min(1, scrollPercentage));
            
            // Usar el ancho del contenido interno en lugar del scrollWidth
            const chartWidth = ganttRef.current?.querySelector('.chart')?.scrollWidth || targetContainer.scrollWidth;
            const viewportWidth = targetContainer.clientWidth;
            
            // Ajustar para centrar
            const scrollableWidth = Math.max(0, chartWidth - viewportWidth);
            const targetScroll = scrollableWidth * clampedPercentage;
            
            // Centrar la posición
            const finalPosition = Math.max(0, Math.min(scrollableWidth, targetScroll - (viewportWidth / 2)));
            
            targetContainer.scrollTo({
              left: finalPosition,
              behavior: 'smooth'
            });
          } catch (error) {
            console.error("Error calculando la posición de scroll:", error);
          }
        }, 800); // Aumentar delay para asegurar renderizado completo
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