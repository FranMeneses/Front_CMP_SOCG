import { useState, useEffect } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { 
    GET_ALL_ORIGINS, 
    GET_ALL_INVESTMENTS, 
    GET_ALL_TYPES, 
    GET_ALL_SCOPES, 
    GET_ALL_INTERACTIONS, 
    GET_ALL_RISKS,
    GET_TASKS_BY_ORIGIN,
    GET_TASKS_BY_INVESTMENT,
    GET_TASKS_BY_TYPE,
    GET_TASKS_BY_SCOPE,
    GET_TASKS_BY_INTERACTION,
    GET_TASKS_BY_RISK
} from '@/app/api/infoTask';
import { ITask } from '@/app/models/ITasks';

export function useTaskInfoFilters(originalTasks: ITask[]) {
    // Obtener todas las categorías
    const { data: originsData } = useQuery(GET_ALL_ORIGINS);
    const { data: investmentsData } = useQuery(GET_ALL_INVESTMENTS);
    const { data: typesData } = useQuery(GET_ALL_TYPES);
    const { data: scopesData } = useQuery(GET_ALL_SCOPES);
    const { data: interactionsData } = useQuery(GET_ALL_INTERACTIONS);
    const { data: risksData } = useQuery(GET_ALL_RISKS);

    // Lazy queries para filtrar tareas
    const [getTasksByOrigin] = useLazyQuery(GET_TASKS_BY_ORIGIN);
    const [getTasksByInvestment] = useLazyQuery(GET_TASKS_BY_INVESTMENT);
    const [getTasksByType] = useLazyQuery(GET_TASKS_BY_TYPE);
    const [getTasksByScope] = useLazyQuery(GET_TASKS_BY_SCOPE);
    const [getTasksByInteraction] = useLazyQuery(GET_TASKS_BY_INTERACTION);
    const [getTasksByRisk] = useLazyQuery(GET_TASKS_BY_RISK);

    // Estado para filtros activos
    const [activeFilter, setActiveFilter] = useState<{
        category: string | null;
        value: string | null;
        id: number | null;
    }>({
        category: null,
        value: null,
        id: null
    });

    // Estado para tareas filtradas
    const [filteredTasks, setFilteredTasks] = useState<ITask[]>(originalTasks);

    // Datos de categorías
    const origins = originsData?.origins || [];
    const investments = investmentsData?.investments || [];
    const types = typesData?.types || [];
    const scopes = scopesData?.scopes || [];
    const interactions = interactionsData?.interactions || [];
    const risks = risksData?.risks || [];

    // Actualizar tareas filtradas cuando cambian las tareas originales
    useEffect(() => {
        if (!activeFilter.category) {
            setFilteredTasks(originalTasks);
        }
    }, [originalTasks, activeFilter.category]);

    // Función para convertir InfoTask a ITask
    const convertInfoTaskToTask = (infoTaskData: {
        task: {
            id: string;
            name: string;
            description?: string;
            applies?: boolean;
            valleyId?: number;
            faenaId?: number;
            statusId?: number;
            processId?: number;
            valley?: { id: number; name: string };
            faena?: { id: number; name: string };
            status?: { id: number; name: string };
            beneficiary?: {
                id: string;
                legalName: string;
                rut: string;
                address: string;
                entityType: string;
                representative: string;
                hasLegalPersonality: boolean;
            };
        };
    }): ITask => {
        const task = infoTaskData.task;
        return {
            id: task.id,
            name: task.name,
            description: task.description || '',
            applies: task.applies,
            valleyId: task.valleyId || 0,
            faenaId: task.faenaId || 0,
            statusId: task.statusId || 0,
            processId: task.processId,
            valley: task.valley,
            faena: task.faena,
            status: task.status,
            beneficiary: task.beneficiary ? {
                ...task.beneficiary,
                contacts: [] // Añadir contacts vacío para cumplir con IBeneficiary
            } : undefined,
        };
    };

    /**
     * Funcion para manejar el clic en un filtro.
     * @description Esta función se encarga de filtrar las tareas según la categoría y el valor seleccionados.
     * @param category 
     * @param value 
     * @param id 
     * @returns {Promise<void>} Retorna una promesa que se resuelve cuando se han filtrado las tareas.
     * @returns {void}
     */
    const handleFilterClick = async (category: string, value: string, id: number) => {
        setActiveFilter({ category, value, id });

        try {
            let result;
            switch (category) {
                case 'origen':
                    result = await getTasksByOrigin({ variables: { originId: id } });
                    if (result.data?.tasksByOrigin) {
                        const tasks = result.data.tasksByOrigin.map(convertInfoTaskToTask);
                        setFilteredTasks(tasks);
                    }
                    break;
                case 'inversión':
                    result = await getTasksByInvestment({ variables: { investmentId: id } });
                    if (result.data?.tasksByInvestment) {
                        const tasks = result.data.tasksByInvestment.map(convertInfoTaskToTask);
                        setFilteredTasks(tasks);
                    }
                    break;
                case 'tipo':
                    result = await getTasksByType({ variables: { typeId: id } });
                    if (result.data?.tasksByType) {
                        const tasks = result.data.tasksByType.map(convertInfoTaskToTask);
                        setFilteredTasks(tasks);
                    }
                    break;
                case 'alcance':
                    result = await getTasksByScope({ variables: { scopeId: id } });
                    if (result.data?.tasksByScope) {
                        const tasks = result.data.tasksByScope.map(convertInfoTaskToTask);
                        setFilteredTasks(tasks);
                    }
                    break;
                case 'interacción':
                    result = await getTasksByInteraction({ variables: { interactionId: id } });
                    if (result.data?.tasksByInteraction) {
                        const tasks = result.data.tasksByInteraction.map(convertInfoTaskToTask);
                        setFilteredTasks(tasks);
                    }
                    break;
                case 'riesgo':
                    result = await getTasksByRisk({ variables: { riskId: id } });
                    if (result.data?.tasksByRisk) {
                        const tasks = result.data.tasksByRisk.map(convertInfoTaskToTask);
                        setFilteredTasks(tasks);
                    }
                    break;
                default:
                    setFilteredTasks(originalTasks);
            }
        } catch (error) {
            console.error('Error al filtrar tareas:', error);
            setFilteredTasks([]);
        }
    };

    /**
     * Función para limpiar los filtros.
     * @description Resetea los filtros activos y muestra todas las tareas originales.
     * @return {void}
     */
    const clearFilters = () => {
        setActiveFilter({ category: null, value: null, id: null });
        setFilteredTasks(originalTasks);
    };

    return {
        origins,
        investments,
        types,
        scopes,
        interactions,
        risks,
        activeFilter,
        filteredTasks,
        handleFilterClick,
        clearFilters
    };
} 