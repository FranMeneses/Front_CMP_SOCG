import { useState, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_TASK } from "@/app/api/tasks";
import { GET_SUBTASKS } from "@/app/api/subtasks";
import { ISubtask } from "@/app/models/ISubtasks";
import { ValleyColors, Valleys } from "@/constants/valleys";
import { Faenas } from "@/constants/faenas";

export function useReportability() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>("Transversal");
  const [calendarView, setCalendarView] = useState<string>("dayGridMonth");
  const [Subtasks, setSubtasks] = useState<ISubtask[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const { data, loading, error } = useQuery(GET_SUBTASKS);
  const [getTask] = useLazyQuery(GET_TASK);

  // PEDIR AL FRANCISCO QUE AGREGUE VALLE A LA SUBTAREA


  useEffect(() => {
    if (data?.subtasks) {
      setSubtasks(data.subtasks);
    } else if (error) {
      console.error("Error fetching subtasks:", error);
    }
  }, [data, error]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCalendarView("listWeek");
      } else {
        setCalendarView("dayGridMonth");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleGetColor = (valleyId: number) => {
    switch (valleyId) {
      case 1:
        return ValleyColors[0];
      case 2:
        return ValleyColors[1];
      case 3:
        return ValleyColors[2];
      case 4:
        return ValleyColors[3];
      default:
        return "#000000";
    }
  };

  const handleGetValley = (valleyId: number) => {
    switch (valleyId) {
      case 1:
        return Valleys[0];
      case 2:
        return Valleys[1];
      case 3:
        return Valleys[2];
      case 4:
        return Valleys[3];
      default:
        return "Valle desconocido";
    }
  };

  const handleGetFaena = (faenaId: number) => {
    switch (faenaId) {
      case 1:
        return Faenas[0];
      case 2:
        return Faenas[1];
      case 3:
        return Faenas[2];
      case 4:
        return Faenas[3];
      case 5:
        return Faenas[4];
      case 6:
        return Faenas[5];
      case 7:
        return Faenas[6];
      case 8:
        return Faenas[7];
      case 9:
        return Faenas[8];
      case 10:
        return Faenas[9];
      default:
        return "Faena desconocida";
    }
  };

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      const events = await Promise.all(
        Subtasks.map(async (subtask) => {
          try {
            const { data } = await getTask({
              variables: { id: subtask.taskId },
            });
            const task = data?.task;
  
            const endDate = new Date(subtask.endDate);
            endDate.setDate(endDate.getDate() + 1);
  
            return {
              title: subtask.name,
              start: endDate.toISOString(),
              end: endDate.toISOString(),
              progress: subtask.status.percentage,
              valley: handleGetValley(task?.valleyId ?? 5),
              faena: handleGetFaena(task?.faenaId ?? 11),
              color: handleGetColor(task?.valleyId ?? 5),
              allDay: true,
            };
          } catch (err) {
            console.error("Error fetching task:", err);
            return null;
          }
        })
      );
      setCalendarEvents(events.filter((event) => event !== null));
    };
  
    if (Subtasks.length > 0) {
      fetchCalendarEvents();
    }
  }, [Subtasks, getTask]);

  return {
    data,
    loading,
    isSidebarOpen,
    toggleSidebar,
    selectedItem,
    setSelectedItem,
    calendarView,
    calendarEvents,
  };
}