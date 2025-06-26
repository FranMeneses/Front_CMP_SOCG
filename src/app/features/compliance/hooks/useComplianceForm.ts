import { useState, useEffect, useMemo } from "react";
import { useHooks } from "../../hooks/useHooks";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GET_COMPLIANCE, GET_COMPLIANCE_REGISTRIES, GET_COMPLIANCE_STATUSES } from "@/app/api/compliance";
import { IComplianceForm, IComplianceStatus, IMemo, ISolped } from "@/app/models/ICompliance";
import { GET_ALL_DOCUMENT_TYPES, GET_DOCUMENT_BY_TASK_AND_TYPE } from "@/app/api/documents";
import { ITipoDocumento } from "@/app/models/IDocuments";
import { useDocumentsPage } from "../../documents/hooks/useDocumentsPage";
import { FormData } from "../../documents/hooks/useDocumentForms";
import { CREATE_SOLPED, GET_REGISTRY_SOLPED } from "@/app/api/solped";
import { CREATE_MEMO, GET_REGISTRY_MEMO } from "@/app/api/memo";

interface ComplianceFormState extends Partial<IComplianceForm> {
    name: string;
    description: string;
    valleyId: string;
    faenaId: string;
    processId: string;
    cartaAporteFile: File | null;
    minutaFile: File | null;
    memoAmount?: number;
    solpedCECO?: number;
    solpedAccount?: number;
    solpedAmount?: number;
}

type FormFieldValue = string | number | boolean | File | null | undefined;

export const useComplianceForm = (
    onSave: (compliance: Partial<IComplianceForm>) => void,
    isEditing?: boolean,
    selectedCompliance?: IComplianceForm,
) => {
    const [formState, setFormState] = useState<ComplianceFormState>({
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
        memoAmount: undefined,
        solpedAccount: undefined,
        solpedCECO: undefined,
        solpedAmount: undefined,
        solpedMemoSap: undefined,
        hesHemSap: undefined,
    });

    const {data: complianceStatusData } = useQuery(GET_COMPLIANCE_STATUSES);
    const {data: documentsTypeData } = useQuery(GET_ALL_DOCUMENT_TYPES);

    const complianceStatuses = complianceStatusData?.getAllComplianceStatuses || [];
    const documentsType: ITipoDocumento[] = documentsTypeData?.getAllDocumentTypes || [];
    const complianceStatusNames = complianceStatuses.map((status: IComplianceStatus) => status.name);

    const [getCompliance] = useLazyQuery(GET_COMPLIANCE);
    const [getRegistry] = useLazyQuery(GET_COMPLIANCE_REGISTRIES);
    const [getDocument] = useLazyQuery(GET_DOCUMENT_BY_TASK_AND_TYPE);
    const [getSolped] = useLazyQuery(GET_REGISTRY_SOLPED);
    const [getMemo] = useLazyQuery(GET_REGISTRY_MEMO);

    const [createSolped] = useMutation(CREATE_SOLPED);
    const [createMemo] = useMutation(CREATE_MEMO);

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
     * Función que obtiene la Solped asociada a un registro de cumplimiento.	
     * @description Esta función realiza una consulta para obtener la Solped asociada al registro de cumplimiento especificado.
     * @param registryId ID del registro de cumplimiento para el cual se desea obtener la Solped.
     * @returns 
     */
    const handleGetSolped = async (registryId: string) => {
        try {
            const { data } = await getSolped({
                variables: {
                    registryId
                }
            });
            return data.getRegistrySolped;
        }
        catch (error) {
            console.error("Error fetching Solped:", error);
            return null;
        }
    };

    /**
     * Función que obtiene el Memo asociado a un registro de cumplimiento.
     * @description Esta función realiza una consulta para obtener el Memo asociado al registro de cumplimiento especificado.
     * @param registryId ID del registro de cumplimiento para el cual se desea obtener el Memo.
     * @returns 
     */
    const handleGetMemo = async (registryId: string) => {
        try {
            const { data } = await getMemo({
                variables: {
                    registryId
                }
            });
            return data.getRegistryMemo;
        }
        catch (error) {
            console.error("Error fetching Memo:", error);
            return null;
        }
    };

    /**
     * Función para crear una Solped.
     * @description Esta función utiliza la mutación `createSolped` para crear una nueva Solped asociada a la tarea de cumplimiento seleccionada.
     * @param solpedData Datos necesarios para crear una Solped.
     * @returns 
     */
    const handleCreateSolped = async (solpedData: ISolped) => {
        try {
            const { data } = await createSolped({
                variables: {
                    input: {
                        registryId: solpedData.registryId,
                        ceco: Number(solpedData.ceco),
                        account: Number(solpedData.account),
                        value: Number(solpedData.value),
                    }
                }
            });
            return data.createSolped;
        }
        catch (error) {
            console.error("Error creating Solped:", error);
            return null;
        }
    };

    /**
     * Función para crear un Memo.
     * @description Esta función utiliza la mutación `createMemo` para crear un nuevo Memo asociado a la tarea de cumplimiento seleccionada.
     * @param memoData Datos necesarios para crear un Memo.
     * @returns 
     */
    const handleCreateMemo = async (memoData: IMemo) => {
        try {
            const { data } = await createMemo({
                variables: {
                    input: {
                        registryId: memoData.registryId,
                        value: memoData.value,
                    }
                }
            });
            return data.createMemo;
        }
        catch (error) {
            console.error("Error creating Memo:", error);
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
     * Función que obtiene los registros de cumplimiento asociados a un compliance específico.
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
                solpedMemoSap: selectedCompliance.solpedMemoSap || undefined,
                hesHemSap: selectedCompliance.hesHemSap || undefined,
                hasHem: selectedCompliance.hasHem || false,
                hasHes: selectedCompliance.hasHes || false,
                provider: selectedCompliance.provider || "",
            }); 
        }
    }, [isEditing, selectedCompliance]);

    /**
     * Función que maneja el cambio de los campos del formulario.
     * @param field - Nombre del campo que se está modificando
     * @param value - Nuevo valor para el campo
     */
    const handleInputChange = (field: keyof ComplianceFormState, value: FormFieldValue) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    };

    /**
     * Función que maneja el guardado de los datos del formulario.
     * @description Esta función valida los campos requeridos y prepara los datos para ser enviados al servidor.
     */
    const handleSave = async () => {
        const registry = await handleGetRegistry(selectedCompliance?.id || "");
        let compliance = {};
        let document: FormData;
        
        if (typeof formState.statusId === "string") {
            formState.statusId = complianceStatuses.find((status: IComplianceStatus) => status.name === String(formState.statusId))?.id || 0;
        }

        let nextStatusId = formState.statusId;
        
        if (formState.statusId ? formState.statusId >= 2 && formState.statusId < 6 : 0) {
            if (
                (formState.statusId === 2 && formState.cartaAporteFile) ||
                (formState.statusId === 3 && formState.minutaFile) ||
                (formState.statusId === 5 && (formState.hasHem || formState.hasHes) && formState.provider)
            ) {
                nextStatusId = formState.statusId + 1;
            }
            else if (formState.statusId === 4 && formState.hasMemo) {
                nextStatusId = formState.statusId + 2; 
            }
            else if (formState.statusId === 4 && formState.hasSolped) {
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
            cartaAporte: formState.cartaAporte || false,
            minuta: formState.minuta || false,
            hasMemo: formState.hasMemo || false,
            hasSolped: formState.hasSolped || false,
            hasHem: formState.hasHem || false,
            hasHes: formState.hasHes || false,
            provider: formState.provider || "",
            registryId: registry[0]?.id || "",
        };

        if (formState.statusId === 2 && formState.cartaAporteFile) {
            document = {
                file: formState.cartaAporteFile,
                documentType: documentsType.find((d:ITipoDocumento) => d.tipo_documento === "Carta de Aporte")?.id_tipo_documento || "",
                task: selectedCompliance?.task.id || "",
            };
            handleUploadFile(document);   
        }
        
        if (formState.statusId === 3 && formState.minutaFile) {
            document = {
                file: formState.minutaFile,
                documentType: documentsType.find((d:ITipoDocumento) => d.tipo_documento === "Minuta")?.id_tipo_documento || "",
                task: selectedCompliance?.task.id || "",
            };
            handleUploadFile(document);
        }
        
        if (formState.hasMemo && formState.statusId === 4) {
            const value = Number(formState.memoAmount);
            const memoData = {
                registryId: registry[0]?.id || "",
                value: value,
            };
            await handleCreateMemo(memoData);
            compliance = {
                ...compliance,
                endDate: new Date().toISOString(),
            };
        }

        if (formState.hasSolped && formState.statusId === 4) {
            const value = Number(formState.solpedAmount);
            const ceco = Number(formState.solpedCECO);
            const account = Number(formState.solpedAccount);
            const solpedData = {
                registryId: registry[0]?.id || "",
                ceco: ceco,
                account: account,
                value: value,
            };
            await handleCreateSolped(solpedData);
            compliance = {
                ...compliance,
                solpedMemoSap: Number(formState.solpedMemoSap) || 0,
            };
            
        }

        if (formState.statusId === 5) {
            compliance = {
                ...compliance,
                endDate: new Date().toISOString(),
                hesHemSap: Number(formState.hesHemSap) || 0,
            };
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
        handleGetSolped,
        handleGetMemo,
        formState,
        valleysName,
        faenasName,
        valleys,
        dropdownItems,
        complianceStatuses,
    };
}