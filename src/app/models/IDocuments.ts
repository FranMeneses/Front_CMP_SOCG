import { ISubtask } from "./ISubtasks"
import { ITask } from "./ITasks"

export interface IDocument {
    id_documento: number,
    id_tarea: string,
    id_subtarea: string,
    tipo_documento: number,
    ruta: string,
    fecha_carga: Date,
    tarea: ITask,
    subtarea: ISubtask,
    tipo_doc: ITipoDocumento,
}

export interface ITipoDocumento {
    id_tipo_documento: number,
    tipo_documento: string,
}

export interface IDocumentList {
    type: string,
    createdAt: Date,
}

export interface IDocumentInput {
    tipo_documento: number,
    ruta: string,
    id_tarea?: string,
    id_subtarea?: string,
}