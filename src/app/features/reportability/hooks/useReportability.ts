import { useState, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_TASK } from "@/app/api/tasks";
import { GET_SUBTASKS, GET_VALLEY_SUBTASKS } from "@/app/api/subtasks";
import { ISubtask } from "@/app/models/ISubtasks";
import { ValleyColors } from "@/constants/valleys";
import { useData } from "@/context/DataContext";

export function useReportability() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>("Transversal");
  const [calendarView, setCalendarView] = useState<string>("dayGridMonth");
  const [Subtasks, setSubtasks] = useState<ISubtask[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]); //TODO: Define the type for calendarEvents
  const { data, loading: subtasksLoading, error } = useQuery(GET_SUBTASKS);
  const [getTask, { loading: taskLoading }] = useLazyQuery(GET_TASK);
  const [GetValleySubtasks, { loading: valleySubtasksLoading }] = useLazyQuery(GET_VALLEY_SUBTASKS);
  const [eventsLoading, setEventsLoading] = useState(true);

  const { valleys, faenas } = useData();

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
    const valley = valleys.find((v: any) => v.id === valleyId);
    return valley ? valley.name : "Valle desconocido";
  };

  const handleGetFaena = (faenaId: number) => {
    const faena = faenas.find((f: any) => f.id === faenaId);
    return faena ? faena.name : "Faena desconocida";
  };

  const fetchCalendarEvents = async (subtasks: ISubtask[]) => {
    setEventsLoading(true);
    try {
      const events = await Promise.all(
        subtasks.map(async (subtask) => {
          try {
            const { data } = await getTask({
              variables: { id: subtask.taskId },
            });
            const task = data?.task;
    
            return {
              title: subtask.name,
              start: subtask.endDate,
              end: subtask.endDate,
              startDate: subtask.startDate,
              progress: subtask.status.percentage,
              status: subtask.status.name,
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
    } catch (error) {
      console.error("Error fetching calendar events:", error);
    } finally {
      setEventsLoading(false);
    }
  };
  
  useEffect(() => {
    if (Subtasks.length > 0) {
      fetchCalendarEvents(Subtasks);
      console.log(calendarEvents);
    } else {
      setEventsLoading(false);
    }
  }, [Subtasks, getTask]);
  
  const handleDropdownSelect = async (item: string) => {
    setSelectedItem(item);
  
    if (item === "Transversal") {
      setSubtasks(data?.subtasks || []);
      await fetchCalendarEvents(data?.subtasks || []); 
    } else {
      const valley = valleys.find((v: any) => v.name === item);
      const valleyId = valley ? valley.id : 0;
      
      try {
        const { data: valleyData } = await GetValleySubtasks({ variables: { valleyId } });
        const valleySubtasks = valleyData?.valleySubtasks || [];
        setSubtasks(valleySubtasks);
        await fetchCalendarEvents(valleySubtasks); 
      } 
      catch (error) {
        console.error("Error fetching valley subtasks:", error);
      }
    }
  };

  const loading = subtasksLoading || taskLoading || valleySubtasksLoading || eventsLoading;

  return {
    toggleSidebar,
    handleDropdownSelect,
    data,
    loading,
    isSidebarOpen,
    selectedItem,
    calendarView,
    calendarEvents,
  };
}