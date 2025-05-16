'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IContact } from "@/app/models/IBeneficiary";

interface ContactFormProps {
    onSave: (contact: { id?:string, selectedBeneficiaryId: string; name: string; position: string; email: string; phone: string }) => void;
    onCancel: () => void;
    selectedBeneficiaryId: string | null;
    initialValues?: IContact;
}

export default function ContactForm({ onSave, onCancel, selectedBeneficiaryId, initialValues }: ContactFormProps) {
    const [name, setName] = useState<string>(initialValues?.name || "");
    const [position, setPosition] = useState<string>(initialValues?.position || "");
    const [email, setEmail] = useState<string>(initialValues?.email || "");
    const [phone, setPhone] = useState<string>(initialValues?.phone || "");

    useEffect(() => {
        if (initialValues) {
            setName(initialValues.name);
            setPosition(initialValues.position);
            setEmail(initialValues.email);
            setPhone(initialValues.phone);
        }
    }, [initialValues]);

    const handleSave = () => {
        onSave({ id :initialValues?.id ,selectedBeneficiaryId: selectedBeneficiaryId ?? "", name, position, email, phone });
        setName("");
        setPosition("");
        setEmail("");
        setPhone("");
    };

    return (
        <div className="p-4" data-test-id="contact-form">
            <div className="mb-4">
                <label className="text-sm font-medium mb-1">Nombre</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                    data-test-id="contact-name"
                />
            </div>
            <div className="mb-4">
                <label className="text-sm font-medium mb-1">Cargo</label>
                <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                    data-test-id="contact-position"
                />
            </div>
            <div className="mb-4">
                <label className="text-sm font-medium mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value);  // Optional: Add email validation here
                    }}
                    className="border border-gray-300 rounded-md p-2 w-full"
                    data-test-id="contact-email"
                />
            </div>
            <div className="mb-4">
                <label className="text-sm font-medium mb-1">Teléfono</label>
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                        const value = e.target.value;
                        const phoneRegex = /^[0-9\s\+]*$/;
                        if (phoneRegex.test(value)) {
                            setPhone(value);
                        }
                    }}
                    className="border border-gray-300 rounded-md p-2 w-full"
                    data-test-id="contact-phone"
                />
            </div>
            <div className="flex justify-end space-x-2">
                <Button variant="secondary" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 cursor-pointer" data-test-id="contact-cancel">
                    Cancelar
                </Button>
                <Button
                    variant="default"
                    onClick={handleSave}
                    className="bg-[#0d4384] hover:bg-[#112339] text-white disabled:bg-gray-600 cursor-pointer"
                    disabled={!name || !position || !email || !phone}
                    data-test-id="contact-save"
                >
                    Guardar
                </Button>
            </div>
        </div>
    );
}