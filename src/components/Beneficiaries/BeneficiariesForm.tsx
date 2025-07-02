'use client';
import { Button } from "@/components/ui/button";
import DropdownMenu from "@/components/Dropdown";
import { IBeneficiary } from "@/app/models/IBeneficiary";
import { useBeneficiaryForm } from "@/app/features/beneficiaries/hooks/useBeneficiariyForm";
import { Info, User2Icon } from "lucide-react";

interface BeneficiariesFormProps {
    initialValues?: IBeneficiary;
    onSave: (beneficiary: { legalName: string; rut: string; address: string; entityType: string, representative: string, hasLegalPersonality:boolean }) => void;
    onCancel: () => void;
}

export default function BeneficiariesForm({ onSave, onCancel, initialValues }: BeneficiariesFormProps) {
    const {
        legalName,
        rut,
        address,
        entityType,
        representative,
        hasLegalPersonality,
        rutError,
        setLegalName,
        setAddress,
        setEntityType,
        setRepresentative,
        setHasLegalPersonality,
        handleRutChange,
        handleSave,
        isFormValid
    } = useBeneficiaryForm({ initialValues, onSave });

    return (
        <div className="p-5 max-w-2xl mx-auto font-[Helvetica]" data-test-id="beneficiary-form">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">
                    {initialValues ? "Editar beneficiario" : "Nuevo beneficiario"}
                </h2>
            </div>

            <div className="space-y-6">
                {/* Información General */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                        <Info className="h-4 w-4 mr-2"/>
                        Información General
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 required">Nombre Legal</label>
                            <input
                                type="text"
                                value={legalName}
                                onChange={(e) => setLegalName(e.target.value)}
                                className="form-input"
                                data-test-id="legal-name"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 required">RUT</label>
                            <input
                                type="text"
                                value={rut}
                                onChange={handleRutChange}
                                className={`form-input ${rutError ? 'input-error' : ''}`}
                                data-test-id="rut"
                                placeholder="12.345.678-9"
                                maxLength={12}
                                required
                            />
                            {rutError && <span className="error-message">{rutError}</span>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 required">Dirección</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="form-input"
                                data-test-id="address"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 required">Tipo de Entidad</label>
                            <input
                                type="text"
                                value={entityType}
                                onChange={(e) => setEntityType(e.target.value)}
                                className="form-input"
                                data-test-id="entity-type"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Representante y Persona Jurídica */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                        <User2Icon className="h-4 w-4 mr-2"/>
                        Representante
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 required">Representante</label>
                            <input
                                type="text"
                                value={representative}
                                onChange={(e) => setRepresentative(e.target.value)}
                                className="form-input"
                                data-test-id="representative"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 required">Persona Jurídica</label>
                            <DropdownMenu
                                items={["Si", "No"]}
                                onSelect={(item) => setHasLegalPersonality(item === "Si")}
                                buttonText={hasLegalPersonality ? "Si" : "No"}
                                data-test-id="has-legal-personality"
                                selectedValue={hasLegalPersonality ? "Si" : "No"}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
                <Button variant="secondary" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 cursor-pointer" data-test-id="cancel-button">
                    Cancelar
                </Button>
                <Button 
                    variant="default" 
                    onClick={handleSave} 
                    className="bg-[#0068D1] hover:bg-[#0056A3] text-white disabled:bg-[#747474c6] cursor-pointer"
                    disabled={!isFormValid}
                    data-test-id="save-button"
                >
                    Guardar
                </Button>
            </div>
        </div>
    );
}