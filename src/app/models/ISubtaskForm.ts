export interface Beneficiary {
    id: string;
    legalName: string;
  }  

export interface SubtasksInitialValues {
    name?: string;
    description?: string;
    budget?: string;
    expense?: string;
    startDate?: string;
    endDate?: string;
    finalDate?: string;
    beneficiary?: string;
    state?: string;
    priority?: string;
}
export interface ExtendedSubtaskValues {
    number?: number;
    budget?: number;
    expense?: number;
    status?: number;
    priority?: number;
    
    name?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    finishDate?: string;
    beneficiary?: string;
    state?: string;
    
    beneficiaryId?: string;
}