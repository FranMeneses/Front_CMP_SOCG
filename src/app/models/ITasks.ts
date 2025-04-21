export interface StatusInfo {
    id: number;
    name: string;
}

export interface Valley {
    id_valle: number;
    valle_name: string;
}

export interface Facility {
    id_faena: number;
    faena_name: string;
}

export interface ITask {
    id: string;
    valleyId: number;
    facilityId: number;
    name: string;
    description: string;
    status: number;
    statusInfo: StatusInfo;
    valley: Valley;
    facility: Facility;
    info: any; // Cambia `any` si tienes un tipo específico para esta propiedad
    subtasks: any[]; // Cambia `any[]` si tienes una estructura definida para las subtareas
    documents: any[]; // Cambia `any[]` si tienes una estructura definida para los documentos
}