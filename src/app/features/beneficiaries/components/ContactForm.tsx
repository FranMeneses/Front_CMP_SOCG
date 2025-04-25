'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ContactFormProps {
    onSave: (contact: { selectedBeneficiaryId:string; name: string; position: string; email: string; phone: string }) => void;
    onCancel: () => void;
    selectedBeneficiaryId: string | null;
}

export default function ContactForm({ onSave, onCancel, selectedBeneficiaryId }: ContactFormProps) {
    const [name, setName] = useState<string>("");
    const [position, setPosition] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");

    const handleSave = () => {
        onSave({ selectedBeneficiaryId: selectedBeneficiaryId ?? "", name, position, email, phone });
        setName("");
        setPosition("");
        setEmail("");
        setPhone("");
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <label className="text-sm font-medium mb-1">Nombre</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label className="text-sm font-medium mb-1">Cargo</label>
                <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label className="text-sm font-medium mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label className="text-sm font-medium mb-1">Teléfono</label>
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                />
            </div>
            <div className="flex justify-end space-x-2">
                <Button variant="secondary" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 cursor-pointer">
                    Cancelar
                </Button>
                <Button variant="default" onClick={handleSave} className="bg-[#0d4384] hover:bg-[#112339] text-white disabled:bg-gray-600 cursor-pointer"
                    disabled={!name || !position || !email || !phone}
                >
                    Guardar
                </Button>
            </div>
        </div>
    );
}
