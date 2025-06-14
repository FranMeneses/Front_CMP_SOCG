import { useState, useEffect } from 'react';
import { IContact } from '@/app/models/IBeneficiary';

interface UseContactFormProps {
    initialValues?: IContact;
    selectedBeneficiaryId: string | null;
    onSave: (contact: { 
        id?: string; 
        selectedBeneficiaryId: string; 
        name: string; 
        position: string; 
        email: string; 
        phone: string 
    }) => void;
}

export const useContactForm = ({ initialValues, selectedBeneficiaryId, onSave }: UseContactFormProps) => {
    const [name, setName] = useState<string>(initialValues?.name || "");
    const [position, setPosition] = useState<string>(initialValues?.position || "");
    const [email, setEmail] = useState<string>(initialValues?.email || "");
    const [phone, setPhone] = useState<string>(initialValues?.phone || "");
    
    const [emailConfirm, setEmailConfirm] = useState<string>("");
    const [phoneConfirm, setPhoneConfirm] = useState<string>("");
    
    const [emailError, setEmailError] = useState<string>("");
    const [phoneError, setPhoneError] = useState<string>("");
    const [emailConfirmError, setEmailConfirmError] = useState<string>("");
    const [phoneConfirmError, setPhoneConfirmError] = useState<string>("");

    /*
    * Efecto para inicializar valores del formulario
    */
    useEffect(() => {
        if (initialValues) {
            setName(initialValues.name);
            setPosition(initialValues.position);
            setEmail(initialValues.email);
            setPhone(initialValues.phone);
            setEmailConfirm(initialValues.email);
            setPhoneConfirm(initialValues.phone);
        }
    }, [initialValues]);

    /**
     * Valida el formato del email
     * @param email - Email a validar
     * @returns true si el email es válido
     */
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    /**
     * Valida el formato del teléfono chileno
     * @param phone - Teléfono a validar
     * @returns true si el teléfono es válido
     */
    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^(\+56)?[2-9][0-9]{8}$/;
        const cleanPhone = phone.replace(/\s/g, '');
        return phoneRegex.test(cleanPhone);
    };

    /**
     * Formatea el teléfono limitando a 9 dígitos
     * @param value - Valor del teléfono
     * @returns Teléfono formateado
     */
    const formatPhone = (value: string): string => {
        const numbers = value.replace(/[^\d]/g, '');
        if (numbers.length <= 9) {
            return numbers;
        }
        return numbers.slice(0, 9);
    };

    /**
     * Maneja el cambio en el campo de email
     * @param e - Evento de cambio del input
     */
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        
        if (value && !validateEmail(value)) {
            setEmailError("Formato de email inválido");
        } else {
            setEmailError("");
        }
        
        // Validar confirmación si ya hay valor
        if (emailConfirm && value !== emailConfirm) {
            setEmailConfirmError("Los emails no coinciden");
        } else {
            setEmailConfirmError("");
        }
    };

    /**
     * Maneja el cambio en el campo de confirmación de email
     * @param e - Evento de cambio del input
     */
    const handleEmailConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmailConfirm(value);
        
        if (value !== email) {
            setEmailConfirmError("Los emails no coinciden");
        } else {
            setEmailConfirmError("");
        }
    };

    /**
     * Maneja el cambio en el campo de teléfono
     * @param e - Evento de cambio del input
     */
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const phoneRegex = /^[0-9\s\+]*$/;
        
        if (phoneRegex.test(value)) {
            const formatted = formatPhone(value);
            setPhone(formatted);
            
            if (formatted && !validatePhone(formatted)) {
                setPhoneError("Formato de teléfono inválido (debe tener 9 dígitos)");
            } else {
                setPhoneError("");
            }
            
            // Validar confirmación si ya hay valor
            if (phoneConfirm && formatted !== phoneConfirm) {
                setPhoneConfirmError("Los teléfonos no coinciden");
            } else {
                setPhoneConfirmError("");
            }
        }
    };

    /**
     * Maneja el cambio en el campo de confirmación de teléfono
     * @param e - Evento de cambio del input
     */
    const handlePhoneConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const phoneRegex = /^[0-9\s\+]*$/;
        
        if (phoneRegex.test(value)) {
            const formatted = formatPhone(value);
            setPhoneConfirm(formatted);
            
            if (formatted !== phone) {
                setPhoneConfirmError("Los teléfonos no coinciden");
            } else {
                setPhoneConfirmError("");
            }
        }
    };

    /**
     * Maneja el guardado del formulario
     * @description Valida todos los campos antes de guardar
     */
    const handleSave = () => {
        let hasErrors = false;
        
        if (!validateEmail(email)) {
            setEmailError("Email inválido");
            hasErrors = true;
        }
        
        if (!validatePhone(phone)) {
            setPhoneError("Teléfono inválido");
            hasErrors = true;
        }
        
        if (email !== emailConfirm) {
            setEmailConfirmError("Los emails no coinciden");
            hasErrors = true;
        }
        
        if (phone !== phoneConfirm) {
            setPhoneConfirmError("Los teléfonos no coinciden");
            hasErrors = true;
        }
        
        if (hasErrors) return;
        
        onSave({ 
            id: initialValues?.id, 
            selectedBeneficiaryId: selectedBeneficiaryId ?? "", 
            name, 
            position, 
            email, 
            phone 
        });
        
        setName("");
        setPosition("");
        setEmail("");
        setPhone("");
        setEmailConfirm("");
        setPhoneConfirm("");
        setEmailError("");
        setPhoneError("");
        setEmailConfirmError("");
        setPhoneConfirmError("");
    };

    /**
     * Verifica si el formulario es válido
     */
    const isFormValid = name && 
                       position && 
                       email && 
                       phone && 
                       emailConfirm && 
                       phoneConfirm &&
                       !emailError && 
                       !phoneError && 
                       !emailConfirmError && 
                       !phoneConfirmError &&
                       email === emailConfirm &&
                       phone === phoneConfirm;

    return {
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
        validateEmail,
        validatePhone,
        formatPhone,
        isFormValid
    };
};