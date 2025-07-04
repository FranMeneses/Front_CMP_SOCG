import DropdownMenu from "@/components/Dropdown";
import { Button } from "@/components/ui/button";
import { useComplianceForm } from "../../../app/features/compliance/hooks/useComplianceForm";
import { IComplianceForm, IComplianceStatus } from "@/app/models/ICompliance";
import { useState, useEffect } from "react";
import { IDocumentList } from "@/app/models/IDocuments";
import { FileUploadButton } from "@/components/Documents/FileUploadButton";
import { FileText } from "lucide-react";

import CartaAporteFields from "./status-fields/CartaAporteFields";
import MinutaFields from "./status-fields/MinutaFields";
import HemHesFields from "./status-fields/HEMHESFields";
import ComplianceSummary from "./status-fields/ComplianceSummary";
import { Info } from "lucide-react";
import AuthorizationFields from "./status-fields/AuthorizationFields";
import MemoSolpedFields from "./status-fields/MemoSolpedFields";

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
        handleDonationFormChange,
        handleAuthorizationChange,
        handleMemoSolpedTypeChange,
        handleMemoSolpedFileChange,
        handleTransferFileChange,
        handleHesHemFileChange,
        handleGetFormulario,
        handleGetAutorizacion,
        handleGetTransferencia,
        handleGetComprobante,
        isUploading,
    } = useComplianceForm(
        onSave, 
        isEditing, 
        selectedCompliance,
    );

    const [documents, setDocuments] = useState({
        formulario: undefined as IDocumentList | undefined,
        carta: undefined as IDocumentList | undefined,
        minuta: undefined as IDocumentList | undefined,
        autorizacion: undefined as IDocumentList | undefined,
        transferencia: undefined as IDocumentList | undefined,
        comprobante: undefined as IDocumentList | undefined
    });

    useEffect(() => {
        const fetchDocuments = async () => {
            if (selectedCompliance?.task.id) {
                const [
                    formularioResult,
                    cartaResult,
                    minutaResult,
                    autorizacionResult,
                    transferenciaResult,
                    comprobanteResult
                ] = await Promise.all([
                    handleGetFormulario(),
                    handleGetCarta(),
                    handleGetMinuta(),
                    handleGetAutorizacion(),
                    handleGetTransferencia(),
                    handleGetComprobante()
                ]);
                setDocuments({
                    formulario: formularioResult,
                    carta: cartaResult,
                    minuta: minutaResult,
                    autorizacion: autorizacionResult,
                    transferencia: transferenciaResult,
                    comprobante: comprobanteResult
                });
            }
        };
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
            case 8: // Carta Aporte
                return <CartaAporteFields 
                    formState={formState} 
                    handleCartaAporteChange={handleCartaAporteChange} 
                    documents={documents}
                />;
                
            case 9: // Minuta
                return <MinutaFields 
                    formState={formState}
                    cartaData={documents.carta}
                    handleMinutaChange={handleMinutaChange}
                    documents={documents}
                />;
            
            case 10: // Autorización
                return <AuthorizationFields
                    formState={formState}
                    handleAuthorizationChange={handleAuthorizationChange}
                    documents={documents}
                />;
            
            case 11: // Transferencia/Orden de Compra, MEMO o SOLPED
                return <MemoSolpedFields
                    formState={formState}
                    handleMemoSolpedTypeChange={handleMemoSolpedTypeChange}
                    handleMemoSolpedFileChange={handleMemoSolpedFileChange}
                    handleInputChange={handleInputChange}
                    documents={documents}
                />;
                
            case 12: // HEM/HES
                return <HemHesFields 
                    formState={formState}
                    cartaData={documents.carta}
                    minutaData={documents.minuta}
                    handleInputChange={handleInputChange}
                    handleTransferFileChange={handleTransferFileChange}
                    handleHesHemFileChange={handleHesHemFileChange}
                    documents={documents}
                />;
                
            case 13: // Resumen
                return <ComplianceSummary 
                    formState={formState}
                    cartaData={documents.carta}
                    minutaData={documents.minuta}
                />;
                
            default:
                return null;
        }
    };

    const isFormValid = () => {
        const baseValidation = formState.statusId;
        
        if (!baseValidation) return false;
        
        switch(formState.statusId) {
            case 7: return !!formState.donationFormFile;
            case 8: return !!formState.cartaAporteFile;
            case 9: return !!(formState.minutaFile);
            case 10: return !!(formState.authorizationFile);
            case 11: return !!(formState.transferPurchaseOrderFile);
            case 12: return !!(formState.hesHem);
            default: return true;
        }
    };

    return (
        <div data-test-id="compliance-form" className="max-h-[70vh] overflow-y-auto font-[Helvetica]">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">
                    Compliance
                </h2>
            </div>

            <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Información General
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="block text-xs font-medium mb-1">Iniciativa</label>
                        <input
                            type="text"
                            value={formState.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="form-input"
                            data-test-id="compliance-name-input"
                            disabled={true}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-medium mb-1">Descripción</label>
                        <input
                            type="text"
                            value={formState.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="form-input"
                            data-test-id="compliance-description-input"
                            disabled={true}
                        />
                    </div>
                    <div className="space-y-1 col-span-2">
                        <label className="block text-xs font-medium mb-1">Estado</label>
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
                    {!documents.formulario && (
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4 col-span-2">
                          <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                              <FileText className="h-4 w-4 mr-2" />
                              Subir Formulario de Donaciones
                          </h3>
                          <div className="flex items-center">
                              <FileUploadButton onFileChange={handleDonationFormChange} disabled={false} />
                              {formState.donationFormFile && (
                                  <span className="ml-2 text-sm text-gray-600">
                                      {formState.donationFormFile.name}
                                  </span>
                              )}
                          </div>
                      </div>
                    )}
                </div>
            </div>

            {renderAdditionalFields()}
            
            <div className="flex justify-end space-x-2 mt-2">
                <Button
                    variant="secondary"
                    onClick={onCancel}
                    className="bg-gray-200 hover:bg-gray-300 cursor-pointer"
                    data-test-id="cancel-button"
                    disabled={isUploading}
                >
                    Cancelar
                </Button>
                {formState.statusId && formState.statusId >= 7 && formState.statusId <= 12 && (
                    <Button
                        variant="default"
                        onClick={handleSave}
                        disabled={!isFormValid() || isUploading}
                        className="bg-[#0068D1] hover:bg-[#0056A3] text-white disabled:bg-[#747474c6] cursor-pointer"
                        data-test-id="save-button"
                    >
                        {isUploading ? 'Subiendo...' : 'Guardar y Avanzar'}
                    </Button>
                )}
                {(!formState.statusId || formState.statusId < 7 || formState.statusId > 12) && (
                    <Button
                        variant="default"
                        onClick={handleSave}
                        disabled={!isFormValid() || isUploading}
                        className="bg-[#0068D1] hover:bg-[#0056A3] text-white disabled:bg-[#747474c6] cursor-pointer"
                        data-test-id="save-button"
                    >
                        {isUploading ? 'Subiendo...' : saveButtonText}
                    </Button>
                )}
                {formState.statusId === 13 && (
                    <Button
                        variant="default"
                        onClick={onCancel}
                        className="bg-[#0068D1] hover:bg-[#0056A3] text-white cursor-pointer"
                        data-test-id="close-button"
                        disabled={isUploading}
                    >
                        Cerrar
                    </Button>
                )}
            </div>

            {formState.statusId !== undefined && formState.statusId >= 2 && formState.statusId < 6 && (
                <div className="text-xs text-blue-600 mt-1">
                    Al guardar, avanzará automáticamente al siguiente estado.
                </div>
            )}
        </div>
    );
}