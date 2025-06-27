import { useMemo, useState } from 'react';
import { IRegisterInput } from "@/app/models/IAuth";
import { useHooks } from '../../hooks/useHooks';

interface IRegistryForm extends IRegisterInput {
  confirmPassword: string;
}

export function useFormRegistry() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formState, setFormState] = useState<IRegistryForm>({
        email: "",
        password: "",
        confirmPassword: "",
        full_name: "",
        id_rol: 11,
        organization: " ",
    });

    const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
    const [emailValid, setEmailValid] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { handleRegister: registerUser } = useHooks();
    
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value
        });
        
        if (name === 'password' || name === 'confirmPassword') {
            const isMatch = name === 'password' 
                ? value === formState.confirmPassword
                : formState.password === value;
            setPasswordMatch(isMatch);
        }
        
        if (name === 'email') {
            if (value) {
                setEmailValid(validateEmail(value));
            } else {
                setEmailValid(true);
            }
        }
        
        if (errorMessage) {
            setErrorMessage(null);
        }
    };
    
    const validateForm = (): boolean => {
        if (!formState.email || !formState.password || !formState.full_name || 
            !formState.confirmPassword || formState.id_rol === 0 || !formState.organization) {
            setErrorMessage("Por favor complete todos los campos obligatorios");
            return false;
        }
        
        if (!validateEmail(formState.email)) {
            setEmailValid(false);
            setErrorMessage("El formato del correo electrónico no es válido");
            return false;
        }
        
        if (formState.password !== formState.confirmPassword) {
            setPasswordMatch(false);
            setErrorMessage("Las contraseñas no coinciden");
            return false;
        }
        
        return true;
    };
    
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            setIsSubmitting(true);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword, ...registerData } = formState;
            await registerUser(registerData);
        } catch (error) {
            console.error("Registration error:", error);
            setErrorMessage(error instanceof Error ? error.message : "Error en el registro. Intente nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = useMemo(() => {
        return !!(formState.email && validateEmail(formState.email) && 
                formState.password && formState.full_name && 
                formState.confirmPassword && formState.id_rol !== 0 && 
                formState.organization && passwordMatch);
    }, [formState, passwordMatch]);

    return {
        formState,
        passwordMatch,
        emailValid,
        isSubmitting,
        errorMessage,
        isFormValid,
        handleInputChange,
        handleRegister
    };
}