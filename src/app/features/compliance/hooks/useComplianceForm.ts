import { useState, useEffect, useMemo } from "react";
import { useHooks } from "../../hooks/useHooks";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_COMPLIANCE, GET_COMPLIANCE_STATUSES } from "@/app/api/compliance";
import { IComplianceForm, IComplianceStatus } from "@/app/models/ICompliance";
import { GET_ALL_DOCUMENT_TYPES, GET_DOCUMENT_BY_TASK_AND_TYPE } from "@/app/api/documents";
import { ITipoDocumento } from "@/app/models/IDocuments";
import { useDocumentsPage } from "../../documents/hooks/useDocumentsPage";
import { FormData } from "../../documents/hooks/useDocumentForms";

interface ComplianceFormState {
    name: string;
    description: string;
    statusId: number;
    donationFormFile: File | null;
    cartaAporteFile: File | null;
    minutaFile: File | null;
    authorizationFile: File | null;
    transferPurchaseOrderFile: File | null;
    hesHem: File | null;
    memoAmount?: number;
    solpedAccount?: number;
    solpedCECO?: number;
    solpedAmount?: number;
    solpedMemoSap?: number;
    hesHemSap?: number;
    // Memo/Solped
    memoSolpedType?: "MEMO" | "SOLPED";
    transferFile?: File | null;
}

export const useComplianceForm = (
    onSave: (compliance: Partial<IComplianceForm>) => void,
    isEditing?: boolean,
    selectedCompliance?: IComplianceForm,
) => {
    const [formState, setFormState] = useState<ComplianceFormState>({
        name: "",
        description: "",
        statusId: 0,
        donationFormFile: null,
        cartaAporteFile: null,
        minutaFile: null,
        authorizationFile: null,
        transferPurchaseOrderFile: null,
        hesHem: null,
        memoAmount: undefined,
        solpedAccount: undefined,
        solpedCECO: undefined,
        solpedAmount: undefined,
        solpedMemoSap: undefined,
        hesHemSap: undefined,
        memoSolpedType: undefined,
        transferFile: undefined,
    });
    const [isUploading, setIsUploading] = useState(false);

    const {data: complianceStatusData } = useQuery(GET_COMPLIANCE_STATUSES);
    const {data: documentsTypeData } = useQuery(GET_ALL_DOCUMENT_TYPES);

    const complianceStatuses = complianceStatusData?.getAllComplianceStatuses || [];
    const documentsType: ITipoDocumento[] = documentsTypeData?.getAllDocumentTypes || [];
    const complianceStatusNames = complianceStatuses.map((status: IComplianceStatus) => status.name);

    const [getCompliance] = useLazyQuery(GET_COMPLIANCE);
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
            const tipo = documentsType.find((d: ITipoDocumento) => d.tipo_documento === "Carta de Aporte")?.id_tipo_documento || "";
            const { data } = await getDocument({
                variables: {
                    taskId: selectedCompliance?.task.id || "",
                    documentType: tipo
                }
            });
            return data.documentByTaskAndType;
        }
        catch (error) {
            console.error("Error al obtener carta de aporte:", error);
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
            return data.findOneCompliance;
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
            cartaAporteFile: file
        });
    };

    /**
     * Función que maneja el cambio del archivo de minuta.
     * @param {File} file - Archivo de minuta seleccionado.
     */
    const handleMinutaChange = (file: File) => {
        setFormState({
            ...formState,
            minutaFile: file
        });
    };

    /**
     * Handler para el archivo PDF de Formulario de Donaciones
     */
    const handleDonationFormChange = (file: File) => {
        setFormState((prev) => ({
            ...prev,
            donationFormFile: file,
        }));
    };

    /**
     * Handler para el archivo de Autorización
     */
    const handleAuthorizationChange = (file: File) => {
        setFormState((prev) => ({
            ...prev,
            authorizationFile: file,
        }));
    };

    /**
     * Handler para el archivo de Transferencia/Orden de Compra
     */
    const handleTransferPurchaseOrderChange = (file: File) => {
        setFormState((prev) => ({
            ...prev,
            transferPurchaseOrderFile: file,
        }));
    };

    /**
     * Hook que se ejecuta al iniciar el componente para cargar los datos de cumplimiento si se está editando.
     */
    useEffect(() => {
        if (isEditing && selectedCompliance) {
            setFormState({
                name: selectedCompliance.task.name || "",
                description: selectedCompliance.task.description || "",
                statusId: selectedCompliance.statusId || 0,
                donationFormFile: null,
                cartaAporteFile: null,
                minutaFile: null,
                authorizationFile: null,
                transferPurchaseOrderFile: null,
                hesHem: null,
                memoAmount: selectedCompliance.valor,
                solpedAccount: selectedCompliance.cuenta,
                solpedCECO: selectedCompliance.ceco,
                solpedAmount: undefined,
                solpedMemoSap: selectedCompliance.solpedMemoSap,
                hesHemSap: selectedCompliance.hesHemSap,
                memoSolpedType: selectedCompliance.ceco ? "SOLPED" : "MEMO",
                transferFile: undefined,
            }); 
        }
    }, [isEditing, selectedCompliance]);

    /**
     * Función que maneja el cambio de los campos del formulario.
     * @param field - Nombre del campo que se está modificando
     * @param value - Nuevo valor para el campo
     */
    const handleInputChange = (field: keyof ComplianceFormState | string, value: string | number | boolean | File | null | undefined) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    };

    /**
     * Función que maneja el guardado de los datos del formulario.
     * @description Esta función valida los campos requeridos y prepara los datos para ser enviados al servidor.
     */
    const handleSave = async () => {
        let compliance = {};
        let document: FormData;
        let nextStatusId = formState.statusId;
        if (formState.statusId >= 7 && formState.statusId <= 12) {
            if (
                (formState.statusId === 7 && formState.donationFormFile) ||
                (formState.statusId === 8 && formState.cartaAporteFile) ||
                (formState.statusId === 9 && formState.minutaFile) ||
                (formState.statusId === 10 && formState.authorizationFile) ||
                (formState.statusId === 11 && formState.transferPurchaseOrderFile) ||
                (formState.statusId === 12 && formState.hesHem)
            ) {
                nextStatusId = formState.statusId + 1;
            }
        }
        compliance = {
            task: {
                name: formState.name,
                description: formState.description,
            },
            statusId: nextStatusId,
        };
        // Validación de campos requeridos para Memo/Solped
        if (formState.statusId === 11 && formState.memoSolpedType) {
            if (formState.memoSolpedType === "MEMO") {
                if (!formState.memoAmount || !formState.solpedMemoSap) {
                    console.error("Faltan campos requeridos para MEMO");
                    return;
                }
            }
            if (formState.memoSolpedType === "SOLPED") {
                if (!formState.memoAmount || !formState.solpedMemoSap || !formState.solpedCECO || !formState.solpedAccount) {
                    console.error("Faltan campos requeridos para SOLPED");
                    return;
                }
            }
        }
        // Agregar datos de Memo/Solped si corresponde
        if (formState.statusId === 11 && formState.memoSolpedType) {
            compliance = {
                ...compliance,
                memoSolpedType: formState.memoSolpedType,
                memoAmount: formState.memoAmount,
                solpedMemoSap: formState.solpedMemoSap,
                solpedCECO: formState.memoSolpedType === "SOLPED" ? formState.solpedCECO : undefined,
                solpedAccount: formState.memoSolpedType === "SOLPED" ? formState.solpedAccount : undefined,
            };
        }
        // Agregar datos de HEM/HES si corresponde
        if (formState.statusId === 12) {
            compliance = {
                ...compliance,
                hesHemSap: formState.hesHemSap,
            };
        }
        // Subida de archivos según el estado
        try {
            setIsUploading(true);
            if (formState.statusId === 7 && formState.donationFormFile) {
                document = {
                    file: formState.donationFormFile,
                    documentType: documentsType.find((d: ITipoDocumento) => d.tipo_documento === "Formulario de Aportes")?.id_tipo_documento || "",
                    task: selectedCompliance?.task.id || "",
                };
                await handleUploadFile(document);
            }
            if (formState.statusId === 8 && formState.cartaAporteFile) {
                document = {
                    file: formState.cartaAporteFile,
                    documentType: documentsType.find((d: ITipoDocumento) => d.tipo_documento === "Carta de Aporte")?.id_tipo_documento || "",
                    task: selectedCompliance?.task.id || "",
                };
                await handleUploadFile(document);
            }
            if (formState.statusId === 9 && formState.minutaFile) {
                document = {
                    file: formState.minutaFile,
                    documentType: documentsType.find((d: ITipoDocumento) => d.tipo_documento === "Minuta")?.id_tipo_documento || "",
                    task: selectedCompliance?.task.id || "",
                };
                await handleUploadFile(document);
            }
            if (formState.statusId === 10 && formState.authorizationFile) {
                document = {
                    file: formState.authorizationFile,
                    documentType: documentsType.find((d: ITipoDocumento) => d.tipo_documento === "Autorización")?.id_tipo_documento || "",
                    task: selectedCompliance?.task.id || "",
                };
                await handleUploadFile(document);
            }
            if (formState.statusId === 11 && formState.transferPurchaseOrderFile) {
                document = {
                    file: formState.transferPurchaseOrderFile,
                    documentType: documentsType.find((d: ITipoDocumento) => d.tipo_documento === "Transferencia/Orden de Compra")?.id_tipo_documento || "",
                    task: selectedCompliance?.task.id || "",
                };
                await handleUploadFile(document);
            }
        } finally {
            setIsUploading(false);
        }
        onSave(compliance);
    };

    const dropdownItems = useMemo(() => ({
        statuses: complianceStatusNames || [],
    }), [complianceStatuses]);

    // Handler para cambiar el tipo de Memo/Solped
    const handleMemoSolpedTypeChange = (type: "MEMO" | "SOLPED") => {
        setFormState((prev) => ({
            ...prev,
            memoSolpedType: type,
        }));
    };

    // Handler para cambiar el archivo de Memo/Solped
    const handleMemoSolpedFileChange = (file: File) => {
        setFormState((prev) => ({
            ...prev,
            memoSolpedFile: file,
        }));
    };

    // Handler para archivo de comprobante de transferencia (MEMO)
    const handleTransferFileChange = (file: File) => {
        setFormState((prev) => ({
            ...prev,
            transferFile: file,
        }));
    };

    // Handler para archivo de HEM/HES (SOLPED)
    const handleHesHemFileChange = (file: File) => {
        setFormState((prev) => ({
            ...prev,
            hesHem: file,
        }));
    };

    /**
     * Función que obtiene el Formulario de Donaciones asociado a la tarea de cumplimiento.
     */
    const handleGetFormulario = async () => {
        try {
            const tipo = documentsType.find((d: ITipoDocumento) => d.tipo_documento === "Formulario de Aportes")?.id_tipo_documento || "";
            const { data } = await getDocument({
                variables: {
                    taskId: selectedCompliance?.task.id || "",
                    documentType: tipo
                }
            });
            return data.documentByTaskAndType;
        } catch (error) {
            console.error("Error al obtener Formulario de Donaciones:", error);
            return null;
        }
    };

    /**
     * Función que obtiene la Autorización asociada a la tarea de cumplimiento.
     */
    const handleGetAutorizacion = async () => {
        try {
            const tipo = documentsType.find((d: ITipoDocumento) => d.tipo_documento === "Autorización")?.id_tipo_documento || "";
            const { data } = await getDocument({
                variables: {
                    taskId: selectedCompliance?.task.id || "",
                    documentType: tipo
                }
            });
            return data.documentByTaskAndType;
        } catch (error) {
            console.error("Error al obtener Autorización:", error);
            return null;
        }
    };

    /**
     * Función que obtiene la Transferencia/Orden de Compra asociada a la tarea de cumplimiento.
     */
    const handleGetTransferencia = async () => {
        try {
            const tipo = documentsType.find((d: ITipoDocumento) => d.tipo_documento === "Transferencia/Orden de Compra")?.id_tipo_documento || "";
            const { data } = await getDocument({
                variables: {
                    taskId: selectedCompliance?.task.id || "",
                    documentType: tipo
                }
            });
            return data.documentByTaskAndType;
        } catch (error) {
            console.error("Error al obtener Transferencia/Orden de Compra:", error);
            return null;
        }
    };

    /**
     * 
     */
    const handleGetComprobante = async () => {
        try {
            const tipo = documentsType.find((d: ITipoDocumento) => d.tipo_documento === "Comprobante transferencia/HES/HEM")?.id_tipo_documento || "";
            const { data } = await getDocument({
                variables: {
                    taskId: selectedCompliance?.task.id || "",
                    documentType: tipo
                }
            });
            return data.documentByTaskAndType;
        } catch (error) {
            console.error("Error al obtener Comprobante transferencia/HES/HEM:", error);
            return null;
        }
    }

    return {
        handleInputChange,
        handleSave,
        handleGetCompliance,
        handleCartaAporteChange,
        handleMinutaChange,
        handleGetCarta,
        handleGetMinuta,
        handleDonationFormChange,
        handleAuthorizationChange,
        handleTransferPurchaseOrderChange,
        handleMemoSolpedTypeChange,
        handleMemoSolpedFileChange,
        handleTransferFileChange,
        handleHesHemFileChange,
        handleGetFormulario,
        handleGetAutorizacion,
        handleGetTransferencia,
        handleGetComprobante,
        isUploading,
        formState,
        valleysName,
        faenasName,
        valleys,
        dropdownItems,
        complianceStatuses,
    };
}