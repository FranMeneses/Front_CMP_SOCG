import React, { useRef } from 'react';
import { ArrowUpFromLine } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FileUploadButtonProps {
  onFileChange: (file: File) => void;
}

export const FileUploadButton = ({ onFileChange }: FileUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = () => {
    if (fileInputRef.current) {
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
      >
        <ArrowUpFromLine className="text-black" size={24} />
        <span className="ml-2">Seleccione archivo</span>
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