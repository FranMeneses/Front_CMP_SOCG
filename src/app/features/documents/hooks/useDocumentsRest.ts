import axios from 'axios';
import { useState } from 'react';
import { IDocument } from '@/app/models/IDocuments';
import { useDocumentsGraph } from './useDocumentsGraph';
import { FormData as DocumentFormData } from '../hooks/useDocumentForms';

export const useDocumentsRest = () => {
    const [documents, setDocuments] = useState<IDocument[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { handleUploadDocument } = useDocumentsGraph();

    // Modificar para aceptar toda la información del formulario
    const handleUpload = async (formData: DocumentFormData) => {
        try {
            if (!formData.file) {
                throw new Error('No se ha seleccionado ningún archivo');
            }
            
            // Crear FormData para enviar el archivo
            const fileFormData = new FormData();
            fileFormData.append('file', formData.file);
            
            // También añadir los metadatos al FormData
            fileFormData.append('documentType', formData.documentType);
            fileFormData.append('taskId', formData.task);
            fileFormData.append('subtaskId', formData.subtask);

            // Subir archivo y metadatos juntos
            const response = await axios.post('http://localhost:4000/documents/upload', fileFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            console.log('Archivo subido:', response.data);
            
            if (response.data.success) {
                const graphqlMetadata = {
                    ruta: response.data.ruta,
                    tipo_documento: parseInt(formData.documentType),
                    id_tarea: formData.task,
                    id_subtarea: formData.subtask,
                };
                
                await handleUploadDocument(graphqlMetadata);
                
                return {
                    success: true,
                    ruta: response.data.ruta,
                    filename: response.data.filename,
                    contentType: response.data.contentType
                };
            } else {
                throw new Error('Error al subir el archivo');
            }
        } catch (error) {
            console.error('Error al subir el documento:', error);
            throw error;
        }
    };
 
    return { documents, loading, error, handleUpload };
}