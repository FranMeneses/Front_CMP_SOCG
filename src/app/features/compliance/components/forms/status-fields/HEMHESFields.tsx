import { IDocumentList } from "@/app/models/IDocuments";
import DocumentPreview from "./DocumentsPreview";

interface HemHesFieldsProps {
    formState: any;
    cartaData?: IDocumentList;
    minutaData?: IDocumentList;
    handleInputChange: (field: string, value: any) => void;
}

export default function HemHesFields({ 
    formState, 
    cartaData, 
    minutaData, 
    handleInputChange 
}: HemHesFieldsProps) {
    return (
        <>
            {/* Información de documentos previos en forma compacta */}
            <DocumentPreview cartaData={cartaData} minutaData={minutaData} formState={formState}/>
            
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
}