import { useState, useEffect } from "react";
import { useDocumentsRest } from "./useDocumentsRest";
import { FormData as DocumentFormData } from './useDocumentForms';
import { IDocumentList } from "@/app/models/IDocuments";
import { useDocumentsGraph } from "./useDocumentsGraph";

interface DocumentTypeOption {
  id: string;
  name: string;
}

export function useDocumentsPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    
    const { handleUpload } = useDocumentsRest();
    const { 
        fetchDocumentsByType, 
        documentsWithTasks,
        enrichDocumentsWithTasksAndSubtasks
    } = useDocumentsGraph();
    
    const [filteredDocuments, setFilteredDocuments] = useState<IDocumentList[]>([]);
    
    const [documentTypes, setDocumentTypes] = useState<DocumentTypeOption[]>([
        { id: "all", name: "Todos los documentos" }
    ]);
    
    const [selectedType, setSelectedType] = useState<string>("all");
    
    const [selectedTypeName, setSelectedTypeName] = useState<string>("Todos los documentos");
    
    const [isFilterLoading, setIsFilterLoading] = useState<boolean>(false);

    /**
     * Extrae los tipos de documentos únicos y configura los documentos filtrados
     * @param documents Lista de documentos a procesar
     */
    const setupDocumentFiltering = (documents: IDocumentList[]) => {
        if (documents && documents.length > 0) {
            const typesMap = new Map<string, DocumentTypeOption>();
            
            typesMap.set("all", { id: "all", name: "Todos los documentos" });
            
            documents.forEach(doc => {
                if (doc.tipo_doc && doc.tipo_doc.id_tipo_documento && doc.tipo_doc.tipo_documento) {
                    typesMap.set(doc.tipo_doc.id_tipo_documento.toString(), {
                        id: doc.tipo_doc.id_tipo_documento.toString(),
                        name: doc.tipo_doc.tipo_documento
                    });
                }
            });
            
            const typeOptions = Array.from(typesMap.values());
            setDocumentTypes(typeOptions);
            setFilteredDocuments(documents);
        } else {
            setFilteredDocuments([]);
        }
    };

    /**
     * Maneja la selección de un tipo de documento para filtrar utilizando la API del backend
     * @param typeId ID del tipo de documento seleccionado
     * @param typeName Nombre del tipo de documento seleccionado
     * @param allDocuments Lista completa de documentos (para mostrar todos si se selecciona "Todos los documentos")
     */
    const handleTypeSelect = async (typeId: string, typeName: string, allDocuments: IDocumentList[]) => {
        setSelectedType(typeId);
        setSelectedTypeName(typeName);
        setIsFilterLoading(true);
        
        try {
            if (typeId === "all") {
                setFilteredDocuments(allDocuments);
            } else {
                const filteredDocs = await fetchDocumentsByType(typeId);
                
                const enrichedFilteredDocs = await enrichDocumentsWithTasksAndSubtasks(filteredDocs);
                
                setFilteredDocuments(enrichedFilteredDocs);
            }
        } catch (error) {
            console.error("Error al filtrar documentos:", error);
        } finally {
            setIsFilterLoading(false);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    /**
     * Función para manejar la subida de archivos
     * @param formData Datos del formulario que incluyen el archivo y metadata
     * @description Esta función se encarga de enviar los datos del formulario al backend para su procesamiento
     */
    const handleUploadFile = async (formData: DocumentFormData) => {
        try {
            await handleUpload(formData);
            setIsFormOpen(false);
        } catch (error) {
            console.error("Error en handleUploadFile:", error);
        }
    };
    
    const handleOpenForm = () => {
        setIsFormOpen(true);
    }

    return {
        isSidebarOpen,
        isFormOpen,
        setIsFormOpen,
        toggleSidebar,
        handleUploadFile,
        handleOpenForm,
        filteredDocuments,
        documentTypes,
        selectedType,
        selectedTypeName,
        setupDocumentFiltering,
        handleTypeSelect,
        isFilterLoading
    };
}