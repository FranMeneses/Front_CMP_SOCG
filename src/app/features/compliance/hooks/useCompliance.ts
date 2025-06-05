import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useHooks } from "../../hooks/useHooks";
import { ITask } from "@/app/models/ITasks";
import { useComplianceData } from "./useComplianceData";
import { ITaskForm } from "@/app/models/ICommunicationsForm";
import { useComplianceForm } from "./useComplianceForm";
import { IComplianceForm } from "@/app/models/ICompliance";
import { CREATE_COMPLIANCE, CREATE_REGISTRY, UPDATE_COMPLIANCE, UPDATE_REGISTRY } from "@/app/api/compliance";

export const usePlanification = () => {
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
    
    const [createCompliance] = useMutation(CREATE_COMPLIANCE);
    const [updateCompliance] = useMutation(UPDATE_COMPLIANCE);
    const [createRegistry] = useMutation(CREATE_REGISTRY);
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
            try {
                const { data: registryData } = await updateRegistry({
                    variables: {
                        id: data.update.id,
                        input: {
                            carta: compliance.cartaAporte,
                            minuta: compliance.minuta,
                            hasHem: compliance.hasHem,
                            hasHes: compliance.hasHes,
                            provider: compliance.provider,
                        }
                    }
                })
            }
            catch (error) {
                console.error("Error updating registry task:", error);
            }
        } catch (error) {
            console.error("Error updating compliance task:", error);
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
                            cartaAporteObs: taskRegistry.cartaAporteObs || "",
                            minutaObs: taskRegistry.minutaObs || "",
                            hasMemo: taskRegistry.hasMemo || false,
                            hasSolped: taskRegistry.hasSolped || false,
                            hasHem: taskRegistry.hasHem || false,
                            hasHes: taskRegistry.hasHes || false,
                            provider: taskRegistry.provider || "",
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