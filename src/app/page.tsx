'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/resume");
  };


  return (
    <div className="grid grid-cols-2 h-screen">
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
      <div className="bg-[#153C6C] items-center justify-center flex flex-col relative">
        <div className="flex w-full justify-between items-center px-8 mt-4">
          <div className="absolute top-4 left-0 ml-4">
            <Image
              src="/CmpLogo.png"
              alt="Logo CMP"
              height={150}
              width={150}
            />
          </div>
        </div>
        <div className="flex flex-col w-3/5 h-3/4 items-center bg-white rounded-lg shadow-lg p-8 ">
          <h1 className="text-3xl font-bold mb-4 text-zinc-900 text-center">Bienvenido al sistema Planificados</h1>
          <h2 className="text-xl mb-4 text-zinc-600 font-medium">Ingrese sus datos </h2>
          <form className="flex flex-col w-full h-3/4 gap-4 font-sans justify-start">
            <input
              type="text"
              placeholder="Correo electrónico"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-[#153C6C]"
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-[#153C6C]"
            />
            <button
              className="bg-[#367acd] text-white py-2 rounded-lg hover:bg-[#08203d] transition duration-200 cursor-pointer"
              onClick={(e) => handleLogin(e)}
            >
              Iniciar sesión
            </button>
            <button
              className="text-[#0e70e8] text-center hover:text-[#08203d] transition duration-200 hover:underline cursor-pointer">
              ¿Olvidaste tu contraseña?
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}