import { useState } from 'react';
import axios from 'axios';

export const usePlanificationRest = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Función para cargar los datos de planificación desde un archivo Excel.
     * @description Realiza una consulta para obtener los datos de planificación y los almacena en el estado.
     */
    const loadPlanificationData = async (file: File) => {
        try {
            setError(null);
            
            const allowedExtensions = ['.xlsx', '.xls'];
            const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
            
            if (!allowedExtensions.includes(fileExtension)) {
                setError('Por favor, selecciona un archivo Excel válido (.xlsx o .xls)');
                return;
            }

            setIsLoading(true);
            const formData = new FormData();
            formData.append('file', file);
            
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/etl/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
        } catch (err) {
            console.error('Error en loadPlanificationData:', err);
            setError('Error al cargar los datos de planificación');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        loadPlanificationData,
    };
}