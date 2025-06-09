import { gql } from '@apollo/client';

// Mutación para crear una infoTask
export const CREATE_INFO_TASK = gql`
  mutation CreateInfoTask($input: CreateInfoTaskInput!) {
    createInfoTask(createInfoTaskInput: $input) {
      id
      taskId
      originId
      investmentId
      typeId
      scopeId
      interactionId
      riskId
      task {
        id
        name
        applies
        description
        valleyId
        faenaId
        statusId
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
  }
`;

// Query para obtener todas las infoTasks
export const GET_INFO_TASKS = gql`
  query InfoTasks {
    infoTasks {
      id
      taskId
      originId
      investmentId
      typeId
      scopeId
      interactionId
      riskId
      task {
        id
        name
        applies
        description
        valleyId
        faenaId
        statusId
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
  }
`;

// Query para obtener una infoTask por su ID
export const GET_INFO_TASK = gql`
  query InfoTask($id: ID!) {
    infoTask(id: $id) {
      id
      taskId
      originId
      investmentId
      typeId
      scopeId
      interactionId
      riskId
      task {
        id
        name
        applies
        description
        valleyId
        faenaId
        statusId
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
  }
`;

// Mutación para actualizar una infoTask
export const UPDATE_INFO_TASK = gql`
  mutation UpdateInfoTask($id: ID!, $input: UpdateInfoTaskInput!) {
    updateInfoTask(id: $id, updateInfoTaskInput: $input) {
      id
      interactionId
      investmentId
      originId
      riskId
      scopeId
      taskId
      typeId
      task {
        id
        name
      }
    }
  }
`;

// Mutación para eliminar una infoTask
export const REMOVE_INFO_TASK = gql`
  mutation RemoveInfoTask($id: ID!) {
    removeInfoTask(id: $id) {
      id
      taskId
      originId
      investmentId
      typeId
      scopeId
      interactionId
      riskId
    }
  }
`;

// Query para obtener la infoTask por su taskId
export const GET_TASK_INFO = gql`
  query taskInfo($id: ID!) {
    taskInfo(id: $id) {
      id
      interactionId
      investmentId
      originId
      riskId
      scopeId
      taskId
      typeId
      task {
        id
        name
        applies
        description
        statusId
      }
    }
  }
`;

// Query para obtener la cantidad de tareas de inversión en un valle específico
export const GET_VALLEY_INVESTMENT_TASKS_COUNT = gql`
  query ValleyInvestmentTasksCount($investmentId: Int!, $valleyId: Int!) {
    valleyInvestmentTasksCount(investmentId: $investmentId, valleyId: $valleyId)
  }
`;

// Query para obtener los tipos de riesgo
export const GET_ALL_RISKS = gql`
  query GetAllRisks {
    risks {
      id
      type
    }
  }
`;

// Query para obtener los tipos de origen
export const GET_ALL_ORIGINS = gql`
  query GetAllOrigins {
    origins {
      id
      name
    }
  }
`;

// Query para obtener los tipos de inversión
export const GET_ALL_INVESTMENTS = gql`
  query GetAllInvestments {
    investments {
      id
      line
    }
  }
`;

// Query para obtener los tipos de interacción
export const GET_ALL_INTERACTIONS = gql`
  query GetAllInteractions {
    interactions {
      id
      operation
    }
  }
`;

// Query para obtener los tipos de alcance
export const GET_ALL_SCOPES = gql`
  query GetAllScopes {
    scopes {
      id
      name
    }
  }
`;

// Query para obtener los tipos de tarea
export const GET_ALL_TYPES = gql`
  query GetAllTypes {
    types {
      id
      name
    }
  }
`;