import { gql } from "@apollo/client";

// Query para obtener todos los historiales
export const GET_ALL_HISTORIES = gql`
  query GetAllHistories {
    histories {
      id
      name
      processId
      finalDate
      totalExpense
      valleyId
      faenaId
      solpedMemoSap
      hesHemSap
      process {
        id
        name
      }
      valley {
        id
        name
      }
      faena {
        id
        name
      }
    }
  }
`;
 // Query para obtener un historial por ID
export const GET_HISTORY = gql`
  query GetHistory($id: ID!) {
    history(id: $id) {
      id
      name
      processId
      finalDate
      totalExpense
      valleyId
      faenaId
      solpedMemoSap
      hesHemSap
      process {
        id
        name
      }
      valley {
        id
        name
      }
      faena {
        id
        name
      }
      documents {
        id
        historyId
        fileName
        documentTypeId
        path
        uploadDate
        documentType {
          id_tipo_documento
          tipo_documento
        }
      }
    }
  }
`;

// Query para obtener un historial por ID de proceso
export const GET_HISTORIES_BY_PROCESS = gql`
  query GetHistoriesByProcess($processId: Int!) {
    historiesByProcess(processId: $processId) {
      id
      name
      finalDate
      totalExpense
      process {
        id
        name
      }
    }
  }
`;

// Query para obtener un historial por ID de valle
export const GET_HISTORIES_BY_VALLEY = gql`
  query GetHistoriesByValley($valleyId: Int!) {
    historiesByValley(valleyId: $valleyId) {
      id
      name
      processId
      finalDate
      totalExpense
      valleyId
      faenaId
      solpedMemoSap
      hesHemSap
      process {
        id
        name
      }
      valley {
        id
        name
      }
      faena {
        id
        name
      }
    }
  }
`;

// Query para obtener un historial por ID de faena
export const GET_HISTORIES_BY_FAENA = gql`
  query GetHistoriesByFaena($faenaId: Int!) {
    historiesByFaena(faenaId: $faenaId) {
      id
      name
      processId
      finalDate
      totalExpense
      valleyId
      faenaId
      solpedMemoSap
      hesHemSap
      process {
        id
        name
      }
      valley {
        id
        name
      }
      faena {
        id
        name
      }
    }
  }
`;