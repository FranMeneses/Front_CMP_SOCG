import { gql } from "@apollo/client";

// Query para obtener todas las tareas
export const GET_TASKS = gql`
  query {
    tasks {
      id
      name
      description
      valleyId
      faenaId
      statusId
      processId
      applies
      beneficiaryId
      valley {
        id
        name
      }
      faena {
        id
        name
      }
      status {
        id
        name
      }
      process {
        id
        name
      }
      beneficiary {
        id
        legalName
      }
    }
  }
`;

// Query para obtener una tarea por su ID
export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      name
      description
      valleyId
      faenaId
      applies
      statusId
      processId
      beneficiaryId
      valley {
        id
        name
      }
      faena {
        id
        name
      }
      status {
        id
        name
      }
      process {
        id
        name
      }
      beneficiary {
        id
        legalName
        rut
      }
    }
  }
`;

// Query para obtener tareas por valle
export const GET_TASKS_BY_VALLEY = gql`
  query GetTasksByValley($valleyId: Int!) {
    tasksByValley(valleyId: $valleyId) {
      id
      name
      description
      statusId
      processId
      applies
      beneficiaryId
      status {
        id
        name
      }
      faenaId
      faena {
        id
        name
      }
      valleyId
      valley {
        id
        name
      }
      process {
        id
        name
      }
      beneficiary {
        id
        legalName
      }
    }
  }
`;

// Query para obtener el progreso de una tarea por su ID
export const GET_TASK_PROGRESS = gql`
  query GetTaskProgress($id: ID!) {
    taskProgress(id: $id)
  }
`;

// Query para obtener las subtareas de una tarea por su ID
export const GET_TASK_SUBTASKS = gql`
  query GetTaskSubtasks($id: ID!) {
    taskSubtasks(id: $id) {
      id
      taskId
      name
      description
      budget
      expense
      startDate
      endDate
      finalDate
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

// Query para obtener el total del presupuesto de una tarea por su ID
export const GET_TASK_TOTAL_BUDGET = gql`
  query GetTaskTotalBudget($id: ID!) {
    taskTotalBudget(id: $id)
  }
`;

// Query para obtener el total de gastos de una tarea por su ID
export const GET_TASK_TOTAL_EXPENSE = gql`
  query GetTaskTotalExpense($id: ID!) {
    taskTotalExpense(id: $id)
  }
`;

// Query para obtener el total de tareas por valle
export const GET_VALLEY_TASKS_COUNT = gql`
  query GetValleyTasksCount($valleyId: Int!) {
    valleyTasksCount(valleyId: $valleyId)
  }
`;

// Query para obtener el total presupuesto por mes 
export const GET_TOTAL_BUDGET_BY_MONTH_AND_PROCESS = gql`
  query GetTotalBudgetByMonthAndProcess($monthName: String!, $year: Int!, $processId: Int!) {
    totalBudgetByMonthAndProcess(monthName: $monthName, year: $year, processId: $processId)
  }
`;

// Query para obtener el total gasto por mes
export const GET_TOTAL_EXPENSE_BY_MONTH_AND_PROCESS = gql`
  query GetTotalExpenseByMonthAndProcess($monthName: String!, $year: Int!, $processId: Int!) {
    totalExpenseByMonthAndProcess(monthName: $monthName, year: $year, processId: $processId)
  }
`;

// Query para gastos mensuales
export const GET_PROCESS_MONTHLY_EXPENSES = gql`
  query GetProcessMonthlyExpenses($processId: Int!, $year: Int!) {
    processMonthlyExpenses(processId: $processId, year: $year) {
      month
      expense
    }
  }
`;

// Query para obtener el presupuesto de un valle
export const GET_PROCESS_MONTHLY_BUDGETS = gql`
  query GetProcessMonthlyBudgets($processId: Int!, $year: Int!) {
    processMonthlyBudgets(processId: $processId, year: $year) {
      month
      budget
    }
  }
`;

// Query para obtener todos los valles
export const GET_ALL_VALLEYS = gql`
  query GetAllValleys {
    valleys {
      id
      name
    }
  }
`;

// Query para obtener todas las faenas
export const GET_ALL_FAENAS = gql`
  query GetAllFaenas {
    faenas {
      id
      name
    }
  }
`;

// Query para obtener los estados de las tareas
export const GET_TASK_STATUSES = gql`
  query GetTaskStatuses {
    taskStatuses {
      id
      name
    }
  }
`;

// Query para obtener las tareas por valle y estado
export const GET_TASKS_BY_VALLEY_AND_STATUS = gql`
  query GetTasksByValleyAndStatus($valleyId: Int!, $statusId: Int!) {
    tasksByValleyAndStatus(valleyId: $valleyId, statusId: $statusId) {
      id
      name
      description
      statusId
      applies
      beneficiaryId
      status {
        id
        name
      }
      faenaId
      faena {
        id
        name
      }
      valleyId
      valley {
        id
        name
      }
      beneficiary {
        id
        legalName
      }
    }
  }
`;

// Mutación para crear una tarea
export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskDto!) {
    createTask(input: $input) {
      id
      name
      description
      applies
      beneficiaryId
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
      process {
        id
        name
      }
      beneficiary {
        id
        legalName
      }
    }
  }
`;

// Mutación para actualizar una tarea
export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskDto!) {
    updateTask(id: $id, input: $input) {
      id
      name
      description
      faenaId
      applies
      beneficiaryId
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
      process {
        id
        name
      }
      beneficiary {
        id
        legalName
      }
    }
  }
`;

// Mutación para eliminar una tarea
export const DELETE_TASK = gql`
  mutation RemoveTask($id: ID!) {
    removeTask(id: $id) {
      id
      name
      description
    }
  }
`;

// Query para obtener todos los procesos
export const GET_ALL_PROCESSES = gql`
  query GetAllProcesses {
    processes {
      id
      name
    }
  }
`;

//Query para obtener todas las tareas por proceso
export const GET_TASKS_BY_PROCESS = gql`
  query GetTasksByProcess($processId: Int!) {
    tasksByProcess(processId: $processId) {
      id
      name
      description
      statusId
      applies
      beneficiaryId
      status {
        id
        name
      }
      faenaId
      faena {
        id
        name
      }
      valleyId
      valley {
        id
        name
      }
      processId
      process {
        id
        name
      }
      beneficiary {
        id
        legalName
      }
    }
  }
`;

// Query para obtener las tareas por proceso y valle
export const GET_TASKS_BY_PROCESS_AND_VALLEY = gql`
  query TasksByProcessAndValley($processId: Int!, $valleyId: Int!) {
    tasksByProcessAndValley(processId: $processId, valleyId: $valleyId) {
      id
      name
      description
      valleyId
      faenaId
      processId
      applies
      statusId
      beneficiaryId
      valley {
        id
        name
      }
      faena {
        id
        name
      }
      process {
        id
        name
      }
      status {
        id
        name
      }
      beneficiary {
        id
        legalName
      }
    }
  }
`;

// Query para obtener las tareas por proceso y estado
export const GET_TASKS_BY_PROCESS_AND_STATUS = gql`
  query TasksByProcessAndStatus($processId: Int!, $statusId: Int!) {
    tasksByProcessAndStatus(processId: $processId, statusId: $statusId) {
      id
      name
      description
      valleyId
      faenaId
      processId
      applies
      statusId
      beneficiaryId
      valley {
        id
        name
      }
      faena {
        id
        name
      }
      process {
        id
        name
      }
      status {
        id
        name
      }
      beneficiary {
        id
        legalName
      }
    }
  }
`;

// Nuevas queries para beneficiarios
export const GET_BENEFICIARIES = gql`
  query GetBeneficiaries {
    beneficiaries {
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

// Query para obtener un beneficiario por ID
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
      tasks {
        id
        name
      }
    }
  }
`;

// Query para obtener documentos relacionados con tareas
export const GET_DOCUMENTS_BY_TASK = gql`
  query GetDocumentsByTask($taskId: String!) {
    documents(id_tarea: $taskId) {
      id_documento
      nombre_archivo
      tipo_doc {
        id_tipo_documento
        tipo_documento
      }
      fecha_carga
      ruta
    }
  }
`;