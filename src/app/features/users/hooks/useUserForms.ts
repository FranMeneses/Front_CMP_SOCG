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

    const handleInputChange = (field: keyof UserFormState, value: string) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

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