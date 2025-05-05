import { gql } from "@apollo/client";

// QUERIES

export const GET_SUBTASKS = gql`
  query GetAllSubtasks {
    subtasks {
      id
      taskId
      number
      name
      description
      budget
      expense
      startDate
      endDate
      finalDate
      beneficiaryId
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

export const GET_SUBTASK = gql`
  query GetSubtask($id: ID!) {
    subtask(id: $id) {
      id
      name
      description
    }
  }
`;

export const GET_VALLEY_SUBTASKS = gql`
  query GetValleySubtasks($valleyId: Int!) {
    valleySubtasks (valleyId: $valleyId ) {
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
      beneficiary {
        id
        legalName
      }
    }
  }
`;

// MUTATIONS

export const CREATE_SUBTASK = gql`
  mutation CreateSubtask($input: CreateSubtaskInput!) {
    createSubtask(input: $input) {
      id
      taskId
      number
      name
      description
      budget
      expense
      startDate
      endDate
      finalDate
      beneficiaryId
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

export const UPDATE_SUBTASK = gql`
  mutation UpdateSubtask($id: ID!, $input: UpdateSubtaskInput!) {
    updateSubtask(id: $id, input: $input) {
      id
      name
      description
    }
  }
`;

export const DELETE_SUBTASK = gql`
  mutation DeleteSubtask($id: ID!) {
    deleteSubtask(id: $id) {
      id
      name
    }
  }
`;