export class PaginatedResultDto<T> {
  results: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;

  constructor(
    results: T[],
    totalCount: number,
    totalPages: number,
    currentPage: number,
    hasNextPage: boolean
  ) {
    this.results = results;
    this.totalCount = totalCount;
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.hasNextPage = hasNextPage;
  }
}
