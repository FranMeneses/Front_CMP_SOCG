import { IUpdateUserInput, IUser } from "@/app/models/IAuth";
import DropdownMenu from "../Dropdown";
import { useUserForms } from "@/app/features/users/hooks/useUserForms";
import { Button } from "../ui/button";

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
        <form onSubmit={handleSave} className="p-4 flex flex-col gap-4">
            <div className='font-[Helvetica]' data-test-id="users-form">
                <h2 className="text-lg font-semibold mb-4">Editar usuario</h2>        
                <div className="form-field">
                    <label className="form-label required">Nombre</label>
                    <input
                        type="text"
                        value={formState.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        className="form-input"
                        data-test-id="user-full_name-input"
                        required
                    />
                </div>
                <div className="form-field">
                    <label className="form-label required">Correo electrónico</label>
                    <input
                        type="email"
                        value={formState.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="form-input"
                        data-test-id="user-email-input"
                        required
                    />
                </div>
                <div className="form-field">
                    <label className="form-label required">Rol</label>
                    <DropdownMenu
                        buttonText={formState.role ? formState.role : "Seleccione el rol del usuario"}
                        isInModal={true}
                        items={dropdownItems.roles}
                        onSelect={(value) => handleInputChange ('role', value)}
                        selectedValue={userData?.rol.nombre ? dropdownItems.roles.find((role: string) => role === userData.rol.nombre) : ""}
                        data-test-id="users-role-dropdown"
                    />
                </div>
                <div className="form-field">
                    <label className="form-label required">Organización</label>
                    <input
                        type="text"
                        value={formState.organization}
                        onChange={(e) => handleInputChange('organization', e.target.value)}
                        className="form-input"
                        data-test-id="user-organization-input"
                        required
                    />
                </div>
                <div className="form-field">
                    <label className="form-label">Estado</label>
                    <DropdownMenu
                        buttonText={formState.is_active ? "Activo" : "Inactivo"}
                        isInModal={true}
                        items={["Activo", "Inactivo"]}
                        onSelect={(value) => handleInputChange('is_active', (value === "Activo").toString())}
                        selectedValue={formState.is_active ? "Activo" : "Inactivo"}
                        data-test-id="users-status-dropdown"
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <Button
                        variant="secondary"
                        onClick={onCancel}
                        className="bg-gray-200 hover:bg-gray-300 cursor-pointer"
                        data-test-id="cancel-button"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleSave}
                        className="bg-[#0068D1] hover:bg-[#0056A3] text-white disabled:bg-[#747474c6]"
                        data-test-id="save-button"
                    >
                        Guardar
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default UserForm;