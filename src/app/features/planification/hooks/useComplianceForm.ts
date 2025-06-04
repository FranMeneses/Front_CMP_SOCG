import { useState, useEffect, useMemo } from "react";
import { useHooks } from "../../hooks/useHooks";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_COMPLIANCE_REGISTRIES, GET_COMPLIANCE_STATUSES, GET_TASK_COMPLIANCE } from "@/app/api/compliance";
import { ICompliance, IComplianceForm, IComplianceStatus } from "@/app/models/ICompliance";

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

    const complianceStatuses = complianceStatusData?.getAllComplianceStatuses || [];
    const complianceStatusNames = complianceStatuses.map((status: IComplianceStatus) => status.name);

    const [getCompliance] = useLazyQuery(GET_TASK_COMPLIANCE);
    const [getRegistry] = useLazyQuery(GET_COMPLIANCE_REGISTRIES);

    const { valleysName, faenasName, valleys } = useHooks();

    const handleGetCompliance = async (id: string) => {
        try{
            const { data } = await getCompliance({
                variables: { taskId: id }
            });
            return data.getTaskCompliance;
        }
        catch (error) {
            console.error("Error fetching compliance data:", error);
            return null;
        }
    };

    const handleCartaAporteChange = (file: File) => {
        setFormState({
            ...formState,
            cartaAporteFile: file
        });
    };

    const handleMinutaChange = (file: File) => {
        setFormState({
            ...formState,
            minutaFile: file
        });
    };

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

    useEffect(() => {
        if (isEditing && selectedCompliance) {
            setFormState({
                name: selectedCompliance.task.name || "",
                description: selectedCompliance.task.description || "",
                valleyId: selectedCompliance.task.valleyId !== undefined && selectedCompliance.task.valleyId !== null ? String(selectedCompliance.task.valleyId) : "",
                faenaId: selectedCompliance.task.faenaId !== undefined && selectedCompliance.task.faenaId !== null ? String(selectedCompliance.task.faenaId) : "",
                processId: selectedCompliance.task.processId !== undefined && selectedCompliance.task.processId !== null ? String(selectedCompliance.task.processId) : "",
                statusId: selectedCompliance.statusId || 0,
                cartaAporte: selectedCompliance.cartaAporteObs || false,
                cartaAporteFile: null,
                minuta: selectedCompliance.minutaObs || false,
                minutaFile: null,
                hasMemo: selectedCompliance.hasMemo || false,
                hasSolped: selectedCompliance.hasSolped || false,
                hasHem: selectedCompliance.hasHem || false,
                hasHes: selectedCompliance.hasHes || false,
                provider: selectedCompliance.provider || "",
            });
        }
    }, [isEditing, selectedCompliance]);

    const handleInputChange = (field: string, value: any) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        let compliance = {}
        compliance = {
            task: {
                name: formState.name,
                description: formState.description,
                valleyId: formState.valleyId ? parseInt(formState.valleyId) : null,
                faenaId: formState.faenaId ? parseInt(formState.faenaId) : null,
                processId: formState.processId ? parseInt(formState.processId) : null,
            },
            statusId: complianceStatuses.find((status:IComplianceStatus) => status.name === String(formState.statusId))?.id || 0,
            applies: true, 
            cartaAporteObs: formState.cartaAporte || false,
            minutaObs: formState.minuta || false,
            hasMemo: formState.hasMemo || false,
            hasSolped: formState.hasSolped || false,
            hasHem: formState.hasHem || false,
            hasHes: formState.hasHes || false,
            provider: formState.provider || "",
        };
        console.log(formState);
        onSave(compliance);
    };

    const dropdownItems = useMemo(() => ({
        statuses: complianceStatusNames || [],
    }), [complianceStatuses]);

    return {
        formState,
        handleInputChange,
        handleSave,
        handleGetCompliance,
        handleGetRegistry,
        handleCartaAporteChange,
        handleMinutaChange,
        valleysName,
        faenasName,
        valleys,
        dropdownItems,
        complianceStatuses,
    };
}