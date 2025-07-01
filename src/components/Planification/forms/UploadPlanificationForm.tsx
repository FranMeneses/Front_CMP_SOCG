import { useState } from "react";
import { usePlanificationRest } from "@/app/features/planification/hooks/usePlanificationRest";
import { Button } from "@/components/ui/button";
import { FileUploadButton } from "../FileUploadButton";
import { FileText } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface UploadPlanificationFormProps {
    onClose?: () => void;
    onSuccess?: () => void;
}

export function UploadPlanificationForm({ onClose, onSuccess }: UploadPlanificationFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);

    const { loadPlanificationData, isLoading, error } = usePlanificationRest();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
            setLocalError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setLocalError('Por favor, selecciona un archivo para cargar.');
            return;
        }

        try {
            await loadPlanificationData(file);
            onSuccess?.(); 
            onClose?.(); 
        } catch (err) {
            console.error('Error al cargar archivo:', err);
        }
    };

    const handleCancel = () => {
        setFile(null);
        setLocalError(null);
        onClose?.();
    };

    const displayError = localError || error;

return (
    <div className="max-w-2xl mx-auto font-[Helvetica]">
        <div className="bg-gray-50 p-8 rounded-md border border-gray-200 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Cargar Planificación
            </h3>
            <div className="mb-4">
                <FileUploadButton 
                    onFileChange={handleFileChange}
                    accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                    disabled={isLoading}
                />
                {file && (
                    <p className="mt-2 text-sm text-gray-600">
                        Archivo seleccionado: {file.name}
                    </p>
                )}
                {displayError && (
                    <p className="mt-2 text-sm text-red-600">
                        {displayError}
                    </p>
                )}
            </div>
            <div className="flex gap-3">
                <Button
                    onClick={handleUpload}
                    disabled={!file || isLoading}
                    className="flex-1 cursor-pointer bg-[#0068D1] hover:bg-[#0056A3] text-white disabled:bg-[#747474c6]"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <LoadingSpinner />
                            Cargando...
                        </span>
                    ) : 'Cargar Archivo'}
                </Button>
                <Button
                    variant="secondary"
                    className="cursor-pointer bg-gray-200 hover:bg-gray-300"
                    onClick={handleCancel}
                    disabled={isLoading}
                >
                    Cancelar
                </Button>
            </div>
        </div>
    </div>
);
}