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
            fileFormData.append('subtaskId', formData.subtask.toString());
            fileFormData.append('option', formData.option.toString());

            console.log('Subiendo archivo:', formData.task);
            console.log('Subiendo archivo:', formData.option);

            const response = await axios.post('http://localhost:4000/documents/upload', fileFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            if (response.data.success) {
                if (formData.option === 'Tarea') {
                    const graphqlMetadata = {
                        ruta: response.data.ruta,
                        nombre_archivo: response.data.filename,
                        tipo_documento: Number(formData.documentType), 
                        id_tarea: formData.task,
                    };

                    await handleUploadDocument(graphqlMetadata);
                }
                if (formData.option === 'Subtarea') {
                    const graphqlMetadata = {
                        ruta: response.data.ruta,
                        nombre_archivo: response.data.filename,
                        tipo_documento: Number(formData.documentType), 
                        id_subtarea: formData.subtask,
                    };

                    await handleUploadDocument(graphqlMetadata);
                }
                
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
            const response = await axios.get(`http://localhost:4000/documents/download/${documentId}`, {
                responseType: 'blob', 
            });

            console.log(response.data);

            const contentType = response.headers['content-type'];
            
            const contentDisposition = response.headers['content-disposition'];
            let filename = `document-${documentId}`;
            
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch && filenameMatch.length >= 2) {
                    filename = filenameMatch[1];
                }
            }

            if (!filename.includes('.')) {
                if (contentType === 'application/pdf') {
                    filename += '.pdf';
                } else if (contentType === 'application/vnd.ms-excel' || 
                        contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                    filename += '.xlsx';
                } else if (contentType === 'application/msword' || 
                        contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    filename += '.docx';
                }
            }

            const url = window.URL.createObjectURL(new Blob([response.data], { 
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

    return { documents, loading, error, handleUpload, handleDownload };
}