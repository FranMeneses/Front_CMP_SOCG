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
