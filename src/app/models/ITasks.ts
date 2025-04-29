export interface ITask {
    id: string;
    name: string;
    description: string;
    valleyId: number;
    faenaId: number;
    statusId: number;
    valley: IValley;
    faena: IFaena;
    status: IStatus;
}

export interface IValley {
    id: number;
    name: string;
}

export interface IFaena {
    id: number;
    name: string;
}

export interface CreateTaskInput {
    description?: string;
    statusId?: number;
    faenaId: number;
    valleyId: number;
    name: string;
}

export interface ISubtask {
    id: string;
    taskId: string;
    number: number;
    name: string;
    description: string;
    budget: number;
    expense: number;
    startDate: string;
    endDate: string;
    finalDate: string;
    beneficiaryId: string;
    statusId: number;
    priorityId: number;
    status: IStatus;
    priority: IPriority;
}

export interface IPriority {
    id: number;
    name: string;
}

export interface IStatus {
    id: number;
    name: string;
    percentage: number;
}