declare namespace API {
  interface Response<T = any> {
    code: number;
    msg: string;
    data: T;
  };

  type PaginationParams<T = {}> = T & {
    page?: number;
    pageSize?: number;
  };

  interface ListData<T = any> {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
  }
}
