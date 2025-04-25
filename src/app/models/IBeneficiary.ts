export interface IContact {
    id: string;
    name: string;
    position: string;
    email: string;
    phone: string;
  }
  
export interface IBeneficiary {
    id: string;
    legalName: string;
    rut: string;
    address: string;
    entityType: string;
    representative: string;
    hasLegalPersonality: boolean;
    contacts: IContact[];
}