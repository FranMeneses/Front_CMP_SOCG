'use client'
import React from 'react';
import DropdownMenu from "@/components/Dropdown";
import { IOrigin, IInvestment, IType, IScope, IInteraction, IRisk } from "@/app/models/IInfoTask";

interface CategoryDropdownsProps {
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

const CategoryDropdowns: React.FC<CategoryDropdownsProps> = ({ 
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
    // Preparar las opciones para cada dropdown
    const originOptions = ["Todos", ...origins.map(origin => origin.name)];
    const investmentOptions = ["Todos", ...investments.map(investment => investment.line)];
    const typeOptions = ["Todos", ...types.map(type => type.name)];
    const scopeOptions = ["Todos", ...scopes.map(scope => scope.name)];
    const interactionOptions = ["Todos", ...interactions.map(interaction => interaction.operation)];
    const riskOptions = ["Todos", ...risks.map(risk => risk.type)];

    // Obtener el valor seleccionado para cada dropdown
    const getSelectedValue = (category: string) => {
        if (activeFilter.category === category) {
            return activeFilter.value || "Todos";
        }
        return "Todos";
    };

    // Funciones específicas para cada categoría
    const handleOrigenSelect = (value: string) => {
        if (value === "Todos") {
            clearFilters();
        } else {
            const selectedItem = origins.find(item => item.name === value);
            if (selectedItem) {
                handleFilterClick("origen", value, selectedItem.id);
            }
        }
    };

    const handleInvestmentSelect = (value: string) => {
        if (value === "Todos") {
            clearFilters();
        } else {
            const selectedItem = investments.find(item => item.line === value);
            if (selectedItem) {
                handleFilterClick("inversión", value, selectedItem.id);
            }
        }
    };

    const handleTypeSelect = (value: string) => {
        if (value === "Todos") {
            clearFilters();
        } else {
            const selectedItem = types.find(item => item.name === value);
            if (selectedItem) {
                handleFilterClick("tipo", value, selectedItem.id);
            }
        }
    };

    const handleScopeSelect = (value: string) => {
        if (value === "Todos") {
            clearFilters();
        } else {
            const selectedItem = scopes.find(item => item.name === value);
            if (selectedItem) {
                handleFilterClick("alcance", value, selectedItem.id);
            }
        }
    };

    const handleInteractionSelect = (value: string) => {
        if (value === "Todos") {
            clearFilters();
        } else {
            const selectedItem = interactions.find(item => item.operation === value);
            if (selectedItem) {
                handleFilterClick("interacción", value, selectedItem.id);
            }
        }
    };

    const handleRiskSelect = (value: string) => {
        if (value === "Todos") {
            clearFilters();
        } else {
            const selectedItem = risks.find(item => item.type === value);
            if (selectedItem) {
                handleFilterClick("riesgo", value, selectedItem.id);
            }
        }
    };

    return (
        <div className="space-y-4 mb-4 font-[Helvetica]">
            {/* Todos los filtros de categoría en una sola fila */}
            <div className="flex flex-wrap gap-2">
                {/* Dropdown Origen */}
                {origins.length > 0 && (
                    <div className="w-48 overflow-visible">
                        <DropdownMenu
                            buttonText="Filtrar por origen"
                            items={originOptions}
                            onSelect={handleOrigenSelect}
                            selectedValue={getSelectedValue("origen")}
                        />
                    </div>
                )}

                {/* Dropdown Inversión */}
                {investments.length > 0 && (
                    <div className="w-48 overflow-visible">
                        <DropdownMenu
                            buttonText="Filtrar por inversión"
                            items={investmentOptions}
                            onSelect={handleInvestmentSelect}
                            selectedValue={getSelectedValue("inversión")}
                        />
                    </div>
                )}

                {/* Dropdown Tipo */}
                {types.length > 0 && (
                    <div className="w-48 overflow-visible">
                        <DropdownMenu
                            buttonText="Filtrar por tipo"
                            items={typeOptions}
                            onSelect={handleTypeSelect}
                            selectedValue={getSelectedValue("tipo")}
                        />
                    </div>
                )}

                {/* Dropdown Alcance */}
                {scopes.length > 0 && (
                    <div className="w-48 overflow-visible">
                        <DropdownMenu
                            buttonText="Filtrar por alcance"
                            items={scopeOptions}
                            onSelect={handleScopeSelect}
                            selectedValue={getSelectedValue("alcance")}
                        />
                    </div>
                )}

                {/* Dropdown Interacción */}
                {interactions.length > 0 && (
                    <div className="w-48 overflow-visible">
                        <DropdownMenu
                            buttonText="Filtrar por interacción"
                            items={interactionOptions}
                            onSelect={handleInteractionSelect}
                            selectedValue={getSelectedValue("interacción")}
                        />
                    </div>
                )}

                {/* Dropdown Riesgo */}
                {risks.length > 0 && (
                    <div className="w-48 overflow-visible">
                        <DropdownMenu
                            buttonText="Filtrar por riesgo"
                            items={riskOptions}
                            onSelect={handleRiskSelect}
                            selectedValue={getSelectedValue("riesgo")}
                        />
                    </div>
                )}
            </div>

            {/* Mostrar filtro activo */}
            {activeFilter.category && activeFilter.value && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-medium">
                        Filtrado por: <strong className="capitalize">{activeFilter.category}</strong> - {activeFilter.value}
                    </span>
                    <button
                        onClick={clearFilters}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors duration-200"
                    >
                        Limpiar filtro
                    </button>
                </div>
            )}
        </div>
    );
};

export default CategoryDropdowns; 