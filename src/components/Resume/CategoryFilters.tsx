'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import { IOrigin, IInvestment, IType, IScope, IInteraction, IRisk } from "@/app/models/IInfoTask";

interface CategoryFiltersProps {
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

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ 
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
    // Crear una lista unificada de todos los filtros
    const allFilters = [
        // Botón de limpiar filtros
        {
            type: 'clear',
            category: 'clear',
            value: 'LIMPIAR FILTROS',
            id: 0,
            color: 'gray'
        },
        // Origenes
        ...origins.map(origin => ({
            type: 'filter',
            category: 'origen',
            value: origin.name,
            id: origin.id,
            color: 'blue'
        })),
        // Inversiones
        ...investments.map(investment => ({
            type: 'filter',
            category: 'inversión',
            value: investment.line,
            id: investment.id,
            color: 'green'
        })),
        // Tipos
        ...types.map(type => ({
            type: 'filter',
            category: 'tipo',
            value: type.name,
            id: type.id,
            color: 'purple'
        })),
        // Alcances
        ...scopes.map(scope => ({
            type: 'filter',
            category: 'alcance',
            value: scope.name,
            id: scope.id,
            color: 'yellow'
        })),
        // Interacciones
        ...interactions.map(interaction => ({
            type: 'filter',
            category: 'interacción',
            value: interaction.operation,
            id: interaction.id,
            color: 'indigo'
        })),
        // Riesgos
        ...risks.map(risk => ({
            type: 'filter',
            category: 'riesgo',
            value: risk.type,
            id: risk.id,
            color: 'red'
        }))
    ];

    const getButtonStyles = (filter: {
        type: string;
        category: string;
        value: string;
        id: number;
        color: string;
    }) => {
        const isActive = activeFilter.category === filter.category && activeFilter.value === filter.value;
        
        if (filter.type === 'clear') {
            return "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200";
        }

        const colorClasses = {
            blue: isActive 
                ? "bg-blue-100 text-blue-800 font-bold border-blue-400" 
                : "bg-blue-50 text-blue-700 font-medium border-blue-200 hover:border-blue-400 hover:bg-blue-100",
            green: isActive 
                ? "bg-green-100 text-green-800 font-bold border-green-400" 
                : "bg-green-50 text-green-700 font-medium border-green-200 hover:border-green-400 hover:bg-green-100",
            purple: isActive 
                ? "bg-purple-100 text-purple-800 font-bold border-purple-400" 
                : "bg-purple-50 text-purple-700 font-medium border-purple-200 hover:border-purple-400 hover:bg-purple-100",
            yellow: isActive 
                ? "bg-yellow-100 text-yellow-800 font-bold border-yellow-400" 
                : "bg-yellow-50 text-yellow-700 font-medium border-yellow-200 hover:border-yellow-400 hover:bg-yellow-100",
            indigo: isActive 
                ? "bg-indigo-100 text-indigo-800 font-bold border-indigo-400" 
                : "bg-indigo-50 text-indigo-700 font-medium border-indigo-200 hover:border-indigo-400 hover:bg-indigo-100",
            red: isActive 
                ? "bg-red-100 text-red-800 font-bold border-red-400" 
                : "bg-red-50 text-red-700 font-medium border-red-200 hover:border-red-400 hover:bg-red-100"
        };

        return colorClasses[filter.color as keyof typeof colorClasses];
    };

    return (
        <div className="flex flex-wrap gap-2 mb-4 font-[Helvetica]">
            {allFilters.map((filter, index) => (
                <Button
                    key={`${filter.category}-${filter.id}-${index}`}
                    variant="outline"
                    className={`px-3 py-2 text-xs rounded-md hover:cursor-pointer transition-all duration-200 ${getButtonStyles(filter)}`}
                    onClick={() => {
                        if (filter.type === 'clear') {
                            clearFilters();
                        } else {
                            handleFilterClick(filter.category, filter.value, filter.id);
                        }
                    }}
                >
                    {filter.value.toUpperCase()}
                </Button>
            ))}
        </div>
    );
};

export default CategoryFilters; 