export interface UploadResponse {
  success: boolean;
  ruta: string;
  filename: string;
  contentType: string;
}

export interface DeleteResponse {
  success: boolean;
  deleted: boolean;
  method: 'complete' | 'metadata_only';
  reason: 'no_task' | 'task_has_history' | 'task_no_history';
}

export interface DeleteHistoryResponse {
  success: boolean;
  deleted: boolean;
  id: string;
  name: string;
  totalDocuments: number;
  deletedDocuments: number;
  deletedBlobs: number;
  message: string;
}