import { useMemo, useState } from 'react';
import { IRegisterInput, IRol } from "@/app/models/IAuth";
import { useHooks } from '../../hooks/useHooks';
import { useQuery } from '@apollo/client';
import { GET_ROLES } from '@/app/api/Auth';

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
        id_rol: 0,
        organization: "",
    });

    const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
    const [emailValid, setEmailValid] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    const {data: dataRoles} = useQuery(GET_ROLES);

    const roles = dataRoles?.roles || [];

    const rolesOptions = roles.map((rol: IRol) => rol.nombre);

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
    
    const handleRoleSelect = (roleId: number) => {
        setFormState({
            ...formState,
            id_rol: roleId
        });
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

    const dropdownItems = useMemo(() => ({
        roles: rolesOptions || [],
    }), [rolesOptions]);

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
        dropdownItems,
        isFormValid,
        roles,
        handleInputChange,
        handleRoleSelect,
        handleRegister
    };
}