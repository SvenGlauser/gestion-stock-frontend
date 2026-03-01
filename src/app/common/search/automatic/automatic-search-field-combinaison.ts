import {AutomaticSearchField} from './automatic-search-field';

export interface AutomaticSearchFieldCombinaison {
  fields: AutomaticSearchField<any>[];
  type: FilterCombinatorType;
}

export enum FilterCombinatorType {
  OR = "OR",
  AND = "AND"
}
