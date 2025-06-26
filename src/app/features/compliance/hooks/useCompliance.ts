import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client";
import { ITask } from "@/app/models/ITasks";
import { useComplianceData } from "./useComplianceData";
import { useComplianceForm } from "./useComplianceForm";
import { IComplianceForm } from "@/app/models/ICompliance";
import { UPDATE_COMPLIANCE, UPDATE_REGISTRY } from "@/app/api/compliance";
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
    const [updateRegistry] = useMutation(UPDATE_REGISTRY);
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
    const handleUpdateCompliance = async (compliance: IComplianceForm) => {
        if (compliance.statusId === 6) {
            try {
                await updateRegistry({
                    variables: {
                        id: compliance.registryId,
                        input: {
                            carta: (compliance.cartaAporte) ? compliance.cartaAporte : undefined,
                            minuta: (compliance.minuta) ? compliance.minuta : undefined,
                            hem: (compliance.hasHem || compliance.hasHes) ? compliance.hasHem : undefined,
                            hes: (compliance.hasHem || compliance.hasHes) ? compliance.hasHes : undefined,
                            provider: (compliance.provider) ? compliance.provider : undefined,
                            es_solped: (compliance.hasSolped || compliance.hasMemo) ? compliance.hasSolped : undefined,
                            es_memo: (compliance.hasSolped || compliance.hasMemo) ? compliance.hasMemo : undefined,
                            endDate: (compliance.endDate) ? compliance.endDate : undefined,
                            solpedMemoSap: (compliance.hasSolped || compliance.hasMemo) ? compliance.solpedMemoSap : undefined,
                            hesHemSap: (compliance.hasHem || compliance.hasHes) ? compliance.hesHemSap : undefined,
                        }
                    }
                })
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
                try {
                    await updateTask({
                        variables: {
                            id: selectedCompliance?.task.id,
                            input: {
                                statusId: (selectedCompliance?.task?.statusId ?? 0) + 1,
                            }
                        }})
                }
                catch (error) {
                    console.error("Error updating task status:", error);
                }
            }
            catch (error) {
                console.error("Error updating registry task:", error);
            }
        }
        else {
            try {
                await updateRegistry({
                    variables: {
                        id: compliance.registryId,
                        input: {
                            carta: (compliance.cartaAporte) ? compliance.cartaAporte : undefined,
                            minuta: (compliance.minuta) ? compliance.minuta : undefined,
                            hem: (compliance.hasHem || compliance.hasHes) ? compliance.hasHem : undefined,
                            hes: (compliance.hasHem || compliance.hasHes) ? compliance.hasHes : undefined,
                            provider: (compliance.provider) ? compliance.provider : undefined,
                            es_solped: (compliance.hasSolped || compliance.hasMemo) ? compliance.hasSolped : undefined,
                            es_memo: (compliance.hasSolped || compliance.hasMemo) ? compliance.hasMemo : undefined,
                            endDate: (compliance.endDate) ? compliance.endDate : undefined,
                            solpedMemoSap: (compliance.hasSolped || compliance.hasMemo) ? compliance.solpedMemoSap : undefined,
                            hesHemSap: (compliance.hasHem || compliance.hasHes) ? compliance.hesHemSap : undefined,
                        }
                    }
                })
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
            catch (error) {
                console.error("Error updating registry task:", error);
            }
        }
        refetch();
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
                const taskInfo = await complianceForm.handleGetCompliance(complianceId);
                try {
                    const taskRegistry = await complianceForm.handleGetRegistry(taskInfo.id);
                    if (taskRegistry) {
                        const complianceWithRegistry: IComplianceForm = {
                            ...taskInfo,
                            cartaAporte: taskRegistry[0].cartaAporte || "",
                            minuta: taskRegistry[0].minuta || "",
                            hasMemo: taskRegistry[0].es_memo || false,
                            hasSolped: taskRegistry[0].es_solped || false,
                            hasHem: taskRegistry[0].hem || false,
                            hasHes: taskRegistry[0].hes || false,
                            provider: taskRegistry[0].provider || "",
                            hesHemSap: taskRegistry[0].hesHemSap || 0,
                            solpedMemoSap: taskRegistry[0].solpedMemoSap || 0,
                        };
                        setSelectedCompliance(complianceWithRegistry);
                        setIsComplianceModalOpen(true);
                    }
                }
                catch (error) {
                    console.error("Error fetching compliance registry:", error);
                }
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