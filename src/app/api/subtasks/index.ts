import { gql } from "@apollo/client";

// Query para obtener todas las subtareas
export const GET_SUBTASKS = gql`
  query GetAllSubtasks {
    subtasks {
      id
      taskId
      name
      description
      budget
      expense
      startDate
      endDate
      finalDate
      statusId
      priorityId
      status {
        id
        name
        percentage
      }
      priority {
        id
        name
      }
    }
  }
`;

// Query para obtener una subtarea por su ID
export const GET_SUBTASK = gql`
  query GetSubtask($id: ID!) {
    subtask(id: $id) {
      id
      taskId
      name
      description
      budget
      expense
      startDate
      endDate
      finalDate
      statusId
      priorityId
      status {
        id
        name
        percentage
      }
      priority {
        id
        name
      }
    }
  }
`;

// Query para obtener las subtareas de un valle por su ID
export const GET_VALLEY_SUBTASKS = gql`
  query GetValleySubtasks($valleyId: Int!) {
    valleySubtasks(valleyId: $valleyId) {
      id
      name
      taskId
      description
      budget
      expense
      startDate
      endDate
      finalDate
      priority {
        id
        name
      }
      status {
        id
        name
        percentage
      }
    }
  }
`;

// Mutación para crear una nueva subtarea
export const CREATE_SUBTASK = gql`
  mutation CreateSubtask($input: CreateSubtaskDto!) {
    createSubtask(input: $input) {
      id
      name
      description
      budget
      expense
      startDate
      endDate
      priority {
        id
        name
      }
      status {
        id
        name
        percentage
      }
    }
  }
`;

// Mutación para actualizar una subtarea existente
export const UPDATE_SUBTASK = gql`
  mutation UpdateSubtask($id: ID!, $input: UpdateSubtaskDto!) {
    updateSubtask(id: $id, input: $input) {
      id
      name
      description
      budget
      expense
      startDate
      endDate
      finalDate
      priorityId
      priority {
        id
        name
      }
      statusId
      status {
        id
        name
        percentage
      }
      taskId
    }
  }
`;

// Mutación para eliminar una subtarea
export const DELETE_SUBTASK = gql`
  mutation RemoveSubtask($id: ID!) {
    removeSubtask(id: $id) {
      id
      name
      description
    }
  }
`;

// Query para obtener los estados de las subtareas
export const GET_SUBTASK_STATUSES = gql`
  query GetSubtaskStatuses {
    subtaskStatuses {
      id
      name
      percentage
    }
  }
`;

// Query para obtener las prioridades de las subtareas
export const GET_PRIORITIES = gql`
  query GetPriorities {
    priorities {
      id
      name
    }
  }
`;

// Query para obtener subtareas por mes, año y proceso
export const GET_SUBTASKS_BY_MONTH_YEAR_AND_PROCESS = gql`
  query GetSubtasksByMonthYearAndProcess($monthName: String!, $year: Int!, $processId: Int!) {
    subtasksByMonthYearAndProcess(monthName: $monthName, year: $year, processId: $processId) {
      id
      taskId
      name
      description
      budget
      expense
      startDate
      endDate
      finalDate
      statusId
      priorityId
      status {
        id
        name
        percentage
      }
      priority {
        id
        name
      }
    }
  }
`;

// Query para obtener subtareas por proceso
export const SUBTASKS_BY_PROCESS = gql`
  query GetSubtasksByProcess($processId: Int!) {
    subtasksByProcess(processId: $processId) {
      id
      taskId
      name
      description
      budget
      expense
      startDate
      endDate
      finalDate
      status {
        id
        name
        percentage
      }
      priority {
        id
        name
      }
    }
  }
`;