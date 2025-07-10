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
    const originOptions = ["ORIGEN", ...origins.map(origin => origin.name.toUpperCase())];
    const investmentOptions = ["INVERSIÓN", ...investments.map(investment => investment.line.toUpperCase())];
    const typeOptions = ["TIPO", ...types.map(type => type.name.toUpperCase())];
    const scopeOptions = ["ALCANCE", ...scopes.map(scope => scope.name.toUpperCase())];
    const interactionOptions = ["INTERACCIÓN", ...interactions.map(interaction => interaction.operation.toUpperCase())];
    const riskOptions = ["RIESGO", ...risks.map(risk => risk.type.toUpperCase())];

    // Obtener el valor seleccionado para cada dropdown
    const getSelectedValue = (category: string) => {
        if (activeFilter.category === category && activeFilter.value) {
            return activeFilter.value.toUpperCase();
        }
        return category.toUpperCase();
    };

    // Funciones específicas para cada categoría
    const handleOrigenSelect = (value: string) => {
        if (value === "Todos" || value === "ORIGEN") {
            clearFilters();
        } else {
            const selectedItem = origins.find(item => item.name.toUpperCase() === value);
            if (selectedItem) {
                handleFilterClick("origen", selectedItem.name, selectedItem.id);
            }
        }
    };

    const handleInvestmentSelect = (value: string) => {
        if (value === "Todos" || value === "INVERSIÓN") {
            clearFilters();
        } else {
            const selectedItem = investments.find(item => item.line.toUpperCase() === value);
            if (selectedItem) {
                handleFilterClick("inversión", selectedItem.line, selectedItem.id);
            }
        }
    };

    const handleTypeSelect = (value: string) => {
        if (value === "Todos" || value === "TIPO") {
            clearFilters();
        } else {
            const selectedItem = types.find(item => item.name.toUpperCase() === value);
            if (selectedItem) {
                handleFilterClick("tipo", selectedItem.name, selectedItem.id);
            }
        }
    };

    const handleScopeSelect = (value: string) => {
        if (value === "Todos" || value === "ALCANCE") {
            clearFilters();
        } else {
            const selectedItem = scopes.find(item => item.name.toUpperCase() === value);
            if (selectedItem) {
                handleFilterClick("alcance", selectedItem.name, selectedItem.id);
            }
        }
    };

    const handleInteractionSelect = (value: string) => {
        if (value === "Todos" || value === "INTERACCIÓN") {
            clearFilters();
        } else {
            const selectedItem = interactions.find(item => item.operation.toUpperCase() === value);
            if (selectedItem) {
                handleFilterClick("interacción", selectedItem.operation, selectedItem.id);
            }
        }
    };

    const handleRiskSelect = (value: string) => {
        if (value === "Todos" || value === "RIESGO") {
            clearFilters();
        } else {
            const selectedItem = risks.find(item => item.type.toUpperCase() === value);
            if (selectedItem) {
                handleFilterClick("riesgo", selectedItem.type, selectedItem.id);
            }
        }
    };

    return (
        <div className="space-y-4 mb-4 font-[Helvetica]">
            {/* Todos los filtros de categoría en una sola fila */}
            <div className="flex flex-wrap gap-2">
                {/* Dropdown Origen - Azul */}
                {origins.length > 0 && (
                    <div className="w-64 overflow-visible">
                        <div className="[&>div>button]:border-blue-300 [&>div>button]:bg-blue-50 [&>div>button]:text-blue-700 [&>div>button:hover]:border-blue-400 [&>div>button:hover]:bg-blue-100 [&>div>button]:text-left [&>div>button]:truncate">
                            <DropdownMenu
                                buttonText="ORIGEN"
                                items={originOptions}
                                onSelect={handleOrigenSelect}
                                selectedValue={getSelectedValue("origen")}
                            />
                        </div>
                    </div>
                )}

                {/* Dropdown Inversión - Verde */}
                {investments.length > 0 && (
                    <div className="w-64 overflow-visible">
                        <div className="[&>div>button]:border-green-300 [&>div>button]:bg-green-50 [&>div>button]:text-green-700 [&>div>button:hover]:border-green-400 [&>div>button:hover]:bg-green-100 [&>div>button]:text-left [&>div>button]:truncate">
                            <DropdownMenu
                                buttonText="INVERSIÓN"
                                items={investmentOptions}
                                onSelect={handleInvestmentSelect}
                                selectedValue={getSelectedValue("inversión")}
                            />
                        </div>
                    </div>
                )}

                {/* Dropdown Tipo - Púrpura */}
                {types.length > 0 && (
                    <div className="w-64 overflow-visible">
                        <div className="[&>div>button]:border-purple-300 [&>div>button]:bg-purple-50 [&>div>button]:text-purple-700 [&>div>button:hover]:border-purple-400 [&>div>button:hover]:bg-purple-100 [&>div>button]:text-left [&>div>button]:truncate">
                            <DropdownMenu
                                buttonText="TIPO"
                                items={typeOptions}
                                onSelect={handleTypeSelect}
                                selectedValue={getSelectedValue("tipo")}
                            />
                        </div>
                    </div>
                )}

                {/* Dropdown Alcance - Amarillo */}
                {scopes.length > 0 && (
                    <div className="w-64 overflow-visible">
                        <div className="[&>div>button]:border-yellow-300 [&>div>button]:bg-yellow-50 [&>div>button]:text-yellow-700 [&>div>button:hover]:border-yellow-400 [&>div>button:hover]:bg-yellow-100 [&>div>button]:text-left [&>div>button]:truncate">
                            <DropdownMenu
                                buttonText="ALCANCE"
                                items={scopeOptions}
                                onSelect={handleScopeSelect}
                                selectedValue={getSelectedValue("alcance")}
                            />
                        </div>
                    </div>
                )}

                {/* Dropdown Interacción - Azul claro */}
                {interactions.length > 0 && (
                    <div className="w-64 overflow-visible">
                        <div className="[&>div>button]:border-cyan-300 [&>div>button]:bg-cyan-50 [&>div>button]:text-cyan-700 [&>div>button:hover]:border-cyan-400 [&>div>button:hover]:bg-cyan-100 [&>div>button]:text-left [&>div>button]:truncate">
                            <DropdownMenu
                                buttonText="INTERACCIÓN"
                                items={interactionOptions}
                                onSelect={handleInteractionSelect}
                                selectedValue={getSelectedValue("interacción")}
                            />
                        </div>
                    </div>
                )}

                {/* Dropdown Riesgo - Rojo */}
                {risks.length > 0 && (
                    <div className="w-64 overflow-visible">
                        <div className="[&>div>button]:border-red-300 [&>div>button]:bg-red-50 [&>div>button]:text-red-700 [&>div>button:hover]:border-red-400 [&>div>button:hover]:bg-red-100 [&>div>button]:text-left [&>div>button]:truncate">
                            <DropdownMenu
                                buttonText="RIESGO"
                                items={riskOptions}
                                onSelect={handleRiskSelect}
                                selectedValue={getSelectedValue("riesgo")}
                            />
                        </div>
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