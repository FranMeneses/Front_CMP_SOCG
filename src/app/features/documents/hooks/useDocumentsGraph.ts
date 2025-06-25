import { CREATE_DOCUMENT, DELETE_DOCUMENT, GET_DOCUMENTS, GET_DOCUMENTS_BY_TYPE } from "@/app/api/documents";
import { GET_TASK } from "@/app/api/tasks";
import { IDocumentInput, IDocumentList } from "@/app/models/IDocuments";
import { ITask } from "@/app/models/ITasks";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";

export function useDocumentsGraph() {
    const [documentsWithTasks, setDocumentsWithTasks] = useState<IDocumentList[]>([]);
    const [tasksLoaded, setTasksLoaded] = useState(false);
    
    const { data: documentsData, loading: documentLoading, refetch } = useQuery(GET_DOCUMENTS, {
        fetchPolicy: 'network-only'
    });
    const [getDocumentsByType, { 
        loading: isLoadingByType, 
    }] = useLazyQuery(GET_DOCUMENTS_BY_TYPE);

    const [createDocument] = useMutation(CREATE_DOCUMENT);
    const [deleteDocument] = useMutation(DELETE_DOCUMENT);

    const [getTaskDocuments, {
        loading: isLoadingTaskDocuments,
    }] = useLazyQuery(GET_TASK);

    /**
     * Crea metadata en la base de datos
     * @param metadata Metadata del documento
     */
    const handleUploadDocument = async (metadata: IDocumentInput) => {
        try {
            const { data } = await createDocument({
                variables: {
                    input: metadata,
                },
            });
            return data.createDocument;
        }
        catch (error) {
            console.error("Error uploading document:", error);
            throw error;
        }
        finally {
            refetch();
            window.location.reload();
        }
    };

    /**
     * Obtiene documentos filtrados por tipo
     * @param tipoDocumento ID del tipo de documento a filtrar
     * @return Lista de documentos filtrados por tipo
     */
    const fetchDocumentsByType = async (tipo_documento: string) => {
        const id = parseInt(tipo_documento);
        try {
            const response = await getDocumentsByType({ 
                variables: { tipo_documento: id } 
            });
            return response.data?.documents || [];
        } catch (error) {
            console.error("Error fetching documents by type:", error);
            return [];
        }
    };

    /**
     * Obtiene la tarea asociada a un documento
     * @param idTarea ID de la tarea
     * @return Tarea asociada al documento
     */
    const fetchTaskDocuments = async (idTarea: string) => {
        try {
            const response = await getTaskDocuments({ 
                variables: { id: idTarea } 
            });
            return response.data?.task || null;
        } catch (error) {
            console.error("Error fetching task documents:", error);
            return null;
        }
    };

    /**
     * Función para eliminar un documento
     * @param idDocumento ID del documento a eliminar
     */
    const handleDeleteDocument = async (idDocumento: string) => {
        try {
            await deleteDocument({
                variables: { id_documento: idDocumento },
            });
        } catch (error) {
            console.error("Error deleting document:", error);
        } 
        window.location.reload();
    };

    /**
     * Enriquece los documentos con información de tareas y subtareas
     * @param documents Lista de documentos a enriquecer
     * @returns Documentos enriquecidos con información de tareas y subtareas
     */
    const enrichDocumentsWithTasksAndSubtasks = async (documents: IDocumentList[]) => {
        if (!documents || documents.length === 0) return [];
        
        const updatedDocuments = documents.map((doc: IDocumentList) => ({
            ...doc,
            tipo_doc: doc.tipo_doc,
        }));
        
        const promises = updatedDocuments
            .filter((doc) => doc.id_tarea)
            .map(async (doc) => {
                if (!doc.id_tarea) return doc;
                const task: ITask = await fetchTaskDocuments(doc.id_tarea);
                if (task) {
                    doc.tarea = task;
                }
                return doc;
            });

        await Promise.all(promises);
        
        return updatedDocuments;
    };

    /**
     * Hook para cargar documentos con sus tareas y subtareas asociadas
     * @description Este hook se encarga de cargar los documentos y las tareas o subtareas asociadas a ellos, actualizando el estado de los documentos.
     */
    useEffect(() => {
        const loadTasksForDocuments = async () => {
            if (!documentsData?.documents) return;
            setTasksLoaded(false);
            const enrichedDocuments = await enrichDocumentsWithTasksAndSubtasks(documentsData.documents);
            setDocumentsWithTasks(enrichedDocuments);
            setTasksLoaded(true);
        };
        
        loadTasksForDocuments();
    }, [documentsData]);


    const isLoading = documentLoading || isLoadingByType || isLoadingTaskDocuments;

    return {
        documents: tasksLoaded ? documentsWithTasks : (documentsData?.documents || []),
        documentsWithTasks,
        isLoading,
        tasksLoaded,
        handleUploadDocument,
        fetchDocumentsByType,
        enrichDocumentsWithTasksAndSubtasks,
        handleDeleteDocument,
    };
}