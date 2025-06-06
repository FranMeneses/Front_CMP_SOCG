import { gql } from '@apollo/client';

// Query para obtener todas las solped
export const GET_ALL_SOLPEDS = gql`
  query GetAllSolpeds {
    findAllSolpeds {
      id
      registryId
      ceco
      account
      value
      registry {
        id
        provider
      }
    }
  }
`;

// Query para obtener una solped por ID
export const GET_SOLPED_BY_ID = gql`
  query GetSolpedById($id: ID!) {
    findOneSolped(id: $id) {
      id
      registryId
      ceco
      account
      value
    }
  }
`;

// Query para obtener las solped asociadas a un registro específico
export const GET_REGISTRY_SOLPED = gql`
  query GetRegistrySolped($registryId: ID!) {
    getRegistrySolped(registryId: $registryId) {
      id
      registryId
      ceco
      account
      value
    }
  }
`;

// Mutacion para crear una nueva solped
export const CREATE_SOLPED = gql`
  mutation CreateSolped($input: CreateSolpedInput!) {
    createSolped(createSolpedInput: $input) {
      id
      registryId
      ceco
      account
      value
    }
  }
`;

// Mutacion para actualizar una solped existente
export const UPDATE_SOLPED = gql`
  mutation UpdateSolped($id: ID!, $input: UpdateSolpedInput!) {
    updateSolped(id: $id, updateSolpedInput: $input) {
      id
      ceco
      account
      value
    }
  }
`;

// Mutacion para eliminar una solped
export const REMOVE_SOLPED = gql`
  mutation RemoveSolped($id: ID!) {
    removeSolped(id: $id) {
      id
    }
  }
`;