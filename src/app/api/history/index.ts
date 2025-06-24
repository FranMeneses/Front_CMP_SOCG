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
      beneficiaryId
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
      beneficiary {
        id
        legalName
        rut
      }
      documents {
        id
        historyId
        fileName
        documentTypeId
        path
        uploadDate
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
      beneficiaryId
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
      beneficiary {
        id
        legalName
        rut
      }
      documents {
        id
        historyId
        fileName
        documentTypeId
        path
        uploadDate
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
      beneficiaryId
      process {
        id
        name
      }
      beneficiary {
        id
        legalName
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
      beneficiaryId
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
      beneficiary {
        id
        legalName
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
      beneficiaryId
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
      beneficiary {
        id
        legalName
      }
    }
  }
`;

// Query para obtener historiales por ID de beneficiario
export const GET_HISTORIES_BY_BENEFICIARY = gql`
  query GetHistoriesByBeneficiary($beneficiaryId: ID!) {
    historiesByBeneficiary(beneficiaryId: $beneficiaryId) {
      id
      name
      processId
      finalDate
      totalExpense
      valleyId
      faenaId
      solpedMemoSap
      hesHemSap
      beneficiaryId
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
      beneficiary {
        id
        legalName
        rut
      }
      documents {
        id
        historyId
        fileName
        documentTypeId
        path
        uploadDate
      }
    }
  }
`;