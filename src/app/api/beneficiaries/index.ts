import { gql } from "@apollo/client";

// QUERIES

export const GET_BENEFICIARIES = gql`
  query {
    beneficiaries {
      id
      legalName
      rut
      address
      entityType
      representative
      hasLegalPersonality
      contacts {
        id
        name
        position
        email
        phone
      }
    }
  }
`;

export const GET_BENEFICIARY = gql`
  query GetBeneficiary($id: ID!) {
    beneficiary(id: $id) {
      id
      legalName
      rut
      address
      entityType
      representative
      hasLegalPersonality
      contacts {
        id
        name
        position
        email
        phone
      }
    }
  }
`;

export const GET_CONTACTS = gql`
  query {
    contacts {
      id
      name
      position
      email
      phone
      beneficiary {
        id
        legalName
      }
    }
  }
`;

// MUTATIONS

export const CREATE_BENEFICIARY = gql`
  mutation CreateBeneficiary($input: CreateBeneficiaryInput!) {
    createBeneficiary(input: $input) {
      id
      legalName
      rut
      address
      entityType
      representative
      hasLegalPersonality
    }
  }
`;

export const CREATE_CONTACT = gql`
  mutation CreateContact($input: CreateContactInput!) {
    createContact(input: $input) {
      id
      name
      position
      email
      phone
      beneficiary {
        id
        legalName
      }
    }
  }
`;

export const UPDATE_BENEFICIARY = gql`
  mutation UpdateBeneficiary($id: ID!, $input: UpdateBeneficiaryInput!) {
    updateBeneficiary(id: $id, input: $input) {
      id
      legalName
      rut
      address
      entityType
      representative
      hasLegalPersonality
    }
  }
`;

export const UPDATE_CONTACT = gql`
  mutation UpdateContact($id: ID!, $input: UpdateContactInput!) {
    updateContact(id: $id, input: $input) {
      id
      name
      position
      email
      phone
      beneficiary {
        id
        legalName
      }
    }
  }
`;

export const REMOVE_BENEFICIARY = gql`
  mutation RemoveBeneficiary($id: ID!) {
    removeBeneficiary(id: $id) {
      id
      legalName
    }
  }
`;

export const REMOVE_CONTACT = gql`
  mutation RemoveContact($id: ID!) {
    removeContact(id: $id) {
      id
      name
      beneficiary {
        id
        legalName
      }
    }
  }
`;