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
        description
        statusId
      }
    }
  }
`;