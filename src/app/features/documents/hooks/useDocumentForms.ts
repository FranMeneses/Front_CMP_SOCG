import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TASKS, GET_TASKS_BY_PROCESS } from '@/app/api/tasks';
import { ITask } from '@/app/models/ITasks';
import { GET_ALL_DOCUMENT_TYPES } from '@/app/api/documents';
import { ITipoDocumento } from '@/app/models/IDocuments';
import { useHooks } from '../../hooks/useHooks';

export interface FormData {
    file: File | null;
    documentType: string;
    task: string;
}

export function useDocumentForms() {
    const [formData, setFormData] = useState<FormData>({
        file: null,
        documentType: "",
        task: "",
    });
    
    const { isValleyManager, currentProcess } = useHooks();

    const {data: tasksData, loading: isLoadingTask} = useQuery(GET_TASKS, {
        skip: isValleyManager,
    });
    const {data: documentTypesData, loading: isLoadingDocumentsTypes} = useQuery(GET_ALL_DOCUMENT_TYPES);

    const {data: processTaskData, loading: isLoadingProcessTask} = useQuery(GET_TASKS_BY_PROCESS, {
        variables: { processId: currentProcess?.id },
        skip: !isValleyManager,
    });

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
        const selectedType = documentTypes.find((type: ITipoDocumento) => type.tipo_documento === selectedLabel);
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
        const tasks = isValleyManager ? processTaskData?.tasksByProcess : tasksData?.tasks || [];
        const selectedTask = tasks.find((task: ITask) => task.name === selectedLabel);
        if (selectedTask) {
            setFormData({
                ...formData,
                task: selectedTask.id 
            });
        }
    };

    /**
     * Resetea el formulario
     */
    const resetForm = () => {
        setFormData({
            file: null,
            documentType: "",
            task: "",
        });
    };

    /**
     * Verifica si el formulario es válido
     * @returns 
     */
    const isFormValid = formData.file && formData.documentType && formData.task;

    const tasks = isValleyManager ? processTaskData?.tasksByProcess : tasksData?.tasks || [];
    const documentTypes = documentTypesData?.getAllDocumentTypes || [];

    /**
     * Opciones para los dropdowns
     */
    const dropdownOptions = {
        documentTypes: Array.isArray(documentTypes) 
            ? documentTypes
                .filter((type: ITipoDocumento) => 
                    type.tipo_documento !== "Carta de Aporte" && 
                    type.tipo_documento !== "Minuta"
                )
                .map((type: ITipoDocumento) => ({ 
                    id: type.id_tipo_documento, 
                    label: type.tipo_documento 
                })) 
            : [],
        tasks: Array.isArray(tasks) 
            ? tasks.map((task: ITask) => ({ id: task.id, label: task.name })) 
            : [],
    };

    return {
        formData,
        isFormValid,
        dropdownOptions,
        handleFileChange,
        handleDocumentTypeChange,
        handleTaskChange,
        resetForm,
        getDocumentTypeText,
        getTaskText,
        isLoading: isLoadingTask || isLoadingDocumentsTypes || isLoadingProcessTask,
    };
}