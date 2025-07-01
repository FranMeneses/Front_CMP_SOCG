import { gql } from "@apollo/client";

// Query para obtener las notificaciones del usuario autenticado
export const GET_MY_NOTIFICATIONS = gql`
  query GetMyNotifications {
    myNotifications {
      id_notificacion
      id_usuario
      titulo
      mensaje
      leida
      read_at
      created_at
      id_tarea
    }
  }
`;

// Query para obtener el conteo de notificaciones no leídas
export const GET_UNREAD_NOTIFICATIONS_COUNT = gql`
  query GetUnreadNotificationsCount {
    unreadNotificationsCount
  }
`;

// Mutation para marcar una notificación como leída
export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($notificationId: String!) {
    markNotificationAsRead(notificationId: $notificationId) {
      success
      message
    }
  }
`;

// Mutation para crear una nueva notificación (para uso administrativo)
export const CREATE_NOTIFICATION = gql`
  mutation CreateNotification($input: CreateNotificationInput!) {
    createNotification(input: $input) {
      id_notificacion
      id_usuario
      titulo
      mensaje
      leida
      read_at
      created_at
      id_tarea
    }
  }
`; 