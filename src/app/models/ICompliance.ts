import { ITask } from "./ITasks";

export interface ICompliance {
    id: string;
    taskId: string;
    statusId: number;
    applies: boolean;
    task: ITask;
    status: IComplianceStatus;
    registries: IComplianceRegistry[];
};

export interface IComplianceStatus {
    id: number;
    name: string;
    days: number;
};

export interface IComplianceRegistry {
    id: string;
    complianceId: string;
    hes:boolean;
    hem:boolean;
    provider: string;
    startDate: string;
    endDate: string;
    compliance: ICompliance;
    memos: IComplianceMemo[];
    solpeds: IComplianceSolped[];
};

export interface IComplianceMemo {
    id: string;
    registryId: string;
    value: number;
    registry: IComplianceRegistry;
};

export interface IComplianceSolped {
    id: string;
    registryId: string;
    ceco: number;
    account: string;
    value: number;
    registry: IComplianceRegistry;
};

export interface IComplianceForm {
    id: string;
    task: ITask;
    statusId: number;
    applies: boolean;
    status: IComplianceStatus;
    cartaAporteObs: boolean;
    minutaObs: boolean;
    hasMemo: boolean;
    hasSolped: boolean;
    hasHem: boolean;
    hasHes: boolean;
    provider: string;
};