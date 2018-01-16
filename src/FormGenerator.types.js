import type {FieldsType, CustomFieldTypes} from './types';
import type {LookupTable} from './utils.types';

/**
 * [FormGenerator Props description]
 * @name FormGeneratorProps
 */
export type Props = {
  fields: FieldsType,
  customQuestionProps?: {
    [key: string]: Object
  },
  visibleDepth?: string,
  customFieldTypes?: CustomFieldTypes,
  display?: 'stacked' | 'inline',
  disabled?: boolean,
  lookupTable: LookupTable
};

export type State = {
  cachedValues: Object
};
