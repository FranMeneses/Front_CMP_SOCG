import { IFaena } from "./IFaena";
import { IValley } from "./IValleys";

export interface ITask {
    id?: string;
    name: string;
    description: string;
    valleyId: number;
    faenaId: number;
    statusId: number;
    valley: IValley;
    faena: IFaena;
    status: ITaskStatus;
}

export interface CreateTaskInput {
    description?: string;
    statusId?: number;
    faenaId: number;
    valleyId: number;
    name: string;
}

export interface IInfoTask {
    id: string;
    taskId: string;
    originId:number;
    invesmentId:number;
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
