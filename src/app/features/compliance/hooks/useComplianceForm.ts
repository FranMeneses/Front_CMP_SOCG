import { useState, useEffect, useMemo } from "react";
import { useHooks } from "../../hooks/useHooks";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_COMPLIANCE, GET_COMPLIANCE_REGISTRIES, GET_COMPLIANCE_STATUSES } from "@/app/api/compliance";
import { IComplianceForm, IComplianceStatus } from "@/app/models/ICompliance";
import { GET_ALL_DOCUMENT_TYPES, GET_DOCUMENT_BY_TASK_AND_TYPE } from "@/app/api/documents";
import { ITipoDocumento } from "@/app/models/IDocuments";
import { useDocumentsPage } from "../../documents/hooks/useDocumentsPage";
import { FormData } from "../../documents/hooks/useDocumentForms";

export const useComplianceForm = (
    onSave: any,
    isEditing?: boolean,
    selectedCompliance?: IComplianceForm,
    userRole?: string
) => {
    const [formState, setFormState] = useState<{
        name: string;
        description: string;
        valleyId: string;
        faenaId: string;
        processId: string;
        statusId: number;
        cartaAporte: boolean;
        cartaAporteFile: File | null;
        minuta: boolean;
        minutaFile: File | null;
        hasMemo: boolean;
        hasSolped: boolean;
        hasHem: boolean;
        hasHes: boolean;
        provider: string;
    }>({
        name: "",
        description: "",
        valleyId: "",
        faenaId: "",
        processId: "",
        statusId: 0,
        cartaAporte: false,
        cartaAporteFile: null,
        minuta: false,
        minutaFile: null,
        hasMemo: false,
        hasSolped: false,
        hasHem: false,
        hasHes: false,
        provider: "",
    });

    const {data: complianceStatusData } = useQuery(GET_COMPLIANCE_STATUSES);
    const {data: documentsTypeData } = useQuery(GET_ALL_DOCUMENT_TYPES);

    const complianceStatuses = complianceStatusData?.getAllComplianceStatuses || [];
    const documentsType: ITipoDocumento[] = documentsTypeData?.getAllDocumentTypes || [];
    const complianceStatusNames = complianceStatuses.map((status: IComplianceStatus) => status.name);

    const [getCompliance] = useLazyQuery(GET_COMPLIANCE);
    const [getRegistry] = useLazyQuery(GET_COMPLIANCE_REGISTRIES);
    const [getDocument] = useLazyQuery(GET_DOCUMENT_BY_TASK_AND_TYPE);

    const { handleUploadFile } = useDocumentsPage();
    const { valleysName, faenasName, valleys } = useHooks();

    /**
     * Función que obtiene la carta aporte asociada a la tarea de cumplimiento.
     * @description Esta función realiza una consulta para obtener el documento de tipo "Carta Aporte" asociado a la tarea de cumplimiento seleccionada.
     * @returns Documento asociado
     */
    const handleGetCarta = async () => {
        try {
            const tipo = documentsType.find((d:ITipoDocumento) => d.tipo_documento === "Carta de Aporte")?.id_tipo_documento || "";
            const { data } = await getDocument({
                variables: {
                    taskId: selectedCompliance?.task.id || "",
                    documentType: tipo
                }
            });
            console.log("Carta Aporte data:", data.documentByTaskAndType);
            return data.documentByTaskAndType;
        }
        catch (error) {
            console.error("Error fetching document:", error);
            return null;
        }
    };

    /**
     * Función que obtiene la minuta asociada a la tarea de cumplimiento.
     * @description Esta función realiza una consulta para obtener el documento de tipo "Minuta" asociado a la tarea de cumplimiento seleccionada.
     * @returns Documento asociado
     */
    const handleGetMinuta = async () => {
        try {
            const tipo = documentsType.find((d:ITipoDocumento) => d.tipo_documento === "Minuta")?.id_tipo_documento || "";
            const { data } = await getDocument({
                variables: {
                    taskId: selectedCompliance?.task.id || "",
                    documentType: tipo
                }
            });
            return data.documentByTaskAndType;
        }
        catch (error) {
            console.error("Error fetching document:", error);
            return null;
        }
    };

    /**
     * Función que obtiene los datos de cumplimiento de una tarea específica.
     * @param {string} id - ID de la tarea para la cual se desea obtener los datos de cumplimiento.
     * @returns {Promise<IComplianceForm | null>}
     * 
    */
    const handleGetCompliance = async (id: string) => {
        try{
            const { data } = await getCompliance({
                variables: { id }
            });
            return data.findOne;
        }
        catch (error) {
            console.error("Error fetching compliance data:", error);
            return null;
        }
    };

    /**
     * Función que maneja el cambio del archivo de carta aporte.
     * @param {File} file - Archivo de carta aporte seleccionado.
     */
    const handleCartaAporteChange = (file: File) => {
        setFormState({
            ...formState,
            cartaAporteFile: file,
            cartaAporte: true
        });
    };

    /**
     * Función que maneja el cambio del archivo de minuta.
     * @param {File} file - Archivo de minuta seleccionado.
     */
    const handleMinutaChange = (file: File) => {
        setFormState({
            ...formState,
            minutaFile: file,
            minuta: true
        });
    };

    /**
     * Función que obtiene los registros de cumplimiento asociados a una tarea específica.
     * @param {string} id - ID de la tarea para la cual se desean obtener los registros de cumplimiento.
     * @returns {Promise<Array>} - Lista de registros de cumplimiento.
     */
    const handleGetRegistry = async (id: string) => {
        try {
            const { data } = await getRegistry({
                variables: { complianceId: id }
            });
            return data.getComplianceRegistries;
        } catch (error) {
            console.error("Error fetching compliance registry:", error);
            return [];
        }
    }

    /**
     * Hook que se ejecuta al iniciar el componente para cargar los datos de cumplimiento si se está editando.
     */
    useEffect(() => {
        if (isEditing && selectedCompliance) {
            setFormState({
                name: selectedCompliance.task.name || "",
                description: selectedCompliance.task.description || "",
                valleyId: selectedCompliance.task.valleyId !== undefined && selectedCompliance.task.valleyId !== null ? String(selectedCompliance.task.valleyId) : "",
                faenaId: selectedCompliance.task.faenaId !== undefined && selectedCompliance.task.faenaId !== null ? String(selectedCompliance.task.faenaId) : "",
                processId: selectedCompliance.task.processId !== undefined && selectedCompliance.task.processId !== null ? String(selectedCompliance.task.processId) : "",
                statusId: selectedCompliance.statusId || 0,
                cartaAporte: selectedCompliance.cartaAporte || false,
                cartaAporteFile: null,
                minuta: selectedCompliance.minuta || false,
                minutaFile: null,
                hasMemo: selectedCompliance.hasMemo || false,
                hasSolped: selectedCompliance.hasSolped || false,
                hasHem: selectedCompliance.hasHem || false,
                hasHes: selectedCompliance.hasHes || false,
                provider: selectedCompliance.provider || "",
            });
        }
    }, [isEditing, selectedCompliance]);

    /**
     * Función que maneja el cambio de los campos del formulario.
     * @param {string} field - Nombre del campo que se está modificando.
     * @param {any} value - Nuevo valor para el campo.
     */
    const handleInputChange = (field: string, value: any) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    };

    /**
     * Función que maneja el guardado de los datos del formulario.
     * @description Esta función valida los campos requeridos y prepara los datos para ser enviados al servidor.
     */
    const handleSave = () => {
        let compliance = {};
        let document: FormData;
        
        let nextStatusId = formState.statusId;
        
        if (formState.statusId >= 2 && formState.statusId < 6) {
            if (
                (formState.statusId === 2 && formState.cartaAporteFile) ||
                (formState.statusId === 3 && formState.minutaFile) ||
                (formState.statusId === 4 && (formState.hasMemo || formState.hasSolped)) ||
                (formState.statusId === 5 && (formState.hasHem || formState.hasHes) && formState.provider)
            ) {
                nextStatusId = formState.statusId + 1;
            }
        }
        
        compliance = {
            task: {
                name: formState.name,
                description: formState.description,
                valleyId: formState.valleyId ? parseInt(formState.valleyId) : null,
                faenaId: formState.faenaId ? parseInt(formState.faenaId) : null,
                processId: formState.processId ? parseInt(formState.processId) : null,
            },
            statusId: nextStatusId,
            applies: true, 
            cartaAporte: formState.cartaAporte || false,
            minuta: formState.minuta || false,
            hasMemo: formState.hasMemo || false,
            hasSolped: formState.hasSolped || false,
            hasHem: formState.hasHem || false,
            hasHes: formState.hasHes || false,
            provider: formState.provider || "",
        };

        if (formState.statusId === 2 && formState.cartaAporteFile) {
            document = {
                file: formState.cartaAporteFile,
                documentType: documentsType.find((d:ITipoDocumento) => d.tipo_documento === "Carta de Aporte")?.id_tipo_documento || "",
                option: 'Tarea',
                task: selectedCompliance?.task.id || "",
                subtask: "",
            };
            console.log("Uploading Carta Aporte:", document);
            handleUploadFile(document);   
        }
        
        if (formState.statusId === 3 && formState.minutaFile) {
            document = {
                file: formState.minutaFile,
                documentType: documentsType.find((d:ITipoDocumento) => d.tipo_documento === "Minuta")?.id_tipo_documento || "",
                option: "Tarea",
                task: selectedCompliance?.task.id || "",
                subtask: "",
            };
            handleUploadFile(document);
        }
        
        onSave(compliance);
    };

    const dropdownItems = useMemo(() => ({
        statuses: complianceStatusNames || [],
    }), [complianceStatuses]);

    return {
        handleInputChange,
        handleSave,
        handleGetCompliance,
        handleGetRegistry,
        handleCartaAporteChange,
        handleMinutaChange,
        handleGetCarta,
        handleGetMinuta,
        formState,
        valleysName,
        faenasName,
        valleys,
        dropdownItems,
        complianceStatuses,
    };
}