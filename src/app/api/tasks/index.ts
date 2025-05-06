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

export const GET_VALLEY_TASKS_COUNT = gql`
  query GetValleyTasksCount($valleyId: Int!) {
    valleyTasksCount(valleyId: $valleyId)
  }
`;

// MUTATIONS
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
  mutation UpdateTask($id: ID!, $input: UpdateTaskDto!) {
    updateTask(id: $id, input: $input) {
      id
      name
      description
      faenaId
      status {
        id
        name
      }
      faena {
        id
        name
      }
      valley {
        id
        name
      }
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
