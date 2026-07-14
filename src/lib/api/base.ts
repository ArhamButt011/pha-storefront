export interface BeResponse<T = null> {
  status: "Success" | "Fail";
  message: string;
  data: T;
  token?: string;
  systemfailure?: boolean;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}