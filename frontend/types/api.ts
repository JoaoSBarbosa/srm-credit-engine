export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  empty: boolean;
};

export type ApiError = {
  status: number;
  message: string;
};
