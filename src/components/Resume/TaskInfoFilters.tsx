'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import { IOrigin, IInvestment, IType, IScope, IInteraction, IRisk } from "@/app/models/IInfoTask";

interface TaskInfoFiltersProps {
    origins: IOrigin[];
    investments: IInvestment[];
    types: IType[];
    scopes: IScope[];
    interactions: IInteraction[];
    risks: IRisk[];
    activeFilter: {
        category: string | null;
        value: string | null;
    };
    handleFilterClick: (category: string, value: string, id: number) => void;
    clearFilters: () => void;
}

const TaskInfoFilters: React.FC<TaskInfoFiltersProps> = ({ 
    origins,
    investments,
    types,
    scopes,
    interactions,
    risks,
    activeFilter,
    handleFilterClick,
    clearFilters
}) => {
    return (
        <div className="space-y-4 mb-4 font-[Helvetica]">
            {/* Botón para limpiar filtros */}
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    className="px-4 py-2 text-sm rounded-md hover:cursor-pointer transition-all duration-200 bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                    onClick={clearFilters}
                >
                    LIMPIAR FILTROS
                </Button>
                {activeFilter.category && activeFilter.value && (
                    <span className="text-sm text-gray-600">
                        Filtrado por: <strong>{activeFilter.category}</strong> - {activeFilter.value}
                    </span>
                )}
            </div>

            {/* Filtros por Origen */}
            {origins.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">ORIGEN:</h4>
                    <div className="flex flex-wrap gap-2">
                        {origins.map((origin) => (
                            <Button
                                key={origin.id}
                                variant="outline"
                                className={`px-3 py-2 text-xs rounded-md hover:cursor-pointer transition-all duration-200 ${
                                    activeFilter.category === "origen" && activeFilter.value === origin.name
                                        ? "bg-blue-100 text-blue-800 font-bold border-blue-400"
                                        : "bg-blue-50 text-blue-700 font-medium border-blue-200 hover:border-blue-400 hover:bg-blue-100"
                                }`}
                                onClick={() => handleFilterClick("origen", origin.name, origin.id)}
                            >
                                {origin.name.toUpperCase()}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Filtros por Inversión */}
            {investments.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">INVERSIÓN:</h4>
                    <div className="flex flex-wrap gap-2">
                        {investments.map((investment) => (
                            <Button
                                key={investment.id}
                                variant="outline"
                                className={`px-3 py-2 text-xs rounded-md hover:cursor-pointer transition-all duration-200 ${
                                    activeFilter.category === "inversión" && activeFilter.value === investment.line
                                        ? "bg-green-100 text-green-800 font-bold border-green-400"
                                        : "bg-green-50 text-green-700 font-medium border-green-200 hover:border-green-400 hover:bg-green-100"
                                }`}
                                onClick={() => handleFilterClick("inversión", investment.line, investment.id)}
                            >
                                {investment.line.toUpperCase()}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Filtros por Tipo */}
            {types.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">TIPO:</h4>
                    <div className="flex flex-wrap gap-2">
                        {types.map((type) => (
                            <Button
                                key={type.id}
                                variant="outline"
                                className={`px-3 py-2 text-xs rounded-md hover:cursor-pointer transition-all duration-200 ${
                                    activeFilter.category === "tipo" && activeFilter.value === type.name
                                        ? "bg-purple-100 text-purple-800 font-bold border-purple-400"
                                        : "bg-purple-50 text-purple-700 font-medium border-purple-200 hover:border-purple-400 hover:bg-purple-100"
                                }`}
                                onClick={() => handleFilterClick("tipo", type.name, type.id)}
                            >
                                {type.name.toUpperCase()}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Filtros por Alcance */}
            {scopes.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">ALCANCE:</h4>
                    <div className="flex flex-wrap gap-2">
                        {scopes.map((scope) => (
                            <Button
                                key={scope.id}
                                variant="outline"
                                className={`px-3 py-2 text-xs rounded-md hover:cursor-pointer transition-all duration-200 ${
                                    activeFilter.category === "alcance" && activeFilter.value === scope.name
                                        ? "bg-yellow-100 text-yellow-800 font-bold border-yellow-400"
                                        : "bg-yellow-50 text-yellow-700 font-medium border-yellow-200 hover:border-yellow-400 hover:bg-yellow-100"
                                }`}
                                onClick={() => handleFilterClick("alcance", scope.name, scope.id)}
                            >
                                {scope.name.toUpperCase()}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Filtros por Interacción */}
            {interactions.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">INTERACCIÓN:</h4>
                    <div className="flex flex-wrap gap-2">
                        {interactions.map((interaction) => (
                            <Button
                                key={interaction.id}
                                variant="outline"
                                className={`px-3 py-2 text-xs rounded-md hover:cursor-pointer transition-all duration-200 ${
                                    activeFilter.category === "interacción" && activeFilter.value === interaction.operation
                                        ? "bg-indigo-100 text-indigo-800 font-bold border-indigo-400"
                                        : "bg-indigo-50 text-indigo-700 font-medium border-indigo-200 hover:border-indigo-400 hover:bg-indigo-100"
                                }`}
                                onClick={() => handleFilterClick("interacción", interaction.operation, interaction.id)}
                            >
                                {interaction.operation.toUpperCase()}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Filtros por Riesgo */}
            {risks.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">RIESGO:</h4>
                    <div className="flex flex-wrap gap-2">
                        {risks.map((risk) => (
                            <Button
                                key={risk.id}
                                variant="outline"
                                className={`px-3 py-2 text-xs rounded-md hover:cursor-pointer transition-all duration-200 ${
                                    activeFilter.category === "riesgo" && activeFilter.value === risk.type
                                        ? "bg-red-100 text-red-800 font-bold border-red-400"
                                        : "bg-red-50 text-red-700 font-medium border-red-200 hover:border-red-400 hover:bg-red-100"
                                }`}
                                onClick={() => handleFilterClick("riesgo", risk.type, risk.id)}
                            >
                                {risk.type.toUpperCase()}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskInfoFilters; 