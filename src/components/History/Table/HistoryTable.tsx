'use client';
import React from "react";
import HistoryRow from "./HistoryRow";
import { IHistory } from "@/app/models/IHistory";

interface HistoryTableProps {
    history: IHistory[];
}

const HistoryTable: React.FC<HistoryTableProps> = ({ 
    history, 
}) => {

    return (
        <div>
            <div className="overflow-x-auto rounded-lg shadow font-[Helvetica]">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr className="text-sm text-gray-700">
                            <th className="py-2 text-center text-xs font-medium text-gray-500 truncate">Nombre</th>
                            <th className="py-2 px-2 text-center text-xs font-medium text-gray-500 truncate">Fecha Inicio</th>
                            <th className="py-2 px-2 text-center text-xs font-medium text-gray-500 truncate">Fecha Finalización</th>
                            <th className="py-2 px-2 text-center text-xs font-medium text-gray-500 truncate">Días Restantes</th>
                            <th className="py-2 text-center text-xs font-medium text-gray-500 truncate">Estado</th>
                            <th colSpan={3}/>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-xs truncate divide-y divide-[#e5e5e5]">
                        {history.map((history) => (
                            <React.Fragment key={history.id}>
                                <HistoryRow
                                    history={history}
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