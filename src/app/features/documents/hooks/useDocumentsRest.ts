import axios from 'axios';
import { useDocumentsGraph } from './useDocumentsGraph';
import { FormData as DocumentFormData } from '../hooks/useDocumentForms';
import { UploadResponse, DeleteResponse } from '@/app/models/IAxios';

export const useDocumentsRest = () => {

    const { handleUploadDocument } = useDocumentsGraph();

    /**
     * Sube un documento al servidor
     * @param formData Datos del formulario, incluyendo el archivo y metadatos
     * @description Maneja la subida de un archivo y su metadata asociada
     */
    const handleUpload = async (formData: DocumentFormData) => {
        try {
            if (!formData.file) {
                throw new Error('No se ha seleccionado ningún archivo');
            }

            const fileFormData = new FormData();
            fileFormData.append('file', formData.file); 

            fileFormData.append('documentType', formData.documentType.toString());
            fileFormData.append('taskId', formData.task.toString());

            const response = await axios.post<UploadResponse>(`${process.env.NEXT_PUBLIC_API_URL}/documents/upload`, fileFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            if (response.data.success) {
                const graphqlMetadata = {
                    ruta: response.data.ruta,
                    nombre_archivo: response.data.filename,
                    tipo_documento: Number(formData.documentType), 
                    id_tarea: formData.task,
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
 
    /**
     * Función para descargar un documento
     * @param documentId ID del documento a descargar
     */
    const handleDownload = async (documentId: string) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/documents/download/${documentId}`, {
                responseType: 'blob', 
            });

            const contentType = response.headers['content-type'];
            
            const contentDisposition = response.headers['content-disposition'];
            let filename = `document-${documentId}`;

            if (contentDisposition) {
                let filenameMatch = contentDisposition.match(/filename\*=UTF-8''(.+)/);
                if (filenameMatch && filenameMatch.length >= 2) {
                    filename = decodeURIComponent(filenameMatch[1]);
                } else {
                    filenameMatch = contentDisposition.match(/filename="(.+)"/);
                    if (filenameMatch && filenameMatch.length >= 2) {
                        filename = filenameMatch[1];
                    }
                }
            }
            const url = window.URL.createObjectURL(new Blob([response.data as BlobPart], { 
                type: contentType 
            }));
            
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename); 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setTimeout(() => window.URL.revokeObjectURL(url), 100);
        } catch (error) {
            console.error('Error al descargar el documento:', error);
            throw error;
        }
    };

    /**
     * Función para eliminar un documento usando la lógica inteligente del backend
     * @param documentId ID del documento a eliminar
     * @description Utiliza la API REST que implementa la lógica de:
     * - Si la tarea NO tiene historial: borra blob + metadata
     * - Si la tarea SÍ tiene historial: borra solo metadata (preserva blob)
     */
    const handleDelete = async (documentId: string) => {
        try {
            const response = await axios.delete<DeleteResponse>(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}`);
            
            if (response.data.success) {
                console.log('Documento eliminado exitosamente');
                return response.data;
            } else {
                throw new Error('Error al eliminar el documento');
            }
        } catch (error) {
            console.error('Error al eliminar el documento:', error);
            throw error;
        }
    };

    return { handleUpload, handleDownload, handleDelete };
}