export interface Filter {
  field: string;
  value?: any;
  type?: Type;
  order?: Order;
}

export enum Order {
  ASC = "ASC",
  DESC = "DESC",
}

export enum Type {
  EQUAL = "EQUAL",
  STRING_LIKE = "STRING_LIKE",
}
