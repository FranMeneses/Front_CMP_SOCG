import { IFaena } from "./IFaena";
import { IValley } from "./IValleys";

export interface ITask {
    id?: string;
    name: string;
    description: string;
    valleyId: number;
    faenaId: number;
    statusId: number;
    processId?: number;
    beneficiaryId?: number;
    valley?: IValley;
    faena?: IFaena;
    status?: ITaskStatus;
    process?: ITaskProcess;
    applies? : boolean;
}

export interface CreateTaskInput {
    description?: string;
    statusId?: number;
    faenaId: number;
    valleyId: number;
    name: string;
    beneficiaryId?: number;
}

export interface IInfoTask {
    id: string;
    taskId: string;
    originId:number;
    investmentId:number;
    typeId:number;
    scopeId:number;
    interactionId:number;
    riskId:number;
    task:ITask;
}

export interface ITaskStatus {
    id: number;
    name: string;
}

export interface ITaskBudget {
    month: string;
    budget: number;
}

export interface ITaskExpense {
    month: string;
    expense: number;
}

export interface ITaskDetails extends ITask {
    budget: number;
    startDate: string;
    endDate: string;
    finishedDate: string;
}

export interface ITaskProcess {
    id: string;
    name: string;
}