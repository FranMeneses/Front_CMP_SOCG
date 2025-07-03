import { gql } from "@apollo/client";

export const GET_ALL_COMPLIANCES = gql`
  query GetAllCompliances {
    findAllCompliances {
      id
      taskId
      statusId
      status {
        id
        name
        days
      }
      task {
        id
        name
        description
        statusId
      }
    }
  }
`;

export const GET_COMPLIANCE = gql`
  query GetComplianceById($id: ID!) {
    findOneCompliance(id: $id) {
      id
      taskId
      statusId
      status {
        id
        name
        days
      }
      task {
        id
        name
        description
        statusId
      }
    }
  }
`;

export const GET_TASK_COMPLIANCE = gql`
  query GetTaskCompliance($taskId: ID!) {
    getTaskCompliance(taskId: $taskId) {
      id
      taskId
      statusId
      task {
        id
        name
        description
        statusId
      }
      status {
        id
        name
        days
      }
    }
  }
`;

export const GET_COMPLIANCE_STATUSES = gql`
  query GetAllComplianceStatuses {
    getAllComplianceStatuses {
      id
      name
      days
    }
  }
`;

export const CREATE_COMPLIANCE = gql`
  mutation CreateCompliance($input: CreateComplianceInput!) {
    createCompliance(createComplianceInput: $input) {
      id
      taskId
      statusId
      status {
        id
        name
        days
      }
    }
  }
`;

export const UPDATE_COMPLIANCE = gql`
  mutation UpdateCompliance($id: ID!, $input: UpdateComplianceInput!) {
    updateCompliance(id: $id, updateComplianceInput: $input) {
      id
      taskId
      statusId
      status {
        name
      }
    }
  }
`;

export const REMOVE_COMPLIANCE = gql`
  mutation RemoveCompliance($id: ID!) {
    removeCompliance(id: $id)
  }
`;