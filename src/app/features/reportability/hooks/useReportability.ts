import { useState, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_TASK } from "@/app/api/tasks";
import { GET_SUBTASKS, GET_VALLEY_SUBTASKS } from "@/app/api/subtasks";
import { ISubtask } from "@/app/models/ISubtasks";
import { ValleyColors } from "@/constants/valleys";
import { useData } from "@/context/DataContext";
import { IEvent } from "@/app/models/ICalendar";
import { IValley } from "@/app/models/IValleys";
import { IFaena } from "@/app/models/IFaena";

export function useReportability() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>("Transversal");
  const [calendarView, setCalendarView] = useState<string>("dayGridMonth");
  const [Subtasks, setSubtasks] = useState<ISubtask[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<IEvent[]>([]); 
  const { data, loading: subtasksLoading, error } = useQuery(GET_SUBTASKS);
  const [getTask, { loading: taskLoading }] = useLazyQuery(GET_TASK);
  const [GetValleySubtasks, { loading: valleySubtasksLoading }] = useLazyQuery(GET_VALLEY_SUBTASKS);
  const [eventsLoading, setEventsLoading] = useState(true);

  const { valleys, faenas } = useData();

  /**
   * Hook para manejar la carga de subtareas y eventos del calendario.
   * @description Este hook se encarga de cargar las subtareas y los eventos del calendario, así como de manejar el estado del sidebar y la vista del calendario.
   */
  useEffect(() => {
    if (data?.subtasks) {
      setSubtasks(data.subtasks);
    } else if (error) {
      console.error("Error fetching subtasks:", error);
    }
  }, [data, error]);

  /**
   * Hook para manejar el cambio de vista del calendario según el tamaño de la ventana.
   * @description Este hook ajusta la vista del calendario a "listWeek" en pantallas pequeñas y a "dayGridMonth" en pantallas grandes.
   */
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

  /**
   * Función para obtener el color del valle según su ID.
   * @description Utiliza un switch para devolver el color correspondiente al valle basado en su ID.
   * @param valleyId ID del valle para obtener su color.
   * @returns 
   */
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

  /**
   * Función para obtener el nombre del valle según su ID.
   * @description Busca en el array de valles el nombre correspondiente al ID proporcionado.
   * @param valleyId ID del valle para obtener su nombre.
   * @returns 
   */
  const handleGetValley = (valleyId: number) => {
    const valley = valleys.find((v: IValley) => v.id === valleyId);
    return valley ? valley.name : "Valle desconocido";
  };

  /**
   * Función para obtener el nombre de la faena según su ID.
   * @description Busca en el array de faenas el nombre correspondiente al ID proporcionado.
   * @param faenaId ID de la faena para obtener su nombre.
   * @returns 
   */
  const handleGetFaena = (faenaId: number) => {
    const faena = faenas.find((f: IFaena) => f.id === faenaId);
    return faena ? faena.name : "Faena desconocida";
  };

  /**
   * Función para obtener los eventos del calendario de las subtareas.
   * @description Realiza una consulta para cada subtarea, obteniendo los detalles de la tarea asociada y formateando los eventos del calendario.
   * @param subtasks Subtareas a las que se les desea obtener los eventos del calendario.
   */
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
              progress: String(subtask.status.percentage),
              taskId: subtask.taskId,
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
  
  /**
   * Hook para cargar los eventos del calendario al cambiar las subtareas.
   * @description Este efecto se ejecuta cada vez que las subtareas cambian, llamando a la función fetchCalendarEvents para actualizar los eventos del calendario.
   */
  useEffect(() => {
    if (Subtasks.length > 0) {
      fetchCalendarEvents(Subtasks);
    } else {
      setEventsLoading(false);
    }
  }, [Subtasks, getTask]);
  
  /**
   * Función para manejar la selección de un valle o subtarea en el dropdown.
   * @description Actualiza el estado del item seleccionado y obtiene las subtareas correspondientes al valle o subtarea seleccionada, así como los eventos del calendario.
   * @param item Nombre del valle o subtarea seleccionada en el dropdown.
   */
  const handleDropdownSelect = async (item: string) => {
    setSelectedItem(item);
  
    if (item === "Transversal") {
      setSubtasks(data?.subtasks || []);
      await fetchCalendarEvents(data?.subtasks || []); 
    } else {
      const valley = valleys.find((v: IValley) => v.name === item);
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

  /**
   * Hook para manejar la carga de subtareas del valle seleccionado.
   * @description Este efecto se ejecuta cada vez que el valle seleccionado cambia, obteniendo las subtareas correspondientes y actualizando los eventos del calendario.
   */
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