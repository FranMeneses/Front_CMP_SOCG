'use client';
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import Modal from "@/components/Modal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { useHooks } from "../hooks/useHooks";
import { useUsers } from "./hooks/useUsers";
import UserTable from "@/components/Users/UserTable/UserTable";
import UserForm from "@/components/Users/UserForm";
import Image from "next/image";

export default function UsersPage() {
    const {
        usersLoading,
        isSidebarOpen,
        usersData,
        isModalOpen,
        selectedUser,
        openUserModal,
        closeUserModal,
        toggleSidebar,
        handleUpdateUser,
        isDeleteModalOpen,
        openDeleteModal,
        closeDeleteModal,
        handleDeleteUser,
    } = useUsers();

    const { userRole, handleLogout } = useHooks();
    let userName = '';
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userObj = JSON.parse(userStr);
                userName = userObj.full_name || userObj.name || '';
            } catch {}
        }
    }

    if (usersLoading) {
        return (
            <div className="min-h-screen w-full">
                <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} data-test-id="header" userName={userName} userRole={userRole} />
                <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
                    <LoadingSpinner data-test-id="loading-spinner" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#F2F2F2]">
            <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} data-test-id="header" userName={userName} userRole={userRole} />
            <div
                className={`grid ${
                    isSidebarOpen ? "grid-cols-[220px_1fr]" : "grid-cols-1"
                }`}
            >
                {isSidebarOpen && (
                    <aside
                        className={`border-r ${
                            isSidebarOpen
                                ? "fixed top-[5rem] left-0 w-full h-[calc(100vh-5rem)] bg-white z-1000 sm:top-0 sm:left-0 sm:w-[220px] sm:relative sm:h-auto sm:bg-transparent overflow-y-auto"
                                : ""
                        }`}
                        data-test-id="sidebar"
                    >
                        <Sidebar userRole={userRole} onNavClick={toggleSidebar} handleLogout={handleLogout}/>
                    </aside>
                )}
                <main className="flex-1 bg-[#F2F2F2] font-[Helvetica]">
                    <div className="flex flex-col gap-6 w-full font-[Helvetica] min-w-0 px-8 lg:px-12 xl:px-16 py-6">
                        <div className="bg-white rounded-lg shadow">
                            <div className="flex flex-row gap-4 items-center px-6 pt-6 pb-4 border-b border-gray-200">
                                <Image
                                    src={'/Caja6GRP.png'}
                                    alt="Users Icon"
                                    width={100}
                                    height={100}
                                />
                                <h1 className="text-3xl font-bold">USUARIOS</h1>
                            </div>

                            <div className="p-4">
                                <UserTable
                                    users={usersData?.users || []}
                                    onEditUser={openUserModal}
                                    onDeleteUser={openDeleteModal}
                                    userRole={userRole}
                                    data-test-id="users-table"
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => closeUserModal()} data-test-id="user-modal">
                    <UserForm
                        userData={selectedUser ?? undefined}
                        onSave={(userInput) => {
                            handleUpdateUser(userInput);
                            closeUserModal();
                        }}
                        onCancel={closeUserModal}
                    />
            </Modal>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteUser}
                itemType="usuario"
            />
        </div>
    );
}