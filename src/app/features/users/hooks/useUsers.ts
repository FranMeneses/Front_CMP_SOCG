import { useState } from "react";
import { IUpdateUserInput, IUser } from "@/app/models/IAuth";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USERS, UPDATE_USER, REMOVE_USER } from "@/app/api/Auth";

export function useUsers() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);

    /**
     * Función para obtener el token de autenticación del localStorage.
     * @description Verifica si el objeto window está definido (para evitar errores en SSR) y obtiene el token de autenticación almacenado en localStorage.
     * Si el token no existe, retorna una cadena vacía.
     * @returns {string} Retorna el token de autenticación almacenado en localStorage o una cadena vacía si no existe.
     */
    const getAuthToken = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("token") || '';
        }
        return '';
    };

    const { data: usersData, loading: usersLoading } = useQuery(GET_USERS, {
        context: {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        },
        skip: typeof window === 'undefined'
    });

    const [updateUser] = useMutation(UPDATE_USER, {
        context: {
            headers:{
                Authorization: `Bearer ${getAuthToken()}`,
            }
        }
    })

    const [removeUser] = useMutation(REMOVE_USER, {
        context: {
            headers:{
                Authorization: `Bearer ${getAuthToken()}`,
            }
        }
    })

    const toggleSidebar = () => setIsSidebarOpen((v: boolean) => !v);

    const openUserModal = (user: IUser) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeUserModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };
    
    /**
     * Función para manejar la actualización de un usuario.
     * @description Utiliza la mutación `updateUser` para actualizar los datos del usuario seleccionado.
     * @param userInput 
     * @returns {Promise<void>} Retorna una promesa que se resuelve cuando la actualización se completa.
     * @returns {void}
     */
    const handleUpdateUser = async (userInput: IUpdateUserInput) => {
        try {
            await updateUser({
                variables: {
                    id: selectedUser?.id_usuario,
                    updateUserInput: {
                        full_name: userInput.full_name,
                        email: userInput.email,
                        id_rol: userInput.id_rol,
                        organization: userInput.organization,
                        is_active: userInput.is_active !== undefined ? userInput.is_active : true,
                    }
                },
                refetchQueries: [{ query: GET_USERS }],
            });
        } catch (error) {
            console.error("Error updating user:", error);
        }
    }

    const openDeleteModal = (userId: string) => {
        setUserToDeleteId(userId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setUserToDeleteId(null);
        setIsDeleteModalOpen(false);
    };

    /**
     * Función para manejar la eliminación de un usuario.
     * @description Utiliza la mutación `removeUser` para eliminar al usuario seleccionado por su ID.
     * Si el ID del usuario a eliminar no está definido, la función no hace nada.
     * @returns {Promise<void>} Retorna una promesa que se resuelve cuando el usuario es eliminado.
     * @returns {void}
     */
    const handleDeleteUser = async () => {
        if (!userToDeleteId) return;
        
        try {
            await removeUser({
                variables: {
                    id: userToDeleteId
                },
                refetchQueries: [{ query: GET_USERS }],
            });
            closeDeleteModal();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return {
        usersLoading,
        isSidebarOpen,
        usersData: usersData || { users: [] },
        isModalOpen,
        selectedUser,
        openUserModal,
        closeUserModal,
        toggleSidebar,
        handleUpdateUser,
        isDeleteModalOpen,
        userToDeleteId,
        openDeleteModal,
        closeDeleteModal,
        handleDeleteUser,
    };
}