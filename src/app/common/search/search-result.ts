export interface SearchResult<T> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  elements: T[];
}
