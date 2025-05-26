import { CREATE_DOCUMENT, GET_DOCUMENTS, GET_DOCUMENTS_BY_TYPE } from "@/app/api/documents";
import { IDocumentInput } from "@/app/models/IDocuments";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { useEffect } from "react";

export function useDocumentsGraph() {
    // Query para obtener todos los documentos
    const { data, loading: isLoading, error, refetch } = useQuery(GET_DOCUMENTS, {
        fetchPolicy: 'network-only'
    });
    
    // Query lazy para obtener documentos por tipo (solo se ejecuta cuando se llama a la función)
    const [getDocumentsByType, { 
        loading: isLoadingByType, 
        data: documentsByType 
    }] = useLazyQuery(GET_DOCUMENTS_BY_TYPE);

    const [createDocument] = useMutation(CREATE_DOCUMENT);

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

    return {
        documents: data?.documents || [],
        isLoading,
        handleUploadDocument,
        fetchDocumentsByType,
        isLoadingByType
    };
}