import { gql } from "@apollo/client";

// Query para obtener todos los usuarios
export const GET_USERS = gql`
  query GetUsers {
    users {
      id_usuario
      email
      full_name
      id_rol
      organization
      is_active
      created_at
      updated_at
      last_login
      rol {
        id_rol
        nombre
      }
    }
  }
`;

// Query para obtener un usuario por ID
export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id_usuario
      email
      full_name
      id_rol
      organization
      is_active
      created_at
      updated_at
      last_login
      rol {
        id_rol
        nombre
      }
    }
  }
`;

// Query para obtener todos los roles
export const GET_ROLES = gql`
  query GetRoles {
    roles {
      id_rol
      nombre
    }
  }
`;

// Mutación para iniciar sesión
export const LOGIN = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      access_token
      user {
        id_usuario
        email
        full_name
        id_rol
        is_active
        rol {
          nombre
        }
      }
    }
  }
`;

// Mutación para crear un usuario
export const CREATE_USER = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      id_usuario
      email
      full_name
      id_rol
      organization
      is_active
    }
  }
`;

// Mutación para actualizar un usuario
export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $updateUserInput: UpdateUserInput!) {
    updateUser(id: $id, updateUserInput: $updateUserInput) {
      id_usuario
      email
      full_name
      id_rol
      organization
      is_active
    }
  }
`;

// Mutación para eliminar un usuario
export const REMOVE_USER = gql`
  mutation RemoveUser($id: ID!) {
    removeUser(id: $id)
  }
`;

// Mutación para desactivar un usuario
export const DEACTIVATE_USER = gql`
  mutation DeactivateUser($id: ID!) {
    deactivateUser(id: $id) {
      id_usuario
      email
      is_active
    }
  }
`;

// Mutación para activar un usuario
export const ACTIVATE_USER = gql`
  mutation ActivateUser($id: ID!) {
    activateUser(id: $id) {
      id_usuario
      email
      is_active
    }
  }
`;