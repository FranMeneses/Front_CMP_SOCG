'use client';
import React, { useState } from 'react';
import { IDocumentList } from '@/app/models/IDocuments';
import { useDocumentsRest } from '../hooks/useDocumentsRest';
import { Trash } from 'lucide-react';
import { useDocumentsGraph } from '../hooks/useDocumentsGraph';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

interface DocumentTableProps {
  documents: IDocumentList[];
}

export const DocumentTable = ({ documents }: DocumentTableProps) => {
  const { handleDownload } = useDocumentsRest();
  const { handleDeleteDocument } = useDocumentsGraph();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  const handleDeleteClick = (documentId: string) => {
    setDocumentToDelete(documentId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      handleDeleteDocument(documentToDelete);
      setIsDeleteModalOpen(false);
      setDocumentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDocumentToDelete(null);
  };

  return (
    <>
    <div className="overflow-x-auto rounded-lg font-[Helvetica]">
      <table className="min-w-full">
        <thead>
          <tr className="text-black uppercase text-sm leading-normal">
            <th className='py-3 px-6 text-center border-b border-gray-300'></th>
            <th className="py-3 px-6 text-center border-b border-gray-300">Nombre</th>
            <th className="py-3 px-6 text-center border-b border-gray-300">Fecha</th>
            <th className="py-3 px-6 text-center border-b border-gray-300">Tipo</th>
            <th className="py-3 px-6 text-center border-b border-gray-300">Iniciativa</th>
            <th className="py-3 px-6 text-center border-b border-gray-300">Subtarea</th>
            <th className='py-3 px-6 text-center border-b border-gray-300'></th>
          </tr>
        </thead>
        <tbody className="cursor-pointer text-sm text-gray-700">
          {documents && documents.length > 0 ? (
            documents.map((doc, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b border-gray-300">
                  <div className="flex items-center">
                    <img
                      src="/pdfIcon.png"
                      alt="PDF Icon"
                      className="w-6 h-6 mr-2"
                    />
                  </div>
                </td>
                <td className="px-4 py-2 text-center border-b border-gray-300 text-blue-900" 
                  onClick={() => handleDownload(doc.id_documento)}>
                  {doc.nombre_archivo ? decodeURIComponent(escape(doc.nombre_archivo)) : 'Sin nombre'}
                </td>
                <td className="px-4 py-2 text-center border-b border-gray-300 truncate">
                  {doc.fecha_carga ? new Date(doc.fecha_carga).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-4 py-2 text-center border-b border-gray-300">
                  {doc.tipo_doc.tipo_documento || 'N/A'}
                </td>
                <td className="px-4 py-2 text-center border-b border-gray-300">
                  {doc.tarea?.name || 'N/A'}
                </td>
                <td className='px-4 py-2 text-center border-b border-gray-300'>
                  {doc.subtarea?.name || 'N/A'}
                </td>
                <td className='px-4 py-2 text-center border-b border-gray-300'>
                  <Trash
                    className="w-5 h-5 cursor-pointer"
                    color='#041e3e'
                    onClick={() => handleDeleteClick(doc.id_documento)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-4 py-2 text-center border-b border-gray-300">
                No hay documentos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemType="documento"
      />
    </>
  );
};