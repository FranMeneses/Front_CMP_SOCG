'use client';
import { Button } from "@/components/ui/button";
import { useFormRegistry } from "./hooks/useFormRegistry";
import DropdownMenu from "@/components/Dropdown";
import { IRol } from "@/app/models/IAuth";

export default function Home() {
  const {
    formState,
    passwordMatch,
    emailValid,
    dropdownItems,
    isFormValid,
    isSubmitting,
    errorMessage,
    roles,
    handleInputChange,
    handleRoleSelect,
    handleRegister
  } = useFormRegistry();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <div className="relative h-full w-full">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
        >
          <source src="/LoginBg1.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="hidden md:flex bg-[#153C6C] items-center justify-center flex-col relative font-[Helvetica]">
        <div className="flex flex-col w-3/5 h-4/5 items-center bg-white rounded-lg shadow-lg p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-4 text-zinc-900 text-center">
            Bienvenido al sistema de Gestión y Control Gerencia de Gestión de Riesgos y Sostenibilidad
          </h1>
          <h2 className="text-xl text-zinc-600 font-medium mb-4">Ingrese sus datos para registrarse</h2>
          
          {errorMessage && (
            <div className="w-full p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}
          
          <form className="flex flex-col w-full gap-4 font-sans justify-center"
            onSubmit={handleRegister}
            data-test-id="register-form"
          >
            <div className="flex flex-col w-full">
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                className={`border rounded-lg p-2 focus:outline-none focus:border-[#153C6C] ${
                  !emailValid && formState.email ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formState.email}
                onChange={handleInputChange}
                data-test-id="register-email"
              />
              {!emailValid && formState.email && (
                <p className="text-red-500 text-sm mt-1">Formato de correo inválido (ejemplo: nombre@dominio.com)</p>
              )}
            </div>
            
            <input
              type="text"
              name="full_name"
              placeholder="Nombre completo"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-[#153C6C]"
              value={formState.full_name}
              onChange={handleInputChange}
              data-test-id="register-fullname"
            />
            
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className={`border rounded-lg p-2 focus:outline-none focus:border-[#153C6C] ${
                !passwordMatch && formState.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formState.password}
              onChange={handleInputChange}
              data-test-id="register-password"
            />
            
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              className={`border rounded-lg p-2 focus:outline-none focus:border-[#153C6C] ${
                !passwordMatch && formState.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formState.confirmPassword}
              onChange={handleInputChange}
              data-test-id="register-confirm-password"
            />
            
            {!passwordMatch && formState.confirmPassword && (
              <p className="text-red-500 text-sm -mt-2">Las contraseñas no coinciden</p>
            )}
            
            <DropdownMenu
              buttonText="Seleccionar Rol"
              items={dropdownItems.roles}
              onSelect={(roleId) => handleRoleSelect(Number(roleId))}
              isInModal={true}
              selectedValue={roles.find((role:IRol) => role.id_rol === formState.id_rol)?.nombre || "Seleccionar Rol"}
            />
            
            <input
              type="text"
              name="organization"
              placeholder="Organización"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-[#153C6C]"
              value={formState.organization}
              onChange={handleInputChange}
              data-test-id="register-organization"
            />
            
            <Button
              className={`py-2 rounded-lg transition duration-200 ${
                !isFormValid || isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#153C6C] hover:bg-[#0e2c56] cursor-pointer'
              } text-white`}
              type="submit"
              data-test-id="register-button"
              disabled={!isFormValid || isSubmitting} 
            >
              {isSubmitting ? "Procesando..." : "Registrarse"}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-zinc-600">
              ¿Ya tienes cuenta?{" "}
              <Button
                variant={"link"}
                className={`text-[#0e70e8] hover:text-[#08203d] transition duration-200 hover:underline p-0`}
                onClick={() => window.location.href = '/'}
              >
                Inicia sesión
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}