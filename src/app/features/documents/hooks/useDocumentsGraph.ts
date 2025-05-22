import { CREATE_DOCUMENT, GET_DOCUMENTS } from "@/app/api/documents";
import { IDocument, IDocumentInput } from "@/app/models/IDocuments";
import { useMutation, useQuery } from "@apollo/client";
import { useMemo } from "react";

export function useDocumentsGraph () {
    
    const { data: documents, loading:isLoading } = useQuery(GET_DOCUMENTS);
    const [createDocument] = useMutation(CREATE_DOCUMENT);
    
    const documentsList = useMemo(() => {
    return Array.isArray(documents) 
        ? documents.map((document) => ({
            ...document,
        }))
        : []; 
    }, [documents]);

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
    }
    
    return {
        documentsList,
        isLoading,
        handleUploadDocument,
    };
}