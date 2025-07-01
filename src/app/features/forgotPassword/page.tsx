'use client';
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useHooks } from "../hooks/useHooks";

export default function ForgotPassword() {
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [emailValid, setEmailValid] = useState<boolean>(true);
  
  const router = useRouter();
  const { handleRequestPasswordReset } = useHooks();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value) {
      setEmailValid(validateEmail(value));
    } else {
      setEmailValid(true);
    }

    if (errorMessage) {
      setErrorMessage(null);
    }
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setErrorMessage("Por favor ingrese su correo electrónico");
      return;
    }

    if (!validateEmail(email)) {
      setEmailValid(false);
      setErrorMessage("El formato del correo electrónico no es válido");
      return;
    }

    try {
      setIsButtonDisabled(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      // Obtener la URL base del frontend
      const frontendUrl = window.location.origin;
      
      const response = await handleRequestPasswordReset({
        email: email,
        frontendUrl: frontendUrl
      });

      if (response?.success) {
        setSuccessMessage(response.message);
        setEmail("");
      } else {
        setErrorMessage("Error al procesar la solicitud. Intente más tarde.");
      }
    } catch (error) {
      console.error("Error al enviar correo de recuperación:", error);
      setErrorMessage(error instanceof Error ? error.message : "Error al procesar la solicitud. Intente más tarde.");
    } finally {
      setIsButtonDisabled(false);
    }
  };

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
        <div className="flex flex-col w-3/5 h-3/4 items-center bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4 text-zinc-900 text-center">
            RECUPERACIÓN DE CONTRASEÑA
          </h1>
          <h2 className="text-xl text-zinc-600 font-medium mb-4">Ingrese su correo electrónico para recuperar su contraseña</h2>
          
          {errorMessage && (
            <div className="w-full p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="w-full p-3 mb-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}
          
          <form className="flex flex-col w-full gap-4 font-sans justify-center mt-4"
            onSubmit={onSubmit}
            data-test-id="forgot-password-form"
          >
            <div className="flex flex-col w-full">
              <input
                type="email"
                placeholder="Correo electrónico"
                className={`border rounded-lg p-2 focus:outline-none focus:border-[#153C6C] ${
                  !emailValid && email ? 'border-red-500' : 'border-gray-300'
                }`}
                value={email}
                onChange={handleEmailChange}
                data-test-id="forgot-password-email"
              />
              {!emailValid && email && (
                <p className="text-red-500 text-sm mt-1">Formato de correo inválido (ejemplo: nombre@dominio.com)</p>
              )}
            </div>
            
            <Button
              className={`py-2 rounded-lg transition duration-200 ${
                isButtonDisabled 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-[#153C6C] hover:bg-[#0e2c56] cursor-pointer"
              } text-white mt-4`}
              type="submit"
              disabled={isButtonDisabled}
              data-test-id="forgot-password-button"
            >
              {isButtonDisabled ? "Procesando..." : "Enviar enlace de recuperación"}
            </Button>
          </form>
          
          <div className="flex flex-col items-center mt-8 space-y-2">
            <Button
              variant={"link"}
              className="text-[#0e70e8] text-center hover:text-[#08203d] transition duration-200 hover:underline cursor-pointer"
              onClick={() => router.push('/')}
              data-test-id="back-to-login"
            >
              Volver al inicio de sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}