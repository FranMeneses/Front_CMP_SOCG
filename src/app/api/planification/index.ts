import { gql } from "@apollo/client";

export const CREATE_TASK = gql`
mutation CreateTask($input: CreateTaskDto!) {
  createTask(input: $input) {
    id
    name
    description
    faena {
      id
      name
    }
    valley {
      id
      name
    }
    status {
      id
      name
    }
  }
}
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      name
      description
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
      name
    }
  }
`;

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