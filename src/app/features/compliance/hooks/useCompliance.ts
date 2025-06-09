import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useHooks } from "../../hooks/useHooks";
import { ITask } from "@/app/models/ITasks";
import { useComplianceData } from "./useComplianceData";
import { ITaskForm } from "@/app/models/ICommunicationsForm";
import { useComplianceForm } from "./useComplianceForm";
import { IComplianceForm } from "@/app/models/ICompliance";
import { CREATE_COMPLIANCE, CREATE_REGISTRY, UPDATE_COMPLIANCE, UPDATE_REGISTRY } from "@/app/api/compliance";

export const useCompliance = () => {
    const { currentValleyId, userRole } = useHooks();
    
    const [isComplianceModalOpen, setIsComplianceModalOpen] = useState<boolean>(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<ITask | undefined>(undefined);
    const [selectedCompliance, setSelectedCompliance] = useState<IComplianceForm | undefined>(undefined);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [expandedRow, setExpandedRow] = useState<string>('');
    
    const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
    const [isDeleteSubtaskModalOpen, setIsDeleteSubtaskModalOpen] = useState(false);
    const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);
    
    const dummyTask = (task: ITaskForm) => {}; 

    const complianceForm = useComplianceForm(dummyTask);
   
    const {
        data,
        loading,
        error,
        activeFilter,
        refetch,
    } = useComplianceData(currentValleyId ?? undefined, userRole);
    
    const [updateCompliance] = useMutation(UPDATE_COMPLIANCE);
    const [updateRegistry] = useMutation(UPDATE_REGISTRY);

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
        if (compliance.statusId === 2 && compliance.cartaAporte === undefined) {
            try {
                const { data } = await updateCompliance({
                    variables: {
                        id: selectedCompliance?.id,
                        input: {
                            taskId: selectedCompliance?.task.id,
                            statusId: compliance.statusId,
                        }
                    }
                })
            }
            catch (error) {
                console.error("Error updating compliance task:", error);
            }
        }
        else {
            try {
                const { data: registryData } = await updateRegistry({
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
                        }
                    }
                })
                try {
                    const { data } = await updateCompliance({
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
    const handleSeeInformation = async (complianceId: string, userRole: string) => {
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
                        };
                        console.log("Compliance with registry:", complianceWithRegistry);
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
    };
};