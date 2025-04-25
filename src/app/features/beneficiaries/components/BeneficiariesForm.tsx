'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import DropdownMenu from "@/components/Dropdown";

interface BeneficiariesFormProps {
    onSave: (beneficiary: { legalName: string; rut: string; address: string; entityType: string, representative: string, hasLegalPersonality:boolean }) => void;
    onCancel: () => void;
}

export default function BeneficiariesForm({ onSave, onCancel }: BeneficiariesFormProps) {
    const [legalName, setLegalName] = useState<string>("");
    const [rut, setRut] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [entityType, setEntityType] = useState<string>("");
    const [representative, setRepresentative] = useState<string>("");
    const [hasLegalPersonality, setHasLegalPersonality] = useState<boolean>(false);

    const handleSave = () => {
        onSave({ legalName, rut, address, entityType, representative, hasLegalPersonality});
        setLegalName("");
        setRut("");
        setAddress("");
        setEntityType("");
        setRepresentative("");
        setHasLegalPersonality(false);
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <label className="text-sm font-medium mb-1">Nombre Legal</label>
                <input
                    type="text"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label className="text-sm font-medium mb-1">RUT</label>
                <input
                    type="text"
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label className="text-sm font-medium mb-1">Dirección</label>
                <input
                    type="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label className="text-sm font-medium mb-1">Tipo de Entidad</label>
                <input
                    type="text"
                    value={entityType}
                    onChange={(e) => setEntityType(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label className="text-sm font-medium mb-1">Representante</label>
                <input
                    type="text"
                    value={representative}
                    onChange={(e) => setRepresentative(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <h4 className="text-sm font-medium mb-1">Persona Juridica</h4>
                <DropdownMenu
                    items={["Si", "No"]}
                    onSelect={(item) => setHasLegalPersonality(item === "Si")}
                    buttonText="No"
                />
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <Button variant="secondary" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 cursor-pointer">
                    Cancelar
                </Button>
                <Button variant="default" onClick={handleSave} className="bg-[#0d4384] hover:bg-[#112339] text-white disabled:bg-gray-600 cursor-pointer"
                    disabled={!legalName || !rut || !address || !entityType || !representative}
                >
                    Guardar
                </Button>
            </div>
        </div>
    );
}