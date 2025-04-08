'use client';
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div>
      <Header/>
      <div className= "grid flex-1 md:grid-cols-[220px_1fr] text-black bg-white">
        <aside className="hidden border-r md:block h-full">
          <Sidebar />
        </aside>
        <main className="flex-1 p-4">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Resumen</h1>
            <p className="text-gray-700">Esta es una aplicación de ejemplo.</p>
          </div>
        </main>
        </div>
    </div>
  );
}
