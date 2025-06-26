import { gql } from "@apollo/client";

export const GET_ALL_COMPLIANCES = gql`
  query GetAllCompliances {
    findAll {
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
      registries {
        id
        hes
        hem
        provider
      }
    }
  }
`;

export const GET_COMPLIANCE = gql`
  query GetComplianceById($id: ID!) {
    findOne(id: $id) {
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
      registries {
        id
        hes
        hem
        provider
        startDate
        endDate
      }
    }
  }
`;

export const GET_TASK_COMPLIANCE = gql`
  query GetTaskCompliance($taskId: ID!) {
    getTaskCompliance(id: $taskId) {
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
      registries {
        id
        hes
        hem
        provider
        startDate
        endDate
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
    create(createComplianceInput: $input) {
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
    update(id: $id, updateComplianceInput: $input) {
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
    remove(id: $id) {
      id
    }
  }
`;

export const GET_ALL_REGISTRIES = gql`
  query GetAllRegistries {
    findAllRegistries {
      id
      complianceId
      hes
      hem
      provider
      startDate
      endDate
      carta
      minuta
      es_solped
      es_memo
      solpedMemoSap
      hesHemSap
      memos {
        id
        value
      }
      solpeds {
        id
        ceco
        account
        value
      }
    }
  }
`;

export const GET_REGISTRY_BY_ID = gql`
  query GetRegistry($id: ID!) {
    findOneRegistry(id: $id) {
      id
      complianceId
      hes
      hem
      provider
      startDate
      endDate
      carta
      minuta
      es_solped
      es_memo
      solpedMemoSap
      hesHemSap
      memos {
        id
        value
      }
      solpeds {
        id
        ceco
        account
        value
      }
    }
  }
`;

export const GET_COMPLIANCE_REGISTRIES = gql`
  query GetComplianceRegistries($complianceId: ID!) {
    getComplianceRegistries(complianceId: $complianceId) {
      id
      complianceId
      hes
      hem
      provider
      startDate
      endDate
      carta
      minuta
      es_solped
      es_memo
      solpedMemoSap
      hesHemSap
      memos {
        id
        value
      }
      solpeds {
        id
        ceco
        account
        value
      }
    }
  }
`;

export const CREATE_REGISTRY = gql`
  mutation CreateRegistry($input: CreateRegistryInput!) {
    createRegistry(createRegistryInput: $input) {
      id
      complianceId
      hes
      hem
      provider
      startDate
      endDate
      carta
      minuta
      es_solped
      es_memo
      solpedMemoSap
      hesHemSap
    }
  }
`;

export const UPDATE_REGISTRY = gql`
  mutation UpdateRegistry($id: ID!, $input: UpdateRegistryInput!) {
    updateRegistry(id: $id, updateRegistryInput: $input) {
      id
      complianceId
      hes
      hem
      provider
      startDate
      endDate
      carta
      minuta
      es_solped
      es_memo
      solpedMemoSap
      hesHemSap
    }
  }
`;

export const REMOVE_REGISTRY = gql`
  mutation RemoveRegistry($id: ID!) {
    removeRegistry(id: $id) {
      id
    }
  }
`;

// Query para obtener los compliances
export const GET_APPLIED_COMPLIANCES = gql`
  query GetAppliedCompliances {
    getAppliedCompliances {
      id
      taskId
      statusId
      task {
        id
        name
        description
        process {
          id
          name
        }
      }
      status {
        id
        name
        days
      }
      registries {
        id
        provider
        hes
        hem
        startDate
        endDate
      }
    }
  }
`;