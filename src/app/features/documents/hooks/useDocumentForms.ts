import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TASK_SUBTASKS, GET_TASKS } from '@/app/api/tasks';
import { ITask } from '@/app/models/ITasks';
import { ISubtask } from '@/app/models/ISubtasks';
import { GET_ALL_DOCUMENT_TYPES } from '@/app/api/documents';
import { IDocumentType } from '@/app/models/IDocuments';

export interface FormData {
    file: File | null;
    documentType: string;
    option: string;
    task: string;
    subtask: string;
}

export function useDocumentForms() {
    const [formData, setFormData] = useState<FormData>({
        file: null,
        documentType: "",
        option: "",
        task: "",
        subtask: ""
    });
    
    const {data: subtasksData, loading: isLoadingSubtask, error: subtaskError} = useQuery(GET_TASK_SUBTASKS, {
        variables: { id: formData.task },
        skip: !formData.task,
    });
    const {data: tasksData, loading: isLoadingTask, error: taskError} = useQuery(GET_TASKS);
    const {data: documentTypesData, loading: isLoadingDocumentsTypes, error: documentsTypesError} = useQuery(GET_ALL_DOCUMENT_TYPES);

    /**
     * Retorna el texto del tipo de documento seleccionado
     * @returns 
     */
    const getDocumentTypeText = () => {
        if (!formData.documentType) return "Seleccione tipo de documento";
        const selectedType = dropdownOptions.documentTypes.find(item => String(item.id) === formData.documentType);
        return selectedType ? selectedType.label : "Seleccione tipo de documento";
    };
    
    /**
     * Retorna el nombre de la tarea seleccionada
     * @returns 
     */
    const getTaskText = () => {
        if (!formData.task) return "Seleccione tarea";
        const selectedTask = dropdownOptions.tasks.find(item => item.id === formData.task);
        return selectedTask ? selectedTask.label : "Seleccione tarea";
    };
    
    /**
     * Retorna el nombre de la subtarea seleccionada
     * @returns 
     */
    const getSubtaskText = () => {
        if (!formData.subtask) return "Seleccione subtarea";
        const selectedSubtask = dropdownOptions.subtasks.find(item => item.id === formData.subtask);
        return selectedSubtask ? selectedSubtask.label : "Seleccione subtarea";
    };

    /**
     * Maneja el cambio del archivo seleccionado
     * @param file Archivo seleccionado
     * @description Actualiza el estado del formulario con el archivo seleccionado
     */
    const handleFileChange = (file: File) => {
        setFormData({
            ...formData,
            file: file
        });
    };

    /**
     * Maneja el cambio del tipo de documento seleccionado
     * @param selectedLabel Documento seleccionado
     * @description Actualiza el estado del formulario con el tipo de documento seleccionado
     */
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

    /**
     * Maneja el cambio de la tarea seleccionada
     * @param selectedLabel Tarea seleccionada
     * @description Actualiza el estado del formulario con la tarea seleccionada
     */
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

    /**
     * Maneja el cambio de la subtarea seleccionada
     * @param selectedLabel Subtarea seleccionada
     * @description Actualiza el estado del formulario con la subtarea seleccionada
     */
    const handleSubtaskChange = (selectedLabel: string) => {
        const subtasks = subtasksData?.taskSubtasks || [];
        const selectedSubtask = subtasks.find((subtask: ISubtask) => subtask.name === selectedLabel);
        if (selectedSubtask) {
            setFormData({
                ...formData,
                subtask: selectedSubtask.id 
            });
        }
    };

    /**
     * Maneja el cambio de la opción de asociación de documento (Tarea/Subtarea)
     * @param selectedOption Opción seleccionada ("Tarea" o "Subtarea")
     * @description Actualiza el estado del formulario con la opción seleccionada
     */
    const handleOptionChange = (selectedOption: string) => {
        setFormData({
            ...formData,
            option: selectedOption,
            // Limpiamos el valor de subtarea si cambia la opción, para mantener consistencia
            subtask: selectedOption === "Tarea" ? "" : formData.subtask
        });
    };


    /**
     * Resetea el formulario
     */
    const resetForm = () => {
        setFormData({
            file: null,
            documentType: "",
            option: "",
            task: "",
            subtask: ""
        });
    };

    /**
     * Verifica si el formulario es válido
     * @returns 
     */
    const isFormValid = formData.file && formData.documentType && (formData.task || formData.subtask);

    const tasks = tasksData?.tasks || [];
    const subtasks = subtasksData?.taskSubtasks || [];
    const documentTypes = documentTypesData?.getAllDocumentTypes || [];

    /**
     * Opciones para los dropdowns
     */
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
        handleOptionChange,
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