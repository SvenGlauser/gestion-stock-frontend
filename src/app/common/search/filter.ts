export interface Filter {
  field: string;
  value?: any;
  type?: FilterType;
  order?: Order;
}

export enum Order {
  ASC = "ASC",
  DESC = "DESC",
}

export enum FilterType {
  EQUAL = "EQUAL",
  STRING_LIKE = "STRING_LIKE",
}
