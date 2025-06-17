import React, { useRef } from 'react';
import { ArrowUpFromLine } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FileUploadButtonProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  disabled?: boolean;
}

export const FileUploadButton = ({ onFileChange, accept = ".xlsx,.xls", disabled = false }: FileUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        className="cursor-pointer"
        onClick={handleUpload}
        disabled={disabled}
      >
        <ArrowUpFromLine className="text-black" size={24} />
        <span className="ml-2 font-[Helvetica]">Seleccione la planificación a subir (Excel)</span>
      </Button>
      <input
        type="file"
        accept={accept}
        ref={fileInputRef}
        onChange={onFileChange}
        className="hidden"
      />
    </>
  );
};