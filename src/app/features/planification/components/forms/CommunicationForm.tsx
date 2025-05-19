import DropdownMenu from "@/components/Dropdown";
import { Button } from "@/components/ui/button";

interface CommunicationFormProps {
    onSave: any; // TODO: Define the type for the task object
    onCancel: () => void;

}

export default function CommunicationForm({ onSave, onCancel}: CommunicationFormProps) {

    return (
        <div data-test-id="communication-form">
            <div className="mb-4 truncate">
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                    type="text"
                    value= {""}
                    onChange={(e) => console.log(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    data-test-id="communication-title-input"
                />
            </div>
            <div className="mb-4 truncate">
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <input
                    type="text"
                    value= {""}
                    onChange={(e) => console.log(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    data-test-id="communication-description-input"
                />
            </div>
            <div className="mb-4">
                <DropdownMenu
                    buttonText="Seleccione valle"
                    isInModal={true}
                    items={[]} /*TODO: AGREGAR VALLES*/
                    onSelect={(item) => console.log(item)}
                    data-test-id="communication-valley-dropdown"
                />
            </div>
            <div className="mb-4">
                <DropdownMenu
                    buttonText="Seleccione faena"
                    isInModal={true}
                    items={[]} /*TODO: AGREGAR FAENAS*/
                    onSelect={(item) => console.log(item)}
                    data-test-id="communication-faena-dropdown"
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
                    onClick={() => console.log("Guardar")}
                    className="bg-[#0d4384] hover:bg-[#112339] text-white disabled:bg-[#747474c6]"
                    data-test-id="save-button"
                >
                Guardar
                </Button>
            </div>
        </div>
    );
}