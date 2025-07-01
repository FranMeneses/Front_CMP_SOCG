export interface INotification {
  id_notificacion: string;
  id_usuario: string;
  titulo: string;
  mensaje: string;
  leida: boolean;
  read_at?: Date;
  created_at: Date;
  id_tarea?: string;
}

export interface ICreateNotificationInput {
  id_usuario: string;
  titulo: string;
  mensaje: string;
  id_tarea?: string;
}

export interface INotificationResponse {
  success: boolean;
  message?: string;
} 