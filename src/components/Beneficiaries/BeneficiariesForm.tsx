'use client';
import { Button } from "@/components/ui/button";
import DropdownMenu from "@/components/Dropdown";
import { IBeneficiary } from "@/app/models/IBeneficiary";
import { useBeneficiaryForm } from "@/app/features/beneficiaries/hooks/useBeneficiariyForm";

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
        <div className="p-4 font-[Helvetica]" data-test-id="beneficiary-form">
            <div className="form-field">
                <label className="form-label required">Nombre Legal</label>
                <input
                    type="text"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    className="form-input"
                    data-test-id="legal-name"
                    required
                />
            </div>
            
            <div className="form-field">
                <label className="form-label required">RUT</label>
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
            
            <div className="form-field">
                <label className="form-label required">Dirección</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-input"
                    data-test-id="address"
                    required
                />
            </div>
            
            <div className="form-field">
                <label className="form-label required">Tipo de Entidad</label>
                <input
                    type="text"
                    value={entityType}
                    onChange={(e) => setEntityType(e.target.value)}
                    className="form-input"
                    data-test-id="entity-type"
                    required
                />
            </div>
            
            <div className="form-field">
                <label className="form-label required">Representante</label>
                <input
                    type="text"
                    value={representative}
                    onChange={(e) => setRepresentative(e.target.value)}
                    className="form-input"
                    data-test-id="representative"
                    required
                />
            </div>
            
            <div className="form-field">
                <label className="form-label required">Persona Juridica</label>
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
                <Button 
                    variant="default" 
                    onClick={handleSave} 
                    className="bg-[#0068D1] hover:bg-[#0056A3] text-white disabled:bg-gray-600 cursor-pointer"
                    disabled={!isFormValid}
                    data-test-id="save-button"
                >
                    Guardar
                </Button>
            </div>
        </div>
    );
}