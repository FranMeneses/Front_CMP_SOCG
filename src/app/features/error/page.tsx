'use client'
import Image from "next/image";
import Link from "next/link";

export default function ErrorPage() {
    return (
        <div className="flex items-center justify-center h-screen bg-[#001f3f] font-[Helvetica]">
            <div className="text-center flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
                <div>
                    <Image
                        src="/CMP-Azul.webp"
                        alt="Logo"
                        width={400}
                        height={200}
                        className="object-contain"
                        priority
                    />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Acceso no autorizado</h1>
                <p className="text-lg text-gray-700">No tiene acceso al portal, porfavor utilizar correo institucional para ingresar.</p>
                <Link href="/" className="mt-6 text-[#003f7f] hover:underline">
                    Inicio de sesión
                </Link>
            </div>
        </div>
    );
}