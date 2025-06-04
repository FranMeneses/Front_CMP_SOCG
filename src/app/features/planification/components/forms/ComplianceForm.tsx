import DropdownMenu from "@/components/Dropdown";
import { Button } from "@/components/ui/button";
import { useComplianceForm } from "@/app/features/planification/hooks/useComplianceForm";
import { IComplianceForm, IComplianceStatus,  } from "@/app/models/ICompliance";
import { FileUploadButton } from "@/app/features/documents/components/FileUploadButton";
import { useDocumentForms } from "@/app/features/documents/hooks/useDocumentForms";

interface ComplianceFormProps {
    onSave: any;
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
    userRole
}: ComplianceFormProps) {

    const { dropdownItems, formState, handleSave, handleInputChange, complianceStatuses, handleCartaAporteChange, handleMinutaChange } = useComplianceForm(
        onSave, 
        isEditing, 
        selectedCompliance,
        userRole
    );

    const saveButtonText = isEditing ? "Actualizar" : "Guardar";

    const renderAdditionalFields = () => {
        if (!formState.statusId) return null;

        const currentStatus = complianceStatuses?.find(
            (status: IComplianceStatus) => status.id === formState.statusId
        );

        if (!currentStatus) return null;

        switch(currentStatus.id) {
            case 2: // Carta Aporte
                return (
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Subir Carta Aporte</label>
                    <div className="flex items-center">
                        <FileUploadButton onFileChange={handleCartaAporteChange} />
                        {formState.cartaAporteFile && (
                            <span className="ml-2 text-sm text-gray-600">
                                {formState.cartaAporteFile.name}
                            </span>
                        )}
                    </div>
                </div>
                );
            
            case 3: // Minuta
                return (
                    <>
                        {/* Mostrar siempre la información de la carta de aporte */}
                        <div className="mb-4 p-3 bg-gray-50 rounded-md">
                            <h3 className="text-sm font-medium mb-2">Carta Aporte</h3>
                            <div className="mb-2">
                                <span className="text-xs font-medium">Documento cargado:</span>
                                <span className="text-xs ml-1 text-blue-600">carta_aporte.pdf</span> {/*TODO: CAMBIAR A OBTENER DOCUMENTO POR TAREA Y TIPO*/}
                            </div>
                        </div>
                        
                        {/* Nueva sección para Minuta */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Subir Minuta</label>
                            <div className="flex items-center">
                                <FileUploadButton onFileChange={handleMinutaChange} />
                                {formState.minutaFile && (
                                    <span className="ml-2 text-sm text-gray-600">
                                        {formState.minutaFile.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    </>
                );
            
            case 4: // MEMORANDUM y/o SOLPED
                return (
                    <>
                        {/* Información de estados anteriores */}
                        <div className="mb-4 p-3 bg-gray-50 rounded-md">
                            <h3 className="text-sm font-medium mb-2">Documentos previos</h3>
                            <div className="mb-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium">Carta Aporte:</span>
                                    <span className="text-xs text-blue-600">carta_aporte.pdf</span> {/*TODO: CAMBIAR A OBTENER DOCUMENTO POR TAREA Y TIPO*/}
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs font-medium">Minuta:</span>
                                    <span className="text-xs text-blue-600">minuta_reunion.pdf</span> {/*TODO: CAMBIAR A OBTENER DOCUMENTO POR TAREA Y TIPO*/}
                                </div>
                            </div>
                        </div>
                        
                        {/* Nueva sección para MEMORANDUM/SOLPED */}
                        <div className="mb-4 p-3 bg-gray-50 rounded-md">
                            <h3 className="text-sm font-medium mb-2">MEMORANDUM y/o SOLPED</h3>
                            
                            <div className="mb-3">
                                <label className="block text-xs font-medium mb-1">Tipo de documento</label>
                                <div className="flex space-x-4">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formState.hasMemo}
                                            onChange={() => {
                                                handleInputChange('hasMemo', true);
                                                handleInputChange('hasSolped', false);
                                            }}
                                            className="form-checkbox h-4 w-4"
                                        />
                                        <span className="ml-2 text-xs">MEMORANDUM</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formState.hasSolped}
                                            onChange={() => {
                                                handleInputChange('hasSolped', true);
                                                handleInputChange('hasMemo', false);
                                            }}
                                            className="form-checkbox h-4 w-4"
                                        />
                                        <span className="ml-2 text-xs">SOLPED</span>
                                    </label>
                                </div>
                            </div>
                        </div>   
                    </>
                );
                
            case 5: // HEM/HES
                return (
                    <>
                        {/* Información de documentos previos en forma compacta */}
                        <div className="mb-4 p-3 bg-gray-50 rounded-md">
                            <h3 className="text-sm font-medium mb-2">Documentos previos</h3>
                            <div className="text-xs">
                                <p>• Carta Aporte, Minuta y documentación correspondiente cargados</p>
                                {formState.hasMemo && <p>• MEMORANDUM registrado</p>}
                                {formState.hasSolped && <p>• SOLPED registrada</p>}
                            </div>
                        </div>
                        
                        {/* Nueva sección para HEM/HES */}
                        <div className="mb-4 p-3 bg-gray-50 rounded-md">
                            <h3 className="text-sm font-medium mb-2">HEM/HES Registradas</h3>
                            <div className="mb-3">
                                <label className="block text-xs font-medium mb-1">Registros</label>
                                <div className="flex space-x-4">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formState.hasHem}
                                            onChange={() => {
                                                handleInputChange('hasHem', true);
                                                handleInputChange('hasHes', false);
                                            }}
                                            className="form-checkbox h-4 w-4"
                                        />
                                        <span className="ml-2 text-xs">HEM</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formState.hasHes}
                                            onChange={() => {
                                                handleInputChange('hasHes', true);
                                                handleInputChange('hasHem', false);
                                            }}
                                            className="form-checkbox h-4 w-4"
                                        />
                                        <span className="ml-2 text-xs">HES</span>
                                    </label>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="block text-xs font-medium mb-1">Proveedor</label>
                                <input
                                    type="text"
                                    value={formState.provider || ''}
                                    onChange={(e) => handleInputChange('provider', e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-xs"
                                    placeholder="Nombre del proveedor"
                                />
                            </div>
                        </div>
                    </>
                );
                
            case 6: // Resumen
                return (
                    <div className="mb-4 p-3 bg-green-50 rounded-md border border-green-200">
                        <h3 className="text-sm font-medium mb-2 text-green-700">Compliance Completado</h3>
                        <p className="text-xs text-green-600">Todos los documentos y registros han sido procesados correctamente.</p>
                        
                        <div className="mt-3 text-xs">
                            <h4 className="font-medium mb-1">Resumen:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Carta Aporte registrada</li>
                                <li>Minuta registrada</li>
                                {formState.hasMemo && <li>MEMORANDUM registrado</li>}
                                {formState.hasSolped && <li>SOLPED registrada</li>}
                                {formState.hasHem && <li>HEM registrada</li>}
                                {formState.hasHes && <li>HES registrada</li>}
                                {formState.provider && <li>Proveedor: {formState.provider}</li>}
                            </ul>
                        </div>
                    </div>
                );
                
            default:
                return null;
        }
    };

    return (
        <div data-test-id="compliance-form" className="max-h-[70vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
                {isEditing ? "Editar Compliance" : "Agregar Compliance"}
            </h2>
            
            <div className="mb-4 truncate">
                <label className="block text-sm font-medium mb-1">Iniciativa</label>
                <input
                    type="text"
                    value={formState.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    data-test-id="compliance-name-input"
                    disabled={formState.statusId > 1} 
                />
            </div>

            <div className="mb-4 truncate">
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <input
                    type="text"
                    value={formState.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    data-test-id="compliance-description-input"
                    disabled={formState.statusId > 1} 
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Estado</label>
                <DropdownMenu
                    buttonText="Seleccionar Estado"
                    items={dropdownItems.statuses}
                    onSelect={(value) => handleInputChange('statusId', value)}
                    isInModal={true}
                    selectedValue={selectedCompliance?.status ? dropdownItems.statuses.find((status:string) => status === selectedCompliance.status.name) : ""}
                    data-test-id="compliance-status-dropdown" 
                />
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
                    disabled={!formState.name || !formState.description || !formState.statusId }
                    className="bg-[#0d4384] hover:bg-[#112339] text-white disabled:bg-[#747474c6]"
                    data-test-id="save-button"
                >
                    {saveButtonText}
                </Button>
            </div>
        </div>
    );
}