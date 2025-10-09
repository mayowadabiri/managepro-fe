export interface ApiResponse<T> {
  data: T;
}

export interface Meta {
  paging: Paging;
}

export interface Paging {
  page: number;
  pages: number;
  size: number;
  total: number;
}

export interface ApiError {
  statusCode?: number;
  message: string;
  errors?: Record<string, unknown>;
  stack?: string;
}
