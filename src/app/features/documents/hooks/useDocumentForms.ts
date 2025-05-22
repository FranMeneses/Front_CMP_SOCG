import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SUBTASKS } from '@/app/api/subtasks';
import { GET_TASKS } from '@/app/api/tasks';
import { ITask } from '@/app/models/ITasks';
import { ISubtask } from '@/app/models/ISubtasks';
import { GET_ALL_DOCUMENT_TYPES } from '@/app/api/documents';
import { IDocumentType } from '@/app/models/IDocuments';

export interface FormData {
    file: File | null;
    documentType: string;
    task: string;
    subtask: string;
}

export function useDocumentForms() {
    const [formData, setFormData] = useState<FormData>({
        file: null,
        documentType: "",
        task: "",
        subtask: ""
    });
    
    const {data: subtasksData, loading: isLoadingSubtask, error: subtaskError} = useQuery(GET_SUBTASKS);
    const {data: tasksData, loading: isLoadingTask, error: taskError} = useQuery(GET_TASKS);
    const {data: documentTypesData, loading: isLoadingDocumentsTypes, error: documentsTypesError} = useQuery(GET_ALL_DOCUMENT_TYPES);

    const getDocumentTypeText = () => {
        if (!formData.documentType) return "Seleccione tipo de documento";
        const selectedType = dropdownOptions.documentTypes.find(item => String(item.id) === formData.documentType);
        return selectedType ? selectedType.label : "Seleccione tipo de documento";
    };
    
    const getTaskText = () => {
        if (!formData.task) return "Seleccione tarea";
        const selectedTask = dropdownOptions.tasks.find(item => item.id === formData.task);
        return selectedTask ? selectedTask.label : "Seleccione tarea";
    };
    
    const getSubtaskText = () => {
        if (!formData.subtask) return "Seleccione subtarea";
        const selectedSubtask = dropdownOptions.subtasks.find(item => item.id === formData.subtask);
        return selectedSubtask ? selectedSubtask.label : "Seleccione subtarea";
    };

    const handleFileChange = (file: File) => {
        setFormData({
            ...formData,
            file: file
        });
    };

    const handleDocumentTypeChange = (selectedLabel: string) => {
        const documentTypes = documentTypesData?.getAllDocumentTypes || [];
        const selectedType = documentTypes.find((type: IDocumentType) => type.tipo_documento === selectedLabel);
        if (selectedType) {
            setFormData({
                ...formData,
                documentType: selectedType.id_tipo_documento.toString() 
            });
        }
    };

    const handleTaskChange = (selectedLabel: string) => {
        const tasks = tasksData?.tasks || [];
        const selectedTask = tasks.find((task: ITask) => task.name === selectedLabel);
        if (selectedTask) {
            setFormData({
                ...formData,
                task: selectedTask.id 
            });
        }
    };

    const handleSubtaskChange = (selectedLabel: string) => {
        const subtasks = subtasksData?.subtasks || [];
        const selectedSubtask = subtasks.find((subtask: ISubtask) => subtask.name === selectedLabel);
        if (selectedSubtask) {
            setFormData({
                ...formData,
                subtask: selectedSubtask.id 
            });
        }
    };

    const resetForm = () => {
        setFormData({
            file: null,
            documentType: "",
            task: "",
            subtask: ""
        });
    };

    const isFormValid = formData.file && formData.documentType && formData.task && formData.subtask;

    const tasks = tasksData?.tasks || [];
    const subtasks = subtasksData?.subtasks || [];
    const documentTypes = documentTypesData?.getAllDocumentTypes || [];

    const dropdownOptions = {
        documentTypes: Array.isArray(documentTypes) ? documentTypes.map((type: IDocumentType) => ({ id: type.id_tipo_documento, label: type.tipo_documento })) : [],
        tasks: Array.isArray(tasks) ? tasks.map((task: ITask) => ({ id: task.id, label: task.name })) : [],
        subtasks: Array.isArray(subtasks) ? subtasks.map((subtask: ISubtask) => ({ id: subtask.id, label: subtask.name })) : []
    };

    return {
        formData,
        isFormValid,
        dropdownOptions,
        handleFileChange,
        handleDocumentTypeChange,
        handleTaskChange,
        handleSubtaskChange,
        resetForm,
        getDocumentTypeText,
        getTaskText,
        getSubtaskText,
        isLoading: isLoadingSubtask || isLoadingTask || isLoadingDocumentsTypes,
    };
}