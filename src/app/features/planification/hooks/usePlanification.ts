import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_TASK, UPDATE_TASK } from "@/app/api/tasks";
import { CREATE_INFO_TASK } from "@/app/api/infoTask";
import { ISubtask } from "@/app/models/ISubtasks";
import { useHooks } from "../../hooks/useHooks";
import { IInfoTask, ITask } from "@/app/models/ITasks";
import { useValleyTaskForm } from "./useValleyTaskForm";
import { useValleySubtasksForm } from "./useValleySubtasksForm";
import { useTasksData } from "./useTaskData";
import { useCommunicationTaskForm } from "./useCommunicationTaskForm";

export const usePlanification = () => {
    const { currentValleyId, isValleyManager, userRole } = useHooks();
    
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [isPopupSubtaskOpen, setIsPopupSubtaskOpen] = useState<boolean>(false);
    const [isCommunicationModalOpen, setIsCommunicationModalOpen] = useState<boolean>(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<ITask | undefined>(undefined);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [selectedInfoTask, setSelectedInfoTask] = useState<IInfoTask | null>(null);
    const [selectedSubtask, setSelectedSubtask] = useState<ISubtask | null>(null);
    const [expandedRow, setExpandedRow] = useState<string>('');
    
    const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
    const [isDeleteSubtaskModalOpen, setIsDeleteSubtaskModalOpen] = useState(false);
    const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);
    
    const dummyTask = (task: any) => {};
    const dummySubtask = (subtask: any) => {};

    const valleyTaskForm = useValleyTaskForm(dummyTask, currentValleyId?.toString() || "");
    const valleySubtaskForm = useValleySubtasksForm(dummySubtask);
    const communicationTaskForm = useCommunicationTaskForm(dummyTask);
    
    
    const {
        data,
        loading,
        error,
        refetch,
        subTasks,
        detailedTasks,
        taskState,
        activeFilter,
        getRemainingDays,
        getRemainingSubtaskDays,
        formatDate,
        handleFilterClick,
    } = useTasksData(currentValleyId ?? undefined, userRole);
    
    const [createTask] = useMutation(CREATE_TASK);
    const [updateTask] = useMutation(UPDATE_TASK);
    const [createInfoTask] = useMutation(CREATE_INFO_TASK);

    const handleCreateTask = () => {

        if (isValleyManager) {
            setIsPopupOpen(true);
        }
        else {
            setIsCommunicationModalOpen(true);
        }
    };

    const handleSaveCommunication = async (task: ITask) => {
        try {
            const { data } = await createTask({
                variables: {
                    input: {
                        name: task.name,
                        description: task.description,
                        valleyId: task.valleyId,
                        faenaId: task.faenaId,
                        statusId: task.statusId,
                        processId: task.processId,
                    }
                }
            })
        }catch (error) {
            console.error("Error saving communication task:", error);
        }
        setIsCommunicationModalOpen(false);
        refetch();
    };
        
    const handleUpdateCommunication = async (task: ITask) => {
        try {
            console.log("Updating communication task:", task);
            const { data } = await updateTask({
                variables: {
                    id: selectedTaskId,
                    input: {
                        name: task.name,
                        description: task.description,
                        valleyId: task.valleyId,
                        faenaId: task.faenaId,
                        statusId: task.statusId,
                        processId: task.processId,
                    }
                }
            })
        }catch (error) {
            console.error("Error updating communication task:", error);
        }
        refetch();
        setIsCommunicationModalOpen(false);
    };

    const handleCancelCommunication = () => {
        setSelectedTask(undefined);
        setIsCommunicationModalOpen(false);
    };

    const handleAddTask = () => {
        setIsPopupOpen(true);
    };

    const handleCancel = () => {
        setSelectedInfoTask(null);
        setIsPopupOpen(false);
    };

    const handleCancelSubtask = () => {
        setSelectedSubtask(null);
        setIsPopupSubtaskOpen(false);
    };
    
    const handleDeleteTask = () => {
        try {
            valleyTaskForm.handleDeleteTask(itemToDeleteId!);
            setIsDeleteTaskModalOpen(false);
            refetch();
            window.location.reload();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
        setIsDeleteTaskModalOpen(false);
    };
    
    const handleDeleteSubtask = () => {
        try {
            valleySubtaskForm.handleDeleteSubtask(itemToDeleteId!);
            setIsDeleteSubtaskModalOpen(false);
            refetch();
            window.location.reload();
        }
        catch (error) {
            console.error("Error deleting subtask:", error);
        }
        setIsDeleteSubtaskModalOpen(false);
    };

    const handleSaveTask = async (task: any) => {
        console.log("Saving task:", task);
        try {
            const { data } = await createTask({
                variables: {
                    input: {
                        name: task.name,
                        description: task.description,
                        valleyId: task.valley,
                        faenaId: task.faena,
                        statusId: 1,
                        processId: task.process,
                    },
                },
            });

            if (!data?.createTask?.id) {
                throw new Error("Task creation failed: ID is undefined.");
            }

            const { data: infoData } = await createInfoTask({
                variables: {
                    input: {
                        taskId: data.createTask.id,
                        originId: task.origin,
                        investmentId: task.investment,
                        typeId: task.type,
                        scopeId: task.scope,
                        interactionId: task.interaction,
                        riskId: task.risk,
                    },
                },
            });
            await refetch();
        } catch (error) {
            console.error("Error saving task:", error);
        }

        setIsPopupOpen(false);
    };

    const handleOnTaskClick = (taskId: string) => {
        setSelectedTaskId((prev) => (prev === taskId ? null : taskId));
        setExpandedRow((prev) => (prev === taskId ? '' : taskId));
    };

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const handleSeeInformation = async (taskId: string, userRole: string) => {
        setSelectedTaskId(taskId);
        if (isValleyManager) {
            try {
                const taskInfo = await valleyTaskForm.handleGetInfoTask(taskId);
                if (taskInfo) {
                    setSelectedInfoTask(taskInfo);
                    setIsPopupOpen(true);
                } else {
                    console.warn("No task information found for the given task ID:", taskId);
                }
            } catch (error) {
                console.error("Error handling task information:", error);
            }
        }
        else  {
            try {
                const taskInfo = await communicationTaskForm.handleGetTask(taskId);
                if (taskInfo) {
                    setSelectedTask(taskInfo);
                    setIsCommunicationModalOpen(true);
                }
            }
            catch (error) {
                console.error("Error fetching task information:", error);
            }
        }
    };
    
    const handleGetSubtask = async (subtaskId: string) => {
        try {
            const subtask = await valleySubtaskForm.handleGetSubtask(subtaskId);
            if (subtask) {
                setSelectedSubtask(subtask);
                setIsPopupSubtaskOpen(true);
                return subtask;
            }
            return null;
        } catch (error) {
            console.error("Error in handleGetSubtask:", error);
            return null;
        }
    };

    const handleCreateSubtask = async (subtask: ISubtask) => {
        try {
            await valleySubtaskForm.handleCreateSubtask(subtask, selectedTaskId!);
            setIsPopupSubtaskOpen(false);
            refetch();
            window.location.reload();
        } catch (error) {
            console.error("Error in handleCreateSubtask:", error);
        }
    };

    const handleUpdateSubtask = async (subtask: ISubtask) => {
        try {
            await valleySubtaskForm.handleUpdateSubtask(subtask, selectedTaskId!, selectedSubtask);
            setIsPopupSubtaskOpen(false);
            window.location.reload();
        } catch (error) {
            console.error("Error in handleUpdateSubtask:", error);
        }
    };

    const handleUpdateTask = async (task: any) => {
        try {
            const updatedTaskId = await valleyTaskForm.handleUpdateTask(task, selectedTaskId!, selectedInfoTask);
            setIsPopupOpen(false);
            setSelectedTaskId(updatedTaskId);
            window.location.reload();
        } catch (error) {
            console.error("Error in handleUpdateTask:", error);
        }
    };

    return {
        setIsPopupOpen,
        setIsPopupSubtaskOpen,
        setIsCommunicationModalOpen,
        setSelectedTaskId,
        setSelectedTask,
        setIsSidebarOpen,
        setIsDeleteSubtaskModalOpen,
        setIsDeleteTaskModalOpen,
        setItemToDeleteId,
        handleAddTask,
        handleSaveTask,
        handleDeleteTask,
        handleDeleteSubtask,
        handleOnTaskClick,
        toggleSidebar,
        createTask,
        getRemainingDays,
        getRemainingSubtaskDays,
        handleCancel,
        formatDate,
        handleSeeInformation,
        handleGetSubtask,
        handleCreateSubtask,
        handleUpdateSubtask,
        handleUpdateTask,
        handleCancelSubtask,
        handleFilterClick,
        handleCreateTask,
        handleSaveCommunication,
        handleUpdateCommunication,
        handleCancelCommunication,
        selectedTask,
        isPopupOpen,
        isDeleteSubtaskModalOpen,
        isDeleteTaskModalOpen,
        isCommunicationModalOpen,
        itemToDeleteId,
        isPopupSubtaskOpen,
        selectedTaskId,
        isSidebarOpen,
        data,
        loading, 
        error,
        subTasks,
        detailedTasks,
        selectedInfoTask,
        selectedSubtask,
        expandedRow,
        taskState,
        activeFilter,
    };
};