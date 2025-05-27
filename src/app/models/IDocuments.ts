import { ISubtask } from "./ISubtasks"
import { ITask } from "./ITasks"

export interface IDocument {
    id_documento: string,
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
    id_tipo_documento: string,
    tipo_documento: string,
}

export interface IDocumentList {
    id_documento: string,
    nombre_archivo: string,
    fecha_carga: Date,
    tipo_doc: IDocumentType,
    id_tarea: string,
    tarea?: ITask | null,
    subtarea?: ISubtask | null,
}

export interface IDocumentInput {
    tipo_documento: number,
    ruta: string,
    id_tarea?: string,
    id_subtarea?: string,
}

export interface IDocumentType {
    id_tipo_documento: string,
    tipo_documento: string,
}