'use client';
import React from 'react';

interface Document {
  name: string;
  date: string;
  type: string;
  initiative: string;
}

interface DocumentTableProps {
  documents: Document[];
}

export const DocumentTable = ({ documents }: DocumentTableProps) => {
  return (
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
          {documents.map((doc, index) => (
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
  );
};