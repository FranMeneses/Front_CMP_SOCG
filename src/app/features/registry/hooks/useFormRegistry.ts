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
    
    /**
     * Función para validar el formato del correo electrónico.
     * @description Utiliza una expresión regular para verificar que el correo electrónico tenga un formato válido.
     * @param email - El correo electrónico a validar.
     * @returns boolean - Retorna true si el correo electrónico es válido, false en caso contrario.
     * @return {boolean}
     */
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
    
    /**
     * Función para validar el formulario antes de enviarlo.
     * @description Verifica que todos los campos obligatorios estén completos, que el correo electrónico tenga un formato válido y que las contraseñas coincidan.
     * @returns boolean - Retorna true si el formulario es válido, false en caso contrario.
     * @return {boolean}
     */
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
    
    /**
     * Función para manejar el envío del formulario de registro.
     * @param e - Evento de formulario para el registro.
     * @description Maneja el envío del formulario de registro, validando los datos y llam
     * @returns void
     * @return {void}
     */
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
            
            // Definir tipos para el error de GraphQL
            interface GraphQLError {
                message: string;
            }
            
            interface ApolloError {
                message?: string;
                graphQLErrors?: GraphQLError[];
            }
            
            const apolloError = error as ApolloError;
            console.error("Error message:", apolloError?.message);
            console.error("Error graphQLErrors:", apolloError?.graphQLErrors);
            
            // Mejorar el manejo de errores de GraphQL
            let errorMsg = "Error en el registro. Intente nuevamente.";
            
            if (error instanceof Error) {
                errorMsg = error.message;
            } else if (apolloError?.graphQLErrors && apolloError.graphQLErrors.length > 0) {
                errorMsg = apolloError.graphQLErrors[0].message;
            } else if (apolloError?.message) {
                errorMsg = apolloError.message;
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