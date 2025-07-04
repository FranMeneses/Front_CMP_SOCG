import { FileUploadButton } from "@/components/Documents/FileUploadButton";
import { FileText } from "lucide-react";
import DocumentsPreview from "./DocumentsPreview";
import { ComplianceFormState } from "@/app/models/ICompliance";
import { IDocumentList } from "@/app/models/IDocuments";

interface MemoSolpedFieldsProps {
    formState: ComplianceFormState;
    handleMemoSolpedTypeChange: (type: "MEMO" | "SOLPED") => void;
    handleInputChange: (field: string, value: string | number | boolean | File | null | undefined) => void;
    documents: { [key: string]: IDocumentList | undefined };
}

export default function MemoSolpedFields({
    formState,
    handleMemoSolpedTypeChange,
    handleInputChange,
    documents,
}: MemoSolpedFieldsProps) {
    return (
        <>
            <DocumentsPreview documents={documents} formState={formState} />
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Subir MEMO o SOLPED
                </h3>
                <div className="mb-3 flex gap-4">
                    <label className="flex items-center gap-1 text-xs">
                        <input
                            type="radio"
                            name="memoSolpedType"
                            value="MEMO"
                            checked={formState.memoSolpedType === "MEMO"}
                            onChange={() => handleMemoSolpedTypeChange("MEMO")}
                        />
                        MEMO
                    </label>
                    <label className="flex items-center gap-1 text-xs">
                        <input
                            type="radio"
                            name="memoSolpedType"
                            value="SOLPED"
                            checked={formState.memoSolpedType === "SOLPED"}
                            onChange={() => handleMemoSolpedTypeChange("SOLPED")}
                        />
                        SOLPED
                    </label>
                </div>
                <div className="flex items-center mb-3">
                    <FileUploadButton onFileChange={file => handleInputChange("transferPurchaseOrderFile", file)} disabled={false} />
                    {formState.transferPurchaseOrderFile && (
                        <span className="ml-2 text-sm text-gray-600">
                            {formState.transferPurchaseOrderFile.name}
                        </span>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium mb-1">Valor</label>
                        <input
                            type="number"
                            className="form-input"
                            value={formState.valor || ""}
                            onChange={e => handleInputChange("valor", Number(e.target.value))}
                            min={0}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">SOLPED/MEMO SAP</label>
                        <input
                            type="number"
                            className="form-input"
                            value={formState.solpedMemoSap || ""}
                            onChange={e => handleInputChange("solpedMemoSap", Number(e.target.value))}
                            min={0}
                        />
                    </div>
                    {formState.memoSolpedType === "SOLPED" && (
                        <>
                            <div>
                                <label className="block text-xs font-medium mb-1">CECO</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formState.ceco || ""}
                                    onChange={e => handleInputChange("ceco", Number(e.target.value))}
                                    min={0}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">Cuenta</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formState.cuenta || ""}
                                    onChange={e => handleInputChange("cuenta", Number(e.target.value))}
                                    min={0}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
} 