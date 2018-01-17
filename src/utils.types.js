import type {CustomFieldTypes, FieldType, FieldOptions, FieldsType} from './types';

export type BuildLookupTableOptions = {
  fields: FieldsType,
  customFieldTypes: CustomFieldTypes
};

export type LookupTable = {
  [key: string]: FieldType
};

type DefaultOptions = {
  data?: Object,
  initialValues?: Object,
  customFieldTypes?: CustomFieldTypes,
  lookupTable: LookupTable,
  pathPrefix?: string,
  parentQuestionId?: string
};

export type GetDefaultValueOptions = {
  field: FieldType,
  ...DefaultOptions
};

export type GetDefaultValuesOptions = {
  fields: FieldsType,
  ...DefaultOptions
};

export type HasDefaultValueOptions = {
  field: FieldType,
  fieldOptions: FieldOptions
};
