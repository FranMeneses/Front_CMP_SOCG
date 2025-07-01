'use client';
import { Button } from "@/components/ui/button";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useHooks } from "../hooks/useHooks";
import { useQuery } from "@apollo/client";
import { VALIDATE_RESET_TOKEN } from "@/app/api/Auth";

function ResetPasswordContent() {
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string>("");
  const [isValidatingToken, setIsValidatingToken] = useState<boolean>(true);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleResetPassword } = useHooks();

  // Obtener token de la URL
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setErrorMessage("Token de recuperación no encontrado en la URL");
      setIsValidatingToken(false);
    }
  }, [searchParams]);

  // Validar token cuando se obtiene
  const { data: tokenValidation, loading: tokenLoading, error: tokenError } = useQuery(
    VALIDATE_RESET_TOKEN,
    {
      variables: { token },
      skip: !token,
      onCompleted: (data) => {
        setIsValidatingToken(false);
        if (!data.validateResetToken.valid) {
          setErrorMessage(data.validateResetToken.message || "Token inválido");
        }
      },
      onError: (error) => {
        setIsValidatingToken(false);
        console.error("Error validating token:", error);
        setErrorMessage("Error al validar el token de recuperación");
      }
    }
  );

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    
    if (errorMessage) {
      setErrorMessage(null);
    }
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (errorMessage) {
      setErrorMessage(null);
    }
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      setErrorMessage("Por favor complete todos los campos");
      return;
    }

    if (!validatePassword(newPassword)) {
      setErrorMessage("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    try {
      setIsButtonDisabled(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const response = await handleResetPassword({
        token: token,
        newPassword: newPassword
      });

      if (response?.success) {
        setSuccessMessage(response.message);
        setNewPassword("");
        setConfirmPassword("");
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        setErrorMessage("Error al cambiar la contraseña. Intente más tarde.");
      }
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      setErrorMessage(error instanceof Error ? error.message : "Error al cambiar la contraseña. Intente más tarde.");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  // Mostrar loading mientras valida token
  if (isValidatingToken || tokenLoading) {
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
              Validando enlace de recuperación...
            </h1>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#153C6C]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error si token es inválido
  if (tokenError || (tokenValidation && !tokenValidation.validateResetToken.valid)) {
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
              Enlace de Recuperación Inválido
            </h1>
            
            <div className="w-full p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage || "El enlace de recuperación no es válido o ha expirado"}
            </div>
            
            <Button
              className="bg-[#153C6C] hover:bg-[#0e2c56] text-white py-2 rounded-lg transition duration-200"
              onClick={() => router.push('/features/forgotPassword')}
            >
              Solicitar nuevo enlace
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            Restablecer Contraseña
          </h1>
          <h2 className="text-xl text-zinc-600 font-medium mb-4">Ingrese su nueva contraseña</h2>
          
          {errorMessage && (
            <div className="w-full p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="w-full p-3 mb-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
              <br />
              <span className="text-sm">Será redirigido al inicio de sesión en unos segundos...</span>
            </div>
          )}
          
          <form className="flex flex-col w-full gap-4 font-sans justify-center mt-4"
            onSubmit={onSubmit}
            data-test-id="reset-password-form"
          >
            <input
              type="password"
              placeholder="Nueva contraseña (mínimo 8 caracteres)"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-[#153C6C]"
              value={newPassword}
              onChange={handlePasswordChange}
              data-test-id="reset-password-new"
              disabled={isButtonDisabled}
            />
            
            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-[#153C6C]"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              data-test-id="reset-password-confirm"
              disabled={isButtonDisabled}
            />
            
            <Button
              className={`py-2 rounded-lg transition duration-200 ${
                isButtonDisabled || successMessage
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-[#153C6C] hover:bg-[#0e2c56] cursor-pointer"
              } text-white mt-4`}
              type="submit"
              disabled={isButtonDisabled || !!successMessage}
              data-test-id="reset-password-button"
            >
              {isButtonDisabled ? "Procesando..." : "Cambiar contraseña"}
            </Button>
          </form>
          
          <div className="flex flex-col items-center mt-8 space-y-2">
            <Button
              variant={"link"}
              className="text-[#0e70e8] text-center hover:text-[#08203d] transition duration-200 hover:underline cursor-pointer"
              onClick={() => router.push('/')}
              data-test-id="back-to-login"
              disabled={isButtonDisabled}
            >
              Volver al inicio de sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
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
            Cargando...
          </h1>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#153C6C]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
} 