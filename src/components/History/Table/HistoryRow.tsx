import React from 'react';
import { ZoomIn } from "lucide-react";
import { IHistory } from '@/app/models/IHistory';

interface HistoryRowProps {
  history: IHistory;
}

const HistoryRow: React.FC<HistoryRowProps> = ({
  history,
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

      <td className="px-4 py-2 text-center flex flex-row">
        <ZoomIn
          size={20}
          color="#041e3e"
          className="cursor-pointer mr-4"
        />
      </td>
    </tr>
  );
};

export default HistoryRow;