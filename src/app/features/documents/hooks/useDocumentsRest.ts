import axios from 'axios';
import {useState, useEffect} from 'react';
import { IDocument } from '@/app/models/IDocuments';
import { useDocumentsGraph } from './useDocumentsGraph';

export const useDocumentsRest = () => {
    const [documents, setDocuments] = useState<IDocument[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { handleUploadDocument } = useDocumentsGraph();

    const handleUpload = async (file: File) => {
    try {
        // Paso 1: Subir el archivo físico
        const formData = new FormData();
        formData.append('file', file);

        // Llamada al endpoint REST /documents/upload
        const response = await axios.post('http://localhost:4000/documents/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        });
        
        console.log('Archivo subido:', response.data);
        
        if (response.data.success) {
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