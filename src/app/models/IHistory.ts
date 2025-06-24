import { IBeneficiary } from "./IBeneficiary";
import { ITipoDocumento } from "./IDocuments";
import { IFaena } from "./IFaena";
import { IProcess } from "./IProcess";
import { IValley } from "./IValleys";


export interface IHistory {
  id: string;
  name?: string;
  processId?: number;
  finalDate?: string; 
  totalExpense?: number;
  valleyId?: number;
  faenaId?: number;
  solpedMemoSap?: number;
  hesHemSap?: number;
  process?: IProcess;
  valley?: IValley;
  faena?: IFaena;
  documents?: IHistoryDoc[];
  beneficiary?: IBeneficiary;
}

export interface IHistoryDoc {
  id: string;
  historyId: string;
  fileName: string;
  documentTypeId: string; 
  path: string; 
  uploadDate: string; 
  history?: IHistory; 
  documentType?: ITipoDocumento; 
}