'use client';
import React from "react";
import HistoryRow from "./HistoryRow";
import { IHistory } from "@/app/models/IHistory";

interface HistoryTableProps {
    history: IHistory[];
    onViewDetails: (history: IHistory) => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ 
    history, 
    onViewDetails
}) => {

    return (
        <div>
            <div className="overflow-x-auto rounded-lg shadow font-[Helvetica]">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr className="text-sm text-gray-700">
                            <th className="py-2 text-center text-xs font-medium text-gray-500 truncate">NOMBRE</th>
                            <th className="py-2 px-2 text-center text-xs font-medium text-gray-500 truncate">FECHA FINALIZACIÓN</th>
                            <th className="py-2 px-2 text-center text-xs font-medium text-gray-500 truncate">PROCESO</th>
                            <th className="py-2 px-2 text-center text-xs font-medium text-gray-500 truncate">VALLE</th>
                            <th className="py-2 px-2 text-center text-xs font-medium text-gray-500 truncate">FAENA</th>
                            <th colSpan={3}/>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-xs truncate divide-y divide-[#e5e5e5]">
                        {history.map((historyItem) => (
                            <React.Fragment key={historyItem.id}>
                                <HistoryRow
                                    history={historyItem}
                                    onViewDetails={onViewDetails}
                                />
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>

                {history.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No se encontraron registros para el histórico.
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryTable;