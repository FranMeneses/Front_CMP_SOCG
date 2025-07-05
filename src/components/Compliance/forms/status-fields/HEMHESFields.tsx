import { IDocumentList } from "@/app/models/IDocuments";
import { FileText } from "lucide-react";
import { FileUploadButton } from "@/components/Documents/FileUploadButton";
import DocumentsPreview from "./DocumentsPreview";
import { ComplianceFormState } from "@/app/models/ICompliance";
import { useState } from "react";

interface HemHesFieldsProps {
    formState: ComplianceFormState;
    handleInputChange: (field: string, value: string | number | boolean | File | null | undefined) => void;
    handleTransferFileChange: (file: File) => void;
    handleHesHemFileChange: (file: File) => void;
    cartaData?: IDocumentList;
    minutaData?: IDocumentList;
    documents: { [key: string]: IDocumentList | undefined };
}

export default function HemHesFields({
    formState,
    handleInputChange,
    handleHesHemFileChange,
    documents,
}: HemHesFieldsProps) {
    const [hesHemType, setHesHemType] = useState<'HEM' | 'HES'>('HEM');

    return (
        <>
            <DocumentsPreview documents={documents} formState={formState} />
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    {formState.solpedCECO
                        ? "HEM/HES de SAP"
                        : "Comprobante de Transferencia"}
                </h3>
                {!formState.solpedCECO && (
                    <>
                        <div className="flex items-center mb-3">
                            <FileUploadButton onFileChange={handleHesHemFileChange} disabled={false} />
                            {formState.hesHem && (
                                <span className="ml-2 text-sm text-gray-600">
                                    {formState.hesHem.name}
                                </span>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Número de Transferencia</label>
                            <input
                                type="number"
                                className="form-input"
                                value={formState.hesHemSap || ""}
                                onChange={e => handleInputChange("hesHemSap", Number(e.target.value))}
                                min={0}
                            />
                        </div>
                    </>
                )}
                {formState.solpedCECO && (
                    <div className="space-y-4">
                        <div className="flex items-center mb-3">
                            <FileUploadButton onFileChange={handleHesHemFileChange} disabled={false} />
                            {formState.hesHem && (
                                <span className="ml-2 text-sm text-gray-600">
                                    {formState.hesHem.name}
                                </span>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-1 text-xs">
                                <input
                                    type="radio"
                                    name="hesHemType"
                                    value="HEM"
                                    checked={hesHemType === "HEM"}
                                    onChange={() => setHesHemType("HEM")}
                                />
                                HEM
                            </label>
                            <label className="flex items-center gap-1 text-xs">
                                <input
                                    type="radio"
                                    name="hesHemType"
                                    value="HES"
                                    checked={hesHemType === "HES"}
                                    onChange={() => setHesHemType("HES")}
                                />
                                HES
                            </label>
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">{hesHemType}</label>
                            <input
                                type="number"
                                className="form-input"
                                value={formState.hesHemSap || ""}
                                onChange={e => handleInputChange("hesHemSap", Number(e.target.value))}
                                min={0}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}