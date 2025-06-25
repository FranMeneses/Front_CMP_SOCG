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

export interface ComplianceFormState extends Partial<IComplianceForm> {
    hasMemo?: boolean; 
    hasSolped?: boolean;
    hasHem?: boolean;
    hasHes?: boolean;
    provider?: string;
    cartaAporteFile?: File | null;
    minutaFile?: File | null;
    memoAmount?: string | number;
    solpedCECO?: number;
    solpedAccount?: number; 
    solpedAmount?: string | number;
}

export interface IComplianceForm {
    id: string;
    task: ITask;
    statusId: number;
    applies: boolean;
    status: IComplianceStatus;
    cartaAporte: boolean;
    minuta: boolean;
    hasMemo: boolean;
    hasSolped: boolean;
    hasHem: boolean;
    hasHes: boolean;
    provider: string;
    registryId?: string;
    endDate?: string;
    registries?: IComplianceRegistry[];
};

export interface ISolped {
    registryId: string;
    ceco: number;
    account: number;
    value: number;
}

export interface IMemo {
    registryId: string;
    value: number;
}
