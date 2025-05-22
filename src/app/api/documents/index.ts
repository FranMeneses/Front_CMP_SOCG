import { gql } from "@apollo/client";

// QUERY TO GET ALL DOCUMENTS
export const GET_DOCUMENTS = gql`
    query GetDocuments($tipoDocumento: Int) {
        documents(tipo_documento: $tipoDocumento) {
            id_documento
            id_tarea
            id_subtarea
            tipo_documento
            ruta
            fecha_carga
            tipo_doc {
            id_tipo_documento
            tipo_documento
            }
            tarea {
            id
            name
            }
            subtarea {
            id
            name
            }
        }
    }
`;

// QUERY TO GET DOCUMENTS BY ID
export const GET_DOCUMENT = gql`
    query GetDocument($idDocumento: String!) {
        document(id_documento: $idDocumento) {
            id_documento
            id_tarea
            id_subtarea
            tipo_documento
            ruta
            fecha_carga
            tipo_doc {
            id_tipo_documento
            tipo_documento
            }
            tarea {
            id
            name
            }
            subtarea {
            id
            name
            }
        }
    }
`;

// MUTATION TO CREATE DOCUMENT
export const CREATE_DOCUMENT = gql`
    mutation CreateDocument($input: CreateDocumentInput!) {
        createDocument(input: $input) {
            id_documento
            id_tarea
            id_subtarea
            tipo_documento
            ruta
            fecha_carga
        }
    }
`;

// MUTATION TO UPDATE DOCUMENT
export const UPDATE_DOCUMENT = gql`
    mutation UploadDocument($input: CreateDocumentDto!) {
        uploadDocument(input: $input)
    }
`;

// MUTATION TO DELETE DOCUMENT
export const DELETE_DOCUMENT = gql`
    mutation DeleteDocument($idDocumento: String!) {
        deleteDocument(id_documento: $idDocumento)
    }
`;