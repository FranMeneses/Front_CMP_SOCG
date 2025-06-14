import { useState } from 'react';
import { IBeneficiary } from '@/app/models/IBeneficiary';

interface UseBeneficiaryFormProps {
    initialValues?: IBeneficiary;
    onSave: (beneficiary: { 
        legalName: string; 
        rut: string; 
        address: string; 
        entityType: string; 
        representative: string; 
        hasLegalPersonality: boolean 
    }) => void;
}

export const useBeneficiaryForm = ({ initialValues, onSave }: UseBeneficiaryFormProps) => {
    const [legalName, setLegalName] = useState<string>(initialValues?.legalName || "");
    const [rut, setRut] = useState<string>(initialValues?.rut || "");
    const [address, setAddress] = useState<string>(initialValues?.address || "");
    const [entityType, setEntityType] = useState<string>(initialValues?.entityType || "");
    const [representative, setRepresentative] = useState<string>(initialValues?.representative || "");
    const [hasLegalPersonality, setHasLegalPersonality] = useState<boolean>(initialValues?.hasLegalPersonality || false);
    const [rutError, setRutError] = useState<string>("");

    /**
     * Función para formatear el RUT ingresado.
     * @description Formatea el RUT para que tenga el formato correcto.
     * @param value - RUT ingresado.
     * @returns RUT formateado.
     */
    const formatRUT = (value: string): string => {
        let rut = value.replace(/[^0-9kK]/g, '');
        let rutNumber = rut.slice(0, -1);
        let dv = rut.slice(-1).toUpperCase();
        
        if (rutNumber.length > 6) {
            rutNumber = rutNumber.slice(0, -6) + '.' + rutNumber.slice(-6, -3) + '.' + rutNumber.slice(-3);
        } else if (rutNumber.length > 3) {
            rutNumber = rutNumber.slice(0, -3) + '.' + rutNumber.slice(-3);
        }
        
        return rutNumber + (dv ? '-' + dv : '');
    };

    /**
     * Función para validar el RUT ingresado.
     * @description Valida el RUT según el algoritmo chileno.
     * @param rut - RUT a validar.
     * @returns Verdadero si el RUT es válido, falso en caso contrario.
     */
    const validateRUT = (rut: string): boolean => {
        rut = rut.replace(/[^0-9kK]/g, '');
        
        if (rut.length < 2) return false;
        
        let rutNumber = rut.slice(0, -1);
        let dv = rut.slice(-1).toUpperCase();
        
        let suma = 0;
        let multiplicador = 2;
        
        for (let i = rutNumber.length - 1; i >= 0; i--) {
            suma += parseInt(rutNumber[i]) * multiplicador;
            multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
        }
        
        let dvCalculado: string;
        const dvNum = 11 - (suma % 11);
        if (dvNum === 11) {
            dvCalculado = '0';
        } else if (dvNum === 10) {
            dvCalculado = 'K';
        } else {
            dvCalculado = dvNum.toString();
        }
        
        return dv === dvCalculado;
    };
    
    /**
     * Maneja el cambio en el campo de RUT.
     * @param e - Evento de cambio del input.
     */
    const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatRUT(e.target.value);
        setRut(formatted);
        
        if (formatted.length >= 11) {
            if (!validateRUT(formatted)) {
                setRutError("RUT inválido");
            } else {
                setRutError("");
            }
        } else {
            setRutError("");
        }
    };

    /**
     * Función para manejar el guardado del formulario.
     * @description Valida el RUT y los demás campos antes de llamar a la función onSave.
     * @returns 
     */
    const handleSave = () => {
        if (rutError) return;
        
        onSave({ legalName, rut, address, entityType, representative, hasLegalPersonality });
        
        setLegalName("");
        setRut("");
        setAddress("");
        setEntityType("");
        setRepresentative("");
        setHasLegalPersonality(false);
        setRutError("");
    };

    const isFormValid = !rutError && legalName && rut && address && entityType && representative;

    return {
        legalName,
        rut,
        address,
        entityType,
        representative,
        hasLegalPersonality,
        rutError,
        
        setLegalName,
        setRut,
        setAddress,
        setEntityType,
        setRepresentative,
        setHasLegalPersonality,
        
        handleRutChange,
        handleSave,
        formatRUT,
        validateRUT,
        
        isFormValid
    };
};