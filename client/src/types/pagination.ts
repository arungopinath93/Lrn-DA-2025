export type PaginationParams = {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  metadata: PaginationParams;
};