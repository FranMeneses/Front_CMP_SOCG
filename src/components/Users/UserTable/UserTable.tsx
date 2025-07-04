import React from "react";
import { IUser } from "@/app/models/IAuth";
import { ZoomIn, Trash } from "lucide-react";

interface UserTableProps {
    users: IUser[];
    onEditUser: (user: IUser) => void;
    onDeleteUser: (userId: string) => void;
    userRole: string;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEditUser, onDeleteUser, userRole }) => (
    <div className="overflow-x-auto rounded-lg shadow font-[Helvetica]">
        <table className="w-full">
            <thead className="bg-gray-100">
                <tr className="text-sm text-gray-700">
                    <th className="py-2 text-center text-xs font-medium text-gray-500">{("Nombre").toUpperCase()}</th>
                    <th className="py-2 text-center text-xs font-medium text-gray-500">{("Email").toUpperCase()}</th>
                    <th className="py-2 text-center text-xs font-medium text-gray-500">{("Rol").toUpperCase()}</th>
                    <th className="py-2 text-center text-xs font-medium text-gray-500">{("Estado").toUpperCase()}</th>
                    <th className="py-2 text-center text-xs font-medium text-gray-500"></th>
                </tr>
            </thead>
            <tbody className="bg-white text-xs divide-y divide-[#e5e5e5]">
                {users.map(user => (
                    <tr key={user.id_usuario} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2 text-center border-r">{user.full_name}</td>
                        <td className="px-4 py-2 text-center border-r">{user.email}</td>
                        <td className="px-4 py-2 text-center border-r">{user.rol.nombre}</td>
                        <td className="px-4 py-2 text-center border-r">
                            <span
                                className={`px-4 py-1 rounded-full
                                    ${user.is_active
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"}
                                `}
                            >
                                {user.is_active ? "Activo" : "Inactivo"}
                            </span>
                        </td>
                        <td className="px-4 py-2 text-center">
                            <div className="flex justify-center items-center gap-2">
                                <ZoomIn
                                    onClick={() => onEditUser(user)}
                                    color="#082C4B"
                                    className="cursor-pointer"
                                    size={20}
                                />
                                {userRole === 'Admin' && (
                                    <Trash
                                        onClick={() => onDeleteUser(user.id_usuario)}
                                        color="#082C4B"
                                        className="cursor-pointer"
                                        size={20}
                                    />
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {users.length === 0 && (
            <div className="text-center py-8 text-gray-500">
                No hay usuarios registrados.
            </div>
        )}
    </div>
);

export default UserTable;