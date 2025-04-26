import {FilterCombinator} from './filter-combinator';

export interface SearchRequest {
  page: number | null;
  pageSize: number | null;
  combinators: FilterCombinator[];
}
