import { useState } from "react";
import { usePlanificationRest } from "../../hooks/usePlanificationRest";
import { Button } from "@/components/ui/button";
import { FileUploadButton } from "../FileUploadButton";

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
        <div className="upload-planification p-6">
            <h3 className="text-lg font-semibold mb-4">Cargar Planificación</h3>
            
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
                    className="flex-1 cursor-pointer"
                >
                    {isLoading ? 'Cargando...' : 'Cargar Archivo'}
                </Button>
                
                <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={handleCancel}
                    disabled={isLoading}
                >
                    Cancelar
                </Button>
            </div>
        </div>
    );
}