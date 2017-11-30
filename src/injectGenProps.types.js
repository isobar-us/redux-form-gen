import type {FieldsType, CustomFieldTypes} from './types';
import type {LookupTable} from './utils.types';

export type Props = {
  fields: FieldsType,
  initialValues: Object,
  customFieldTypes: CustomFieldTypes
};

export type State = {
  initialValues: Object,
  lookupTable: LookupTable
};
