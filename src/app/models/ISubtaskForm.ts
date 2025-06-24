export interface SubtasksInitialValues {
    name?: string;
    description?: string;
    budget?: string;
    expense?: string;
    startDate?: string;
    endDate?: string;
    finalDate?: string;
    state?: string;
    priority?: string;
}
export interface ExtendedSubtaskValues {
    budget?: number;
    expense?: number;
    status?: number;
    priority?: number;
    
    name?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    finishDate?: string;
    state?: string;
}