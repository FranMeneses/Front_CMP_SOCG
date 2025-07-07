import { IUpdateUserInput, IUser } from "@/app/models/IAuth";
import DropdownMenu from "../Dropdown";
import { useUserForms } from "@/app/features/users/hooks/useUserForms";
import { Button } from "../ui/button";
import { Info } from "lucide-react";

interface UserFormProps {
    userData?: IUser;
    onSave: (userInput: IUpdateUserInput) => void;
    onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ userData, onSave, onCancel }) => {
    const {
        formState,
        dropdownItems,
        handleInputChange,
        handleSave
    } = useUserForms({userData, onSave});

    return (
        <form onSubmit={handleSave} className="max-w-xl mx-auto font-[Helvetica]">
            <div className="bg-gray-50 p-8 rounded-md border border-gray-200 mb-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                    <Info className="h-5 w-5 mr-2" />
                    Editar usuario
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-medium mb-1">Nombre</label>
                        <input
                            type="text"
                            value={formState.full_name}
                            onChange={(e) => handleInputChange('full_name', e.target.value)}
                            className="form-input w-full"
                            data-test-id="user-full_name-input"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">Correo electrónico</label>
                        <input
                            type="email"
                            value={formState.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="form-input w-full"
                            data-test-id="user-email-input"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">Rol</label>
                        <DropdownMenu
                            buttonText={formState.role ? formState.role : "Seleccione el rol del usuario"}
                            isInModal={true}
                            items={dropdownItems.roles}
                            onSelect={(value) => handleInputChange ('role', value)}
                            selectedValue={userData?.rol.nombre ? dropdownItems.roles.find((role: string) => role === userData.rol.nombre) : ""}
                            data-test-id="users-role-dropdown"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">Organización</label>
                        <input
                            type="text"
                            value={formState.organization}
                            onChange={(e) => handleInputChange('organization', e.target.value)}
                            className="form-input w-full"
                            data-test-id="user-organization-input"
                            required
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-2 mt-8">
                    <Button
                        variant="secondary"
                        onClick={onCancel}
                        className="bg-gray-200 hover:bg-gray-300 cursor-pointer"
                        data-test-id="cancel-button"
                        type="button"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleSave}
                        className="bg-[#0068D1] hover:bg-[#0056A3] text-white disabled:bg-[#747474c6] cursor-pointer"
                        data-test-id="save-button"
                        type="submit"
                    >
                        Guardar
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default UserForm;