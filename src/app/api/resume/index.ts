import { gql } from "@apollo/client";

// QUERIES

export const GET_TASKS = gql`
  query GetTasks($query: String) {
    tasks(query: $query) {
      id
      name
      description
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      name
      description
    }
  }
`;

export const GET_TASK_PROGRESS = gql`
  query GetTaskProgress($id: ID!) {
    taskProgress(id: $id)
  }
`;

export const GET_TASK_SUBTASKS = gql`
  query GetTaskSubtasks($id: ID!) {
    taskSubtasks(id: $id) {
      id
      name
      description
    }
  }
`;

export const GET_TASK_TOTAL_BUDGET = gql`
  query GetTaskTotalBudget($id: ID!) {
    taskTotalBudget(id: $id)
  }
`;

export const GET_TASK_TOTAL_EXPENSE = gql`
  query GetTaskTotalExpense($id: ID!) {
    taskTotalExpense(id: $id)
  }
`;

export const GET_SUBTASKS = gql`
  query GetSubtasks($query: String) {
    subtasks(query: $query) {
      id
      name
      description
    }
  }
`;

// MUTATIONS

export const GET_SUBTASK = gql`
  query GetSubtask($id: ID!) {
    subtask(id: $id) {
      id
      name
      description
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      name
      description
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
      name
      description
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