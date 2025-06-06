import { gql } from '@apollo/client';

// Query para obtener todos los memos
export const GET_ALL_MEMOS = gql`
  query GetAllMemos {
    findAllMemos {
      id
      registryId
      value
      registry {
        id
        provider
      }
    }
  }
`;

// Query para obtener un memo por ID
export const GET_MEMO_BY_ID = gql`
  query GetMemoById($id: ID!) {
    findOneMemo(id: $id) {
      id
      registryId
      value
    }
  }
`;

// Query para obtener los memos asociados a un registro específico
export const GET_REGISTRY_MEMO = gql`
  query GetRegistryMemo($registryId: ID!) {
    getRegistryMemo(registryId: $registryId) {
      id
      registryId
      value
    }
  }
`;

// Mutacion para crear un nuevo memo
export const CREATE_MEMO = gql`
  mutation CreateMemo($input: CreateMemoInput!) {
    createMemo(createMemoInput: $input) {
      id
      registryId
      value
    }
  }
`;

// Mutacion para actualizar un memo existente
export const UPDATE_MEMO = gql`
  mutation UpdateMemo($id: ID!, $input: UpdateMemoInput!) {
    updateMemo(id: $id, updateMemoInput: $input) {
      id
      value
    }
  }
`;

// Mutacion para eliminar un memo
export const REMOVE_MEMO = gql`
  mutation RemoveMemo($id: ID!) {
    removeMemo(id: $id) {
      id
    }
  }
`;