export interface ITaskForm {
    name: string;
    description: string;
    valleyId: string;
    faenaId: string;
    processId: string;
    statusId: number;
    budget: number;
    expense: number;
    applies: boolean | null;
}