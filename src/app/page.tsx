'use client';
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useHooks } from "./features/hooks/useHooks";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function Home() {
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailValid, setEmailValid] = useState<boolean>(true);

  const { handleLogin } = useHooks();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/features/resume");
    }
  }, [isAuthenticated, router]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUser(value);
    if (value) {
      setEmailValid(validateEmail(value));
    } else {
      setEmailValid(true); 
    }

    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !password) {
      setErrorMessage("Por favor complete todos los campos");
      return;
    }

    if (!validateEmail(user)) {
      setEmailValid(false);
      setErrorMessage("El formato del correo electrónico no es válido");
      return;
    }

    try {
      setIsButtonDisabled(true);
      await handleLogin({
        email: user,
        password: password
      });
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      setErrorMessage(error instanceof Error ? error.message : "Error al iniciar sesión. Verifique sus credenciales.");
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
            BIENVENIDO AL SISTEMA DE PLANIFICACIÓN, CONTROL Y GESTIÓN
          </h1>
          <h2 className="text-xl text-zinc-600 font-medium mb-4">Ingrese sus datos</h2>
          
          {errorMessage && (
            <div className="w-full p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}
          
          <form className="flex flex-col w-full gap-4 font-sans justify-center"
            onSubmit={onSubmit}
            data-test-id="login-form"
          >
            <div className="flex flex-col w-full">
              <input
                type="email"
                placeholder="Correo electrónico"
                className={`border rounded-lg p-2 focus:outline-none focus:border-[#153C6C] ${
                  !emailValid && user ? 'border-red-500' : 'border-gray-300'
                }`}
                value={user}
                onChange={handleEmailChange}
                data-test-id="login-email"
              />
              {!emailValid && user && (
                <p className="text-red-500 text-sm mt-1">Formato de correo inválido (ejemplo: nombre@dominio.com)</p>
              )}
            </div>
            
            <input
              type="password"
              placeholder="Contraseña"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-[#153C6C]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-test-id="login-password"
            />
            
            <Button
              className={`py-2 rounded-lg transition duration-200 ${
                isButtonDisabled || isAuthenticated || isLoading
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-[#153C6C] hover:bg-[#0e2c56] cursor-pointer"
              } text-white`}
              type="submit"
              disabled={isButtonDisabled || isAuthenticated || isLoading}
              data-test-id="login-button"
            >
              {isButtonDisabled ? "Procesando..." : "Iniciar sesión"}
            </Button>
          </form>
          
          <div className="flex flex-col items-center mt-4 space-y-2">
            <Button
              variant={"link"}
              className={`text-[#0e70e8] text-center hover:text-[#08203d] transition duration-200 hover:underline ${
                isButtonDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
              disabled={isButtonDisabled}
              data-test-id="login-forgot-password"
              onClick={() => router.push('/features/forgotPassword')}
            >
              ¿Olvidaste tu contraseña?
            </Button>
            
            <Button
              variant={"link"}
              className={`text-[#0e70e8] text-center hover:text-[#08203d] transition duration-200 hover:underline ${
                isButtonDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
              disabled={isButtonDisabled}
              data-test-id="login-register"
              onClick={() => router.push('/features/registry')}
            >
              Regístrese aquí
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}