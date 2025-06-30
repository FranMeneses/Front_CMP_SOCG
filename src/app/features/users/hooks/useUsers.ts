import { useState } from "react";
import { IUpdateUserInput, IUser } from "@/app/models/IAuth";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USERS, UPDATE_USER } from "@/app/api/Auth";

export function useUsers() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

    const { data: usersData, loading: usersLoading } = useQuery(GET_USERS, {
        context: {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    });

    const [updateUser] = useMutation(UPDATE_USER, {
        context: {
            headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        }
    })

    const toggleSidebar = () => setIsSidebarOpen((v) => !v);

    const openUserModal = (user: IUser) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeUserModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };
    
    const handleUpdateUser = async (userInput: IUpdateUserInput) => {
        try {
            console.log("Updating user with input:", userInput);
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

    return {
        usersLoading,
        isSidebarOpen,
        usersData,
        isModalOpen,
        selectedUser,
        openUserModal,
        closeUserModal,
        toggleSidebar,
        handleUpdateUser,
    };
}