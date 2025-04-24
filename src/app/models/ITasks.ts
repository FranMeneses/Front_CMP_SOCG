export interface ITask {
    id: string;
    name: string;
    description: string;
    valleyId: number;
    faenaId: number;
    status: number;
    valley: IValley;
    faena: IFaena;
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