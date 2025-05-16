'use client';
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useHooks } from "./features/hooks/useHooks";

export default function Home() {

  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const {handleLoginRedirect} = useHooks();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    setTimeout(e => {
      setIsButtonDisabled(false);
    }, 5000, e);
    handleLoginRedirect('gerente');
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

      <div className="hidden md:flex bg-[#153C6C] items-center justify-center flex-col relative">
        <div className="flex flex-col w-3/5 h-3/4 items-center bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4 text-zinc-900 text-center">
            Bienvenido al sistema Planificados
          </h1>
          <h2 className="text-xl text-zinc-600 font-medium">Ingrese sus datos</h2>
          <form className="flex flex-col w-full h-3/4 gap-4 font-sans justify-center"
            onSubmit={handleLogin}
            data-test-id="login-form"
          >
            <input
              type="text"
              placeholder="Correo electrónico"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-[#153C6C]"
              value={user || ""}
              onChange={(e) => setUser(e.target.value)}
              data-test-id="login-email"
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-[#153C6C]"
              value={password || ""}
              onChange={(e) => setPassword(e.target.value)}
              data-test-id="login-password"
            />
            <Button
              className={`py-2 rounded-lg transition duration-200 ${isButtonDisabled ? "bg-[#08203d] text-white cursor-not-allowed" : "bg-[#367acd] text-white hover:bg-[#08203d] cursor-pointer"}`}
              type="submit"
              disabled={isButtonDisabled}
              data-test-id="login-button"
            >
              Iniciar sesión
            </Button>
          </form>
            <Button
              variant={"link"}
              className={`text-[#0e70e8] text-center hover:text-[#08203d] transition duration-200 hover:underline ${isButtonDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
              disabled={isButtonDisabled}
              data-test-id="login-forgot-password"
            >
              ¿Olvidaste tu contraseña?
          </Button>
        </div>
      </div>
    </div>
  );
}