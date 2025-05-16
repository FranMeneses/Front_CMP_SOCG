import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_TASK, DELETE_TASK } from "@/app/api/tasks";
import { CREATE_INFO_TASK } from "@/app/api/infoTask";
import { ISubtask } from "@/app/models/ISubtasks";
import { useHooks } from "../../hooks/useHooks";
import { IInfoTask } from "@/app/models/ITasks";
import React from "react";
import { useValleyTaskForm } from "./useValleyTaskForm";
import { useValleySubtasksForm } from "./useValleySubtasksForm";
import { useTasksData } from "./useTaskData";

export const usePlanification = () => {
    const { currentValleyId } = useHooks();
    
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [isPopupSubtaskOpen, setIsPopupSubtaskOpen] = useState<boolean>(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [tableOption, setTableOption] = useState<string>("Tareas");
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
    } = useTasksData(currentValleyId ?? undefined);
    
    const [createTask] = useMutation(CREATE_TASK);
    const [createInfoTask] = useMutation(CREATE_INFO_TASK);

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

    const handleSeeInformation = async (taskId: string) => {
        setSelectedTaskId(taskId);
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
        setTableOption,       
        setIsPopupOpen,
        setIsPopupSubtaskOpen,
        setSelectedTaskId,
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
        isPopupOpen,
        isDeleteSubtaskModalOpen,
        isDeleteTaskModalOpen,
        itemToDeleteId,
        isPopupSubtaskOpen,
        selectedTaskId,
        isSidebarOpen,
        tableOption,
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