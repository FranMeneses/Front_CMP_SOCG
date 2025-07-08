export interface IOrigin {
    id: number;
    name: string;
}

export interface IInvestment {
    id: number;
    line: string;
}

export interface IType {
    id: number;
    name: string;
}

export interface IScope {
    id: number;
    name: string;
}

export interface IInteraction {
    id: number;
    operation: string;
}

export interface IRisk {
    id: number;
    type: string;
}

export interface IInfoTask {
    id: string;
    taskId: string;
    originId?: number;
    investmentId?: number;
    typeId?: number;
    scopeId?: number;
    interactionId?: number;
    riskId?: number;
    task?: {
        id: string;
        name: string;
        description?: string;
        applies?: boolean;
        valleyId?: number;
        faenaId?: number;
        statusId?: number;
        processId?: number;
        valley?: {
            id: number;
            name: string;
        };
        faena?: {
            id: number;
            name: string;
        };
        status?: {
            id: number;
            name: string;
        };
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
    origin?: IOrigin;
    investment?: IInvestment;
    type?: IType;
    scope?: IScope;
    interaction?: IInteraction;
    risk?: IRisk;
}
