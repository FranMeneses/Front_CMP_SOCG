import React, { useRef } from 'react';
import { ArrowUpFromLine } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FileUploadButtonProps {
  onFileChange: (file: File) => void;
  disabled?: boolean;
}

export const FileUploadButton = ({ onFileChange, disabled = false }: FileUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file);
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
        <span className="ml-2 font-[Helvetica]">Seleccione archivo</span>
      </Button>
      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};