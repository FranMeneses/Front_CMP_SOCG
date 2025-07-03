import { useMemo, useState } from 'react';
import { IRegisterInput } from "@/app/models/IAuth";
import { useHooks } from '../../hooks/useHooks';

interface IRegistryForm extends Omit<IRegisterInput, 'id_rol'> {
  confirmPassword: string;
}

export function useFormRegistry() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formState, setFormState] = useState<IRegistryForm>({
        email: "",
        password: "",
        confirmPassword: "",
        full_name: "",
        organization: "",
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
            !formState.confirmPassword) {
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
            
            // No enviamos id_rol para que el backend use su lógica automática:
            // - Primer usuario = Admin (rol 1)
            // - Resto de usuarios = Usuario básico (rol 11)
            await registerUser(registerData);
        } catch (error) {
            console.error("Registration error:", error);
            console.error("Error type:", typeof error);
            console.error("Error instanceof Error:", error instanceof Error);
            console.error("Error message:", (error as any)?.message);
            console.error("Error graphQLErrors:", (error as any)?.graphQLErrors);
            
            // Mejorar el manejo de errores de GraphQL
            let errorMsg = "Error en el registro. Intente nuevamente.";
            
            if (error instanceof Error) {
                errorMsg = error.message;
            } else if ((error as any)?.graphQLErrors && (error as any).graphQLErrors.length > 0) {
                errorMsg = (error as any).graphQLErrors[0].message;
            } else if ((error as any)?.message) {
                errorMsg = (error as any).message;
            }
            
            console.log("Setting error message:", errorMsg);
            setErrorMessage(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = useMemo(() => {
        return !!(formState.email && validateEmail(formState.email) && 
                formState.password && formState.full_name && 
                formState.confirmPassword && passwordMatch);
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