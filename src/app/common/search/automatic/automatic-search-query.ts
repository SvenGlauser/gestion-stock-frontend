import {AutomaticSearchFieldCombinaison, FilterCombinatorType} from './automatic-search-field-combinaison';
import {SearchQuery} from '../custom/search-query';
import {AutomaticSearchField} from './automatic-search-field';

export class AutomaticSearchQuery extends SearchQuery {
  public combinators: AutomaticSearchFieldCombinaison[];

  constructor(fields: AutomaticSearchField<any>[] = []) {
    super();
    this.combinators = [{
      type: FilterCombinatorType.AND,
      fields: fields,
    }];
  }

  public getFilter(fieldName: string, combinatorIndex: number = 0): AutomaticSearchField<any> | null {
    return this.combinators[combinatorIndex]
      .fields
      .find(field => fieldName == field.field) ?? null;
  }
}
