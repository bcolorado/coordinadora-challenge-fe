export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiMeta {
  timestamp: string;
  requestId: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiErrorDetail;
  meta: ApiMeta;
}
