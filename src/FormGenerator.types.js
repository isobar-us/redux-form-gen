import type {FieldsType, CustomFieldTypes} from './types';
import type {CustomOperators} from './conditionalUtils.types';
import type {LookupTable} from './utils.types';

export type Props = {
  fields: FieldsType,
  customQuestionProps?: {
    [key: string]: Object
  },
  visibleDepth?: string,
  customFieldTypes?: CustomFieldTypes,
  customOperators?: CustomOperators,
  display?: 'stacked' | 'inline',
  disabled?: boolean,
  lookupTable: LookupTable
};

export type State = {
  wasGenerated: true,
  lookupTable: Object | null
};
