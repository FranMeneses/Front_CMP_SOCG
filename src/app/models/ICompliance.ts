import { ITask } from "./ITasks";

export interface ICompliance {
    id: string;
    taskId: string;
    statusId: number;
    updatedAt: Date;
    valor: number;
    ceco: number;
    cuenta: number;
    solpedMemoSap: number;
    hesHemSap: number;
    task: ITask;
    status: IComplianceStatus;
};

export interface IComplianceStatus {
    id: number;
    name: string;
    days: number;
};

export interface ComplianceFormState {
    name: string;
    description: string;
    statusId: number;
    donationFormFile?: File | null;
    authorizationFile?: File | null;
    transferPurchaseOrderFile?: File | null;
    memoSolpedType?: "MEMO" | "SOLPED";
    memoSolpedFile?: File | null;
    memoAmount?: number;
    solpedMemoSap?: number;
    solpedCECO?: number;
    solpedAccount?: number;
    hesHem?: File | null;
    hesHemSap?: number;
    cartaAporteFile?: File | null;
    minutaFile?: File | null;
}

export interface IComplianceForm {
    id: string;
    task: ITask;
    statusId: number;
    status: IComplianceStatus;
    cartaAporte: boolean;
    minuta: boolean;
    valor: number;
    ceco: number;
    cuenta: number;
    solpedMemoSap: number;
    hesHemSap: number;
    endDate?: string;
};