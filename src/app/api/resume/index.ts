import { gql } from "@apollo/client";

// QUERIES

export const GET_TASKS = gql`
  query {
    tasks {
      id
      name
      description
      valleyId
      faenaId
      statusId
      valley {
        id
        name
      }
      faena {
        id
        name
      }
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      name
      description
      valleyId
      faenaId
      statusId
      valley {
        id
        name
      }
      faena {
        id
        name
      }
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

// MUTATIONS