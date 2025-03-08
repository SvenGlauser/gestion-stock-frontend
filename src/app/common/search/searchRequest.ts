import {Filter} from './filter';

export interface SearchRequest {
  page: number | null;
  pageSize: number | null;
  filters: Filter[];
}
