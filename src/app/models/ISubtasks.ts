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
    status: ISubtasksStatus;
    priority: IPriority;
}

export interface IPriority {
    id: number;
    name: string;
}

export interface ISubtasksStatus {
    id: number;
    name: string;
    percentage: number;
}

export interface ISubtaskScheduler {
    id: string;
    name: string;
    start: string;
    end: string;
    progress: number;
    taskId?: string;
    color: string;
}