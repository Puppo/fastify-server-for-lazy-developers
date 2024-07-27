export type Pagination = {
  offset: number;
  limit: number;
};

export type PaginatedResult<T> = {
  count: number;
  data: T[];
};

export type SortBy<T extends object> = Array<[keyof T, ("asc" | "desc")?]>;
