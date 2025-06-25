import { IDocumentList } from "@/app/models/IDocuments";
import DocumentPreview from "./DocumentsPreview";
import { ComplianceFormState } from "@/app/models/ICompliance";


interface MemorandumFieldsProps {
    formState: ComplianceFormState;
    cartaData?: IDocumentList;
    minutaData?: IDocumentList;
    handleInputChange: (field: keyof ComplianceFormState, value: string | number | boolean) => void;
}

export default function MemorandumFields({ 
    formState, 
    cartaData, 
    minutaData, 
    handleInputChange 
}: MemorandumFieldsProps) {

    const renderSpecificForm = () => {
        if (formState.hasMemo) {
            return (
                <div className="mt-3 p-2 border border-blue-100 bg-blue-50 rounded-md font-[Helvetica]">
                    <h4 className="text-xs font-medium mb-2 text-blue-700">Información del Memorandum</h4>
                    <div className="mb-2">
                        <label className="block text-xs font-medium mb-1">Monto (USD)</label>
                        <div className="flex items-center">
                            <span className="text-xs mr-2">$</span>
                            <input
                                type="number"
                                min={0}
                                value={formState.memoAmount || ''}
                                onChange={(e) => handleInputChange('memoAmount', e.target.value)}
                                className="w-full border rounded px-3 py-2 text-xs"
                                placeholder="Ingrese el monto"
                            />
                        </div>
                    </div>
                </div>
            );
        } else if (formState.hasSolped) {
            return (
                <div className="mt-3 p-2 border border-green-100 bg-green-50 rounded-md font-[Helvetica]">
                    <h4 className="text-xs font-medium mb-2 text-green-700">Información de la SOLPED</h4>
                    <div className="mb-2">
                        <label className="block text-xs font-medium mb-1">CECO</label>
                        <input
                            type="text"
                            value={formState.solpedCECO || ''}
                            onChange={(e) => handleInputChange('solpedCECO', e.target.value)}
                            className="w-full border rounded px-3 py-2 text-xs"
                            placeholder="Ingrese el CECO asociado"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-xs font-medium mb-1">Cuenta</label>
                        <input
                            type="text"
                            value={formState.solpedAccount || ''}
                            onChange={(e) => handleInputChange('solpedAccount', e.target.value)}
                            className="w-full border rounded px-3 py-2 text-xs"
                            placeholder="Ingrese la cuenta asociada"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">Monto (USD)</label>
                        <div className="flex items-center">
                            <span className="text-xs mr-2">$</span>
                            <input
                                type="number"
                                min={0}
                                value={formState.solpedAmount || ''}
                                onChange={(e) => handleInputChange('solpedAmount', e.target.value)}
                                className="w-full border rounded px-3 py-2 text-xs"
                                placeholder="Ingrese el monto asociado a la SOLPED"
                            />
                        </div>
                    </div>
                </div>
            );
        }
        
        return null;
    };

    return (
        <>
            <DocumentPreview cartaData={cartaData} minutaData={minutaData} formState={formState}/>
            
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
                                    handleInputChange('hasMemo', !formState.hasMemo);
                                    if (!formState.hasMemo) handleInputChange('hasSolped', false);
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
                                    handleInputChange('hasSolped', !formState.hasSolped);
                                    if (!formState.hasSolped) handleInputChange('hasMemo', false);
                                }}
                                className="form-checkbox h-4 w-4"
                            />
                            <span className="ml-2 text-xs">SOLPED</span>
                        </label>
                    </div>
                </div>
                
                {/* Formulario dinámico según selección */}
                {renderSpecificForm()}
            </div>   
        </>
    );
}