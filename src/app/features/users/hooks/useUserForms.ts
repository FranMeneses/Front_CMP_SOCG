import { useMemo, useState } from "react";
import { IRol, IUpdateUserInput, IUser } from "@/app/models/IAuth";
import { useQuery } from "@apollo/client";
import { GET_ROLES } from "@/app/api/Auth";

export interface UserFormState {
    full_name: string;
    email: string;
    role: string;
    organization: string;
    is_active?: boolean;
}

export interface UseUserFormsProps {
    userData?: IUser;
    onSave: (userInput: IUpdateUserInput) => void;
}

export function useUserForms({ userData, onSave }: UseUserFormsProps) {
    const { data: rolesData } = useQuery(GET_ROLES);

    const roles: IRol[] = rolesData?.roles || [];
    const rolesName = roles.map((role: IRol) => role.nombre);

    const [formState, setFormState] = useState<UserFormState>({
        full_name: userData?.full_name || "",
        email: userData?.email || "",
        role: userData?.rol?.nombre || "",
        organization: userData?.organization || "",
        is_active: userData?.is_active || undefined,
    });

    /**
     * Función para manejar los cambios en los campos del formulario.
     * @description Actualiza el estado del formulario con el valor ingresado por el usuario.
     * @param field 
     * @param value 
     * @returns {void}
     */
    const handleInputChange = (field: keyof UserFormState, value: string) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    /**
     * Función para manejar el guardado del formulario.
     * @description Prepara los datos del usuario y llama a la función onSave con los datos actualizados.
     * @param e Evento de formulario opcional.
     * @returns {void}
     */
    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const userInput: IUpdateUserInput = {
            full_name: formState.full_name,
            email: formState.email,
            id_rol: roles.find((role: IRol) => role.nombre === formState.role)?.id_rol
                ? Number(roles.find((role: IRol) => role.nombre === formState.role)?.id_rol)
                : undefined,
            organization: formState.organization,
            is_active: formState.is_active !== undefined ? formState.is_active : true, 
        };
        onSave(userInput);
    };

    const dropdownItems = useMemo(() => ({
        roles: rolesName || [],
    }), [rolesName]);

    return {
        formState,
        dropdownItems,
        setFormState,
        handleInputChange,
        handleSave,
    };
}