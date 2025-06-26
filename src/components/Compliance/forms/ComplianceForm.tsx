import DropdownMenu from "@/components/Dropdown";
import { Button } from "@/components/ui/button";
import { useComplianceForm } from "../../../app/features/compliance/hooks/useComplianceForm";
import { IComplianceForm, IComplianceMemo, IComplianceSolped, IComplianceStatus } from "@/app/models/ICompliance";
import { useState, useEffect } from "react";
import { IDocumentList } from "@/app/models/IDocuments";

import CartaAporteFields from "./status-fields/CartaAporteFields";
import MinutaFields from "./status-fields/MinutaFields";
import MemorandumFields from "./status-fields/MemorandumFields";
import HemHesFields from "./status-fields/HEMHESFields";
import ComplianceSummary from "./status-fields/ComplianceSummary";

interface ComplianceFormProps {
    onSave: (compliance: Partial<IComplianceForm>) => void;
    onCancel: () => void;
    isEditing?: boolean;
    selectedCompliance?: IComplianceForm;
    userRole?: string;
}

export default function ComplianceForm({ 
    onSave, 
    onCancel, 
    isEditing = false, 
    selectedCompliance,
}: ComplianceFormProps) {
    const { 
        dropdownItems, 
        formState, 
        complianceStatuses, 
        handleSave, 
        handleInputChange, 
        handleCartaAporteChange, 
        handleMinutaChange, 
        handleGetCarta, 
        handleGetMinuta,
        handleGetSolped,
        handleGetMemo
    } = useComplianceForm(
        onSave, 
        isEditing, 
        selectedCompliance,
    );

    const [documents, setDocuments] = useState({
        carta: undefined as IDocumentList | undefined,
        minuta: undefined as IDocumentList | undefined
    });

    const [solped, setSolped] = useState<IComplianceSolped>();
    const [memo, setMemo] = useState<IComplianceMemo>();

    useEffect(() => {
        const fetchDocuments = async () => {
            if (selectedCompliance?.task.id) {
                const [cartaResult, minutaResult] = await Promise.all([
                    handleGetCarta(),
                    handleGetMinuta()
                ]);
                setDocuments({
                    carta: cartaResult,
                    minuta: minutaResult
                });
            }
        };
        const fetchSolpedMemo = async () => {
            if (selectedCompliance?.hasSolped && selectedCompliance?.registries?.[0]?.id) {
                const solpedMemo = await handleGetSolped(selectedCompliance?.registries?.[0]?.id);
                setSolped(solpedMemo);
            }
            else if (selectedCompliance?.hasMemo && selectedCompliance?.registries?.[0]?.id){
                const memo = await handleGetMemo(selectedCompliance?.registries?.[0]?.id);
                setMemo(memo);
            }
        }
        fetchSolpedMemo();
        fetchDocuments();
    }, [selectedCompliance]);

    const saveButtonText = isEditing ? "Actualizar" : "Guardar";
    
    const renderAdditionalFields = () => {
        if (!formState.statusId) return null;

        const currentStatus = complianceStatuses?.find(
            (status: IComplianceStatus) => status.id === formState.statusId
        );

        if (!currentStatus) return null;

        switch(currentStatus.id) {
            case 2: // Carta Aporte
                return <CartaAporteFields 
                    formState={formState} 
                    handleCartaAporteChange={handleCartaAporteChange} 
                />;
            
            case 3: // Minuta
                return <MinutaFields 
                    formState={formState}
                    cartaData={documents.carta}
                    handleMinutaChange={handleMinutaChange}
                />;
            
            case 4: // MEMORANDUM y/o SOLPED
                return <MemorandumFields 
                    formState={formState}
                    cartaData={documents.carta}
                    minutaData={documents.minuta}
                    handleInputChange={handleInputChange}
                />;
                
            case 5: // HEM/HES
                return <HemHesFields 
                    formState={formState}
                    cartaData={documents.carta}
                    minutaData={documents.minuta}
                    solpedData={solped}
                    memoData={memo}
                    handleInputChange={handleInputChange}
                />;
                
            case 6: // Resumen
                return <ComplianceSummary 
                    formState={formState}
                    cartaData={documents.carta}
                    minutaData={documents.minuta}
                    solpedData={solped}
                    memoData={memo}
                />;
                
            default:
                return null;
        }
    };

    const isFormValid = () => {
        const baseValidation = formState.statusId;
        
        if (!baseValidation) return false;
        
        switch(formState.statusId) {
            case 2: return !!formState.cartaAporteFile;
            case 3: return !!formState.minutaFile;
            case 4: return !!(formState.hasMemo || formState.hasSolped);
            case 5: return !!(formState.hasHem || formState.hasHes) && !!formState.provider;
            default: return true;
        }
    };

    return (
        <div data-test-id="compliance-form" className="max-h-[70vh] overflow-y-auto font-[Helvetica]">
            <h2 className="text-lg font-semibold mb-4">Compliance</h2>
            
            <div className="space-y-4 mb-6">
                <div className="truncate">
                    <label className="block text-sm font-medium mb-1">Iniciativa</label>
                    <input
                        type="text"
                        value={formState.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        data-test-id="compliance-name-input"
                        disabled={true} 
                    />
                </div>

                <div className="truncate">
                    <label className="block text-sm font-medium mb-1">Descripción</label>
                    <input
                        type="text"
                        value={formState.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        data-test-id="compliance-description-input"
                        disabled={true} 
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Estado</label>
                    <DropdownMenu
                        buttonText="Seleccionar Estado"
                        items={dropdownItems.statuses}
                        onSelect={(value) => handleInputChange('statusId', value)}
                        isInModal={true}
                        selectedValue={selectedCompliance?.status ? dropdownItems.statuses.find((status:string) => status === selectedCompliance.status.name) : ""}
                        disabled={true}
                        data-test-id="compliance-status-dropdown" 
                    />
                </div>
            </div>
            
            {renderAdditionalFields()}
            
            <div className="flex justify-end space-x-2">
                <Button
                    variant="secondary"
                    onClick={onCancel}
                    className="bg-gray-200 hover:bg-gray-300 cursor-pointer"
                    data-test-id="cancel-button"
                >
                    Cancelar
                </Button>
                <Button
                    variant="default"
                    onClick={handleSave}
                    disabled={!isFormValid()}
                    className="bg-[#0068D1] hover:bg-[#0056A3] text-white disabled:bg-[#747474c6]"
                    data-test-id="save-button"
                >
                    {formState.statusId !== undefined && formState.statusId >= 2 && formState.statusId < 6 ? 
                        "Guardar y Avanzar" : saveButtonText}
                </Button>
            </div>

            {formState.statusId !== undefined && formState.statusId >= 2 && formState.statusId < 6 && (
                <div className="text-xs text-blue-600 mt-1">
                    Al guardar, avanzará automáticamente al siguiente estado.
                </div>
            )}
        </div>
    );
}