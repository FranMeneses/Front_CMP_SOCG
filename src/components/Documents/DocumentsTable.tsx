'use client';
import React, { useState } from 'react';
import { IDocumentList } from '@/app/models/IDocuments';
import { useDocumentsRest } from '@/app/features/documents/hooks/useDocumentsRest';
import { Trash } from 'lucide-react';
import { useDocumentsGraph } from '@/app/features/documents/hooks/useDocumentsGraph';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import Image from 'next/image';

interface DocumentTableProps {
  documents: IDocumentList[];
}

// Utilidad para formatear fecha yyyy-mm-dd a dd-mm-yyyy
const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A';
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;
  return `${day}-${month}-${year}`;
};

export const DocumentTable = ({ documents }: DocumentTableProps) => {
  const { handleDownload, handleDelete } = useDocumentsRest();
  // Solo necesitamos refetch del hook GraphQL para actualizar la lista después del borrado
  const { refetch } = useDocumentsGraph();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (documentId: string) => {
    setDocumentToDelete(documentId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (documentToDelete && !isDeleting) {
      setIsDeleting(true);
      try {
        await handleDelete(documentToDelete);
        console.log('Documento eliminado exitosamente');
        // Refrescar la lista de documentos después del borrado
        await refetch();
      } catch (error) {
        console.error('Error al eliminar documento:', error);
        // Aquí podrías agregar un toast de error si tienes un sistema de notificaciones
      } finally {
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        setDocumentToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
      setDocumentToDelete(null);
    }
  };

  return (
    <>
      <div className="p-4">
        <div className="overflow-x-auto font-[Helvetica]">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr className="text-sm text-gray-700">
                <th className='py-3 text-center text-xs font-medium text-gray-500 border-r border-gray-200'></th>
                <th className="py-3 text-center text-xs font-medium text-gray-500 border-r border-gray-200">{("Nombre").toUpperCase()}</th>
                <th className="py-3 text-center text-xs font-medium text-gray-500 border-r border-gray-200">{("Fecha de Subida").toUpperCase()}</th>
                <th className="py-3 text-center text-xs font-medium text-gray-500 border-r border-gray-200">{("Tipo").toUpperCase()}</th>
                <th className="py-3 text-center text-xs font-medium text-gray-500 border-r border-gray-200">Iniciativa</th>
                <th className='py-3 text-center text-xs font-medium text-gray-500'>{("Acciones").toUpperCase()}</th>
              </tr>
            </thead>
            <tbody className="bg-white text-xs truncate divide-y divide-gray-200">
              {documents && documents.length > 0 ? (
                documents.map((doc, index) => (
                  <tr key={index} className="hover:bg-gray-50 border-b border-gray-200">
                    <td className="px-4 py-3 border-r border-gray-200">
                      <div className="flex items-center justify-center">
                        <Image
                          src="/pdfIcon.png"
                          alt="PDF Icon"
                          width={24}
                          height={24}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center border-r border-gray-200 text-blue-900 cursor-pointer" 
                      onClick={() => handleDownload(doc.id_documento)}>
                      {doc.nombre_archivo ? doc.nombre_archivo : 'Sin nombre'}
                    </td>
                    <td className="px-4 py-3 text-center border-r border-gray-200 truncate">
                      {doc.fecha_carga ? formatDate(doc.fecha_carga as string) : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-center border-r border-gray-200">
                      {doc.tipo_doc.tipo_documento || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-center border-r border-gray-200">
                      {doc.tarea?.name || 'N/A'}
                    </td>
                    <td className='px-4 py-3 text-center'>
                      <Trash
                        className={`w-5 h-5 cursor-pointer mx-auto ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        color='#082C4B'
                        onClick={() => !isDeleting && handleDeleteClick(doc.id_documento)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No hay documentos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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