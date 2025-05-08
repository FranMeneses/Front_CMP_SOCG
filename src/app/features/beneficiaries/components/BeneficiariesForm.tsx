'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import DropdownMenu from "@/components/Dropdown";
import { IBeneficiary } from "@/app/models/IBeneficiary";

interface BeneficiariesFormProps {
    initialValues?: IBeneficiary;
    onSave: (beneficiary: { legalName: string; rut: string; address: string; entityType: string, representative: string, hasLegalPersonality:boolean }) => void;
    onCancel: () => void;
}

export default function BeneficiariesForm({ onSave, onCancel, initialValues }: BeneficiariesFormProps) {
    const [legalName, setLegalName] = useState<string>(initialValues?.legalName || "");
    const [rut, setRut] = useState<string>(initialValues?.rut || "");
    const [address, setAddress] = useState<string>(initialValues?.address || "");
    const [entityType, setEntityType] = useState<string>(initialValues?.entityType || "");
    const [representative, setRepresentative] = useState<string>(initialValues?.representative || "");
    const [hasLegalPersonality, setHasLegalPersonality] = useState<boolean>(initialValues?.hasLegalPersonality || false);

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
        <div className="p-4" data-test-id="beneficiary-form">
            <div className="mb-4">
                <label className="text-sm font-medium mb-1">Nombre Legal</label>
                <input
                    type="text"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                    data-test-id="legal-name"
                />
            </div>
            <div className="mb-4">
                <label className="text-sm font-medium mb-1">RUT</label>
                <input
                    type="text"
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                    data-test-id="rut"
                />
            </div>
            <div className="mb-4">
                <label className="text-sm font-medium mb-1">Dirección</label>
                <input
                    type="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                    data-test-id="address"
                />
            </div>
            <div className="mb-4">
                <label className="text-sm font-medium mb-1">Tipo de Entidad</label>
                <input
                    type="text"
                    value={entityType}
                    onChange={(e) => setEntityType(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                    data-test-id="entity-type"
                />
            </div>
            <div className="mb-4">
                <label className="text-sm font-medium mb-1">Representante</label>
                <input
                    type="text"
                    value={representative}
                    onChange={(e) => setRepresentative(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                    data-test-id="representative"
                />
            </div>
            <div className="mb-4">
                <h4 className="text-sm font-medium mb-1">Persona Juridica</h4>
                <DropdownMenu
                    items={["Si", "No"]}
                    onSelect={(item) => setHasLegalPersonality(item === "Si")}
                    buttonText="No"
                    data-test-id="has-legal-personality"
                    selectedValue={hasLegalPersonality ? "Si" : "No"}
                />
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <Button variant="secondary" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 cursor-pointer" data-test-id="cancel-button">
                    Cancelar
                </Button>
                <Button variant="default" onClick={handleSave} className="bg-[#0d4384] hover:bg-[#112339] text-white disabled:bg-gray-600 cursor-pointer"
                    disabled={!legalName || !rut || !address || !entityType || !representative}
                    data-test-id="save-button"
                >
                    Guardar
                </Button>
            </div>
        </div>
    );
}