import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client";
import { ITask } from "@/app/models/ITasks";
import { useComplianceData } from "./useComplianceData";
import { useComplianceForm } from "./useComplianceForm";
import { IComplianceForm, ComplianceFormState } from "@/app/models/ICompliance";
import { UPDATE_COMPLIANCE } from "@/app/api/compliance";
import { UPDATE_TASK } from "@/app/api/tasks";

export const useCompliance = () => {
    
    const [isComplianceModalOpen, setIsComplianceModalOpen] = useState<boolean>(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<ITask | undefined>(undefined);
    const [selectedCompliance, setSelectedCompliance] = useState<IComplianceForm | undefined>(undefined);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [expandedRow, setExpandedRow] = useState<string>('');
    
    const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
    const [isDeleteSubtaskModalOpen, setIsDeleteSubtaskModalOpen] = useState(false);
    const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('Todos');

    const dummyTask = () => {}; 

    const complianceForm = useComplianceForm(dummyTask);
   
    const {
        data,
        loading,
        error,
        activeFilter,
        refetch,
    } = useComplianceData();
    
    const [updateCompliance] = useMutation(UPDATE_COMPLIANCE);
    const [updateTask] = useMutation(UPDATE_TASK);

    /**
     * Función para manejar la creación de una nueva tarea
     * @description Abre el modal para crear una nueva tarea, dependiendo del rol del usuario
     */
    const handleCreateTask = () => {
        setIsComplianceModalOpen(true);
    };

    /**
     * Función para actualizar el cumplimiento de una tarea
     * @description Actualiza el cumplimiento de una tarea existente
     * @param compliance Cumplimiento de la tarea a actualizar
     */
    const handleUpdateCompliance = async (compliance: ComplianceFormState) => {
        if (compliance.statusId === 13) {
            try {
                await updateCompliance({
                        variables: {
                            id: selectedCompliance?.id,
                            input: {
                                taskId: selectedCompliance?.task.id,
                                listo: true,
                                hesHemSap: compliance.hesHemSap
                            }
                        }
                    })
            }catch (error) {
                console.error("❌ Error updating compliance", error);
            }
            
            try {
                await updateTask({
                    variables: {
                        id: selectedCompliance?.task.id,
                        input: {
                            statusId: (selectedCompliance?.task?.statusId ?? 0) + 1,
                        }
                    }
                })
            }
            catch (error) {
                console.error("❌ Error updating task status:", error);
                console.error("❌ Detalles del error:", error instanceof Error ? error.message : String(error));
            }
        }
        else if (compliance.statusId === 12) {
            try {
                await updateCompliance({
                    variables: {
                        id: selectedCompliance?.id,
                        input: {
                            taskId: selectedCompliance?.task.id,
                            statusId: compliance.statusId,
                            valor: compliance.memoAmount,
                            solpedMemoSap: compliance.solpedMemoSap,
                            ceco: compliance.solpedCECO,
                            cuenta: compliance.solpedAccount,
                        }
                    }
                })
            } catch (error) {
                console.error("Error updating compliance (estado 11)", error);
            }
        }
        else {
            try {
                await updateCompliance({
                    variables: {
                        id: selectedCompliance?.id,
                        input: {
                            taskId: selectedCompliance?.task.id,
                            statusId: compliance.statusId,
                        }
                    }
                })
            }catch (error) {
                console.error("Error updating compliance", error);
            }
        }
        await refetch();
        setIsComplianceModalOpen(false);
    }

    /**
     * Función para manejar la cancelación del modal de cumplimiento
     * @description Cierra el modal de cumplimiento y limpia la tarea seleccionada
     */
    const handleCancelCompliance = () => {
        setSelectedTask(undefined);
        setIsComplianceModalOpen(false);
    };


    /**
     * Función para manejar el clic en una tarea
     * @description Alterna la selección y expansión de una tarea al hacer clic en ella
     * @param taskId ID de la tarea a manejar
     */
    const handleOnTaskClick = (taskId: string) => {
        setSelectedTaskId((prev) => (prev === taskId ? null : taskId));
        setExpandedRow((prev) => (prev === taskId ? '' : taskId));
    };

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    /**
     * Función para ver información de una tarea
     * @description Abre un modal para ver información detallada de una tarea
     * @param taskId ID del compliance
     * @param userRole Rol del usuario
     */
    const handleSeeInformation = async (complianceId: string ) => {
        setSelectedTaskId(complianceId);
        try {
            const complianceInfo = await complianceForm.handleGetCompliance(complianceId);
            setSelectedCompliance(complianceInfo);
            setIsComplianceModalOpen(true);
        }
        catch (error) {
            console.error("Error fetching task information:", error);
        }
    };

    /**
     * Función para manejar los filtros de estado
     * @description Filtra los datos de cumplimiento según el estado seleccionado
     */
    const filteredCompliance = useMemo(() => {
        if (selectedStatusFilter === '' || selectedStatusFilter === 'Todos') {
            return data;
        }
        
        return data.filter(compliance => {
            const status = compliance.status?.name || "NO iniciado";
            return status === selectedStatusFilter;
        });
    }, [data, selectedStatusFilter]);

    /**
     * Función para manejar el cambio de filtro de estado
     * @description Actualiza el estado del filtro seleccionado
     * @param status Estado seleccionado
     */
    const handleStatusFilterChange = (status: string) => {
        setSelectedStatusFilter(status);
    };


    return {
        setIsComplianceModalOpen,
        setSelectedTaskId,
        setSelectedTask,
        setSelectedCompliance,
        setIsSidebarOpen,
        setIsDeleteSubtaskModalOpen,
        setIsDeleteTaskModalOpen,
        setItemToDeleteId,
        handleOnTaskClick,
        toggleSidebar,
        handleSeeInformation,
        handleCreateTask,
        handleUpdateCompliance,
        handleCancelCompliance,
        handleStatusFilterChange,
        selectedTask,
        selectedCompliance,
        isDeleteSubtaskModalOpen,
        isDeleteTaskModalOpen,
        isComplianceModalOpen,
        itemToDeleteId,
        selectedTaskId,
        isSidebarOpen,
        data,
        loading, 
        error,
        expandedRow,
        activeFilter,
        selectedStatusFilter,
        filteredCompliance,
    };
};