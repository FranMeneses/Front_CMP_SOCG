'use client';
import { Button } from "@/components/ui/button";
import { IContact } from "@/app/models/IBeneficiary";
import { useContactForm } from "@/app/features/beneficiaries/hooks/useContactForm";

interface ContactFormProps {
    onSave: (contact: { id?:string, selectedBeneficiaryId: string; name: string; position: string; email: string; phone: string }) => void;
    onCancel: () => void;
    selectedBeneficiaryId: string | null;
    initialValues?: IContact;
}

export default function ContactForm({ onSave, onCancel, selectedBeneficiaryId, initialValues }: ContactFormProps) {
    const {
        name,
        position,
        email,
        phone,
        emailConfirm,
        phoneConfirm,
        emailError,
        phoneError,
        emailConfirmError,
        phoneConfirmError,
        setName,
        setPosition,
        handleEmailChange,
        handleEmailConfirmChange,
        handlePhoneChange,
        handlePhoneConfirmChange,
        handleSave,
        isFormValid
    } = useContactForm({ initialValues, selectedBeneficiaryId, onSave });

    return (
        <div className="p-4 font-[Helvetica]" data-test-id="contact-form">
            <div className="form-field">
                <label className="form-label required">Nombre</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    data-test-id="contact-name"
                    required
                />
            </div>
            
            <div className="form-field">
                <label className="form-label required">Cargo</label>
                <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="form-input"
                    data-test-id="contact-position"
                    required
                />
            </div>
            
            <div className="form-field">
                <label className="form-label required">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    className={`form-input ${emailError ? 'input-error' : ''}`}
                    data-test-id="contact-email"
                    placeholder="ejemplo@correo.com"
                    required
                />
                {emailError && <span className="error-message">{emailError}</span>}
            </div>
            
            <div className="form-field">
                <label className="form-label required">Confirmar Email</label>
                <input
                    type="email"
                    value={emailConfirm}
                    onChange={handleEmailConfirmChange}
                    className={`form-input ${emailConfirmError ? 'input-error' : ''}`}
                    data-test-id="contact-email-confirm"
                    placeholder="Confirme su email"
                    required
                />
                {emailConfirmError && <span className="error-message">{emailConfirmError}</span>}
            </div>
            
            <div className="form-field">
                <label className="form-label required">Teléfono</label>
                <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    className={`form-input ${phoneError ? 'input-error' : ''}`}
                    data-test-id="contact-phone"
                    placeholder="987654321"
                    maxLength={9}
                    required
                />
                {phoneError && <span className="error-message">{phoneError}</span>}
            </div>
            
            <div className="form-field">
                <label className="form-label required">Confirmar Teléfono</label>
                <input
                    type="tel"
                    value={phoneConfirm}
                    onChange={handlePhoneConfirmChange}
                    className={`form-input ${phoneConfirmError ? 'input-error' : ''}`}
                    data-test-id="contact-phone-confirm"
                    placeholder="Confirme su teléfono"
                    maxLength={9}
                    required
                />
                {phoneConfirmError && <span className="error-message">{phoneConfirmError}</span>}
            </div>
            
            <div className="flex justify-end space-x-2">
                <Button variant="secondary" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 cursor-pointer" data-test-id="contact-cancel">
                    Cancelar
                </Button>
                <Button
                    variant="default"
                    onClick={handleSave}
                    className="bg-[#0068D1] hover:bg-[#0056A3] text-white disabled:bg-gray-600 cursor-pointer"
                    disabled={!isFormValid}
                    data-test-id="contact-save"
                >
                    Guardar
                </Button>
            </div>
        </div>
    );
}