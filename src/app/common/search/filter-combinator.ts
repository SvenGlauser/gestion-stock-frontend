import {Filter} from './filter';

export interface FilterCombinator {
  filters: Filter[];
  type: FilterCombinatorType;
}

export enum FilterCombinatorType {
  OR = "OR",
  AND = "AND"
}
