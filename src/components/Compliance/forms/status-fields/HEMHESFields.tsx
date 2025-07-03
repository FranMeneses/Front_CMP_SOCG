import { IDocumentList } from "@/app/models/IDocuments";
import { FileText } from "lucide-react";
import { FileUploadButton } from "@/components/Documents/FileUploadButton";

interface HemHesFieldsProps {
    formState: {
        memoSolpedType?: "MEMO" | "SOLPED";
        hesHem?: File | null;
        hesHemSap?: number;
        transferNumber?: number;
        transferFile?: File | null;
    };
    handleInputChange: (field: string, value: string | number | boolean | File | null | undefined) => void;
    handleTransferFileChange: (file: File) => void;
    handleHesHemFileChange: (file: File) => void;
    cartaData?: IDocumentList;
    minutaData?: IDocumentList;
}

export default function HemHesFields({
    formState,
    handleInputChange,
    handleTransferFileChange,
    handleHesHemFileChange,
}: HemHesFieldsProps) {
    return (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                {formState.memoSolpedType === "MEMO"
                    ? "Comprobante de Transferencia"
                    : "HEM/HES de SAP"}
            </h3>
            {formState.memoSolpedType === "MEMO" && (
                <>
                    <div className="flex items-center mb-3">
                        <FileUploadButton onFileChange={handleTransferFileChange} disabled={false} />
                        {formState.transferFile && (
                            <span className="ml-2 text-sm text-gray-600">
                                {formState.transferFile.name}
                            </span>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">Número de Transferencia</label>
                        <input
                            type="number"
                            className="form-input"
                            value={formState.transferNumber || ""}
                            onChange={e => handleInputChange("transferNumber", Number(e.target.value))}
                            min={0}
                        />
                    </div>
                </>
            )}
            {formState.memoSolpedType === "SOLPED" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium mb-1">HEM SAP</label>
                        <input
                            type="number"
                            className="form-input"
                            value={formState.hesHemSap || ""}
                            onChange={e => handleInputChange("hesHemSap", Number(e.target.value))}
                            min={0}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">HES SAP</label>
                        <input
                            type="number"
                            className="form-input"
                            value={formState.hesHemSap || ""}
                            onChange={e => handleInputChange("hesHemSap", Number(e.target.value))}
                            min={0}
                        />
                    </div>
                    <div className="col-span-2">
                        <FileUploadButton onFileChange={handleHesHemFileChange} disabled={false} />
                        {formState.hesHem && (
                            <span className="ml-2 text-sm text-gray-600">
                                {formState.hesHem.name}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}