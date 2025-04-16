'use client'
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ArrowUpFromLine } from 'lucide-react';
import {documents} from '../../../mocks/documentsMock'
import LoadingSpinner from "@/components/LoadinSpinner";
import { useState, useEffect, useRef } from "react";

export default function Documents() {
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); 
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log(file);
        }
    }

    useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false); 
      }, 2000);
  
      return () => clearTimeout(timer);
    }, []);
  
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner/>
        </div>
      );
    }
    
    return (
        <div className="overflow-x-hidden">
        <Header />
        <div className="grid flex-1 md:grid-cols-[220px_1fr] text-black bg-white">
            <aside className="hidden border-r md:block h-full">
            <Sidebar />
            </aside>
            <main className="flex-1 p-4">
                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl font-bold">Centro Documental</h1>
                    <div className="flex flex-row ">
                        <div className="w-full ml-4">
                            <button className="flex flex-row items-center p-4 rounded-lg mb-4 cursor-pointer" onClick={() => {handleUpload()}}>
                                <ArrowUpFromLine className="text-black" size={24} />
                                <span className="ml-2">Subir archivo</span>
                            </button>
                            <input 
                                type="file"
                                accept=".pdf"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <div className="overflow-x-auto rounded-lg">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="text-black uppercase text-sm leading-normal">
                                            <th className="py-3 px-6 text-center border-b border-gray-300">Nombre</th>
                                            <th className="py-3 px-6 text-center border-b border-gray-300">Fecha</th>
                                            <th className="py-3 px-6 text-center border-b border-gray-300">Tipo</th>
                                            <th className="py-3 px-6 text-center border-b border-gray-300">Iniciativa</th>
                                        </tr>
                                    </thead>
                                    <tbody className="cursor-pointer text-sm text-gray-700">
                                        {documents.map((doc: { name: string; date: string; type: string; initiative: string }, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 flex items-center border-b border-gray-300">
                                                    <img
                                                        src="/pdfIcon.png"
                                                        alt="PDF Icon"
                                                        className="w-6 h-6 mr-2"
                                                    />
                                                    {doc.name}
                                                </td>
                                                <td className="px-4 py-2 text-center border-b border-gray-300">{doc.date}</td>
                                                <td className="px-4 py-2 text-center border-b border-gray-300">{doc.type}</td>
                                                <td className="px-4 py-2 text-center border-b border-gray-300">{doc.initiative}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
        </div>
    );
}