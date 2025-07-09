import React from 'react';
import { ZoomIn, Trash } from "lucide-react";
import { IHistory } from '@/app/models/IHistory';

interface HistoryRowProps {
  history: IHistory;
  onViewDetails: (history: IHistory) => void;
  onDelete?: (historyId: string) => void;
  userRole?: string;
}

const HistoryRow: React.FC<HistoryRowProps> = ({
  history,
  onViewDetails,
  onDelete,
  userRole
}) => {
  
  return (
    <tr className='font-[Helvetica] hover:bg-gray-50 transition-colors duration-200'>
      <td
        className={`px-4 py-2 text-left text-black font-semibold`}
      >
        {history.name?.toUpperCase()}
      </td>
      <td className="px-2 py-2 text-center">
        {history.finalDate ?
          new Date(history.finalDate).toLocaleDateString('es-CL', {
            timeZone: 'UTC'
          }) : '-'
        }
      </td>
      <td className="px-2 py-2 text-center">
        {history.process?.name.toUpperCase() || '-'}
      </td>
      <td className="px-2 py-2 text-center">
        {history.valley?.name.toUpperCase() || '-'}
      </td>
      <td className="px-2 py-2 text-center">
        {history.faena?.name.toUpperCase() || '-'}
      </td>
      <td className="px-4 py-2 text-center flex flex-row justify-center items-center">
        <ZoomIn
          size={20}
          color="#041e3e"
          className="cursor-pointer mr-4 hover:scale-110 transition-transform"
          onClick={() => onViewDetails(history)}
        />
        {userRole === 'Admin' && onDelete && (
          <Trash
            size={20}
            color="#041e3e"
            className="cursor-pointer hover:scale-110 transition-transform hover:text-red-600"
            onClick={() => onDelete(history.id)}
          />
        )}
      </td>
    </tr>
  );
};

export default HistoryRow;