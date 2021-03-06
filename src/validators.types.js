import type {FieldType, FieldsType, FieldOptions, CustomFieldTypes} from './types';
import type {CustomOperators} from './conditionalUtils.types';

type ValidatorOptions = {
  data: Object,
  customFieldTypes?: CustomFieldTypes,
  customOperators?: CustomOperators,
  lookupTable: Object,
  pathPrefix?: string,
  parentPath?: string,
  messages?: {
    requiredMessage?: string,
    invalidMessage?: string
  }
};

export type FieldValidatorOptions = {
  field: FieldType,
  fieldOptions?: FieldOptions,
  ...ValidatorOptions
};

export type SectionValidOptions = {
  fields: FieldsType,
  errors?: Object,
  onSetError: Function,
  excludeInvalid: Boolean,
  excludeRequired: Boolean,
  ...ValidatorOptions
};

export type FieldValidOptions = {
  field: FieldType,
  errors?: Object,
  onSetError: Function,
  excludeInvalid: Boolean,
  excludeRequired: Boolean,
  ...ValidatorOptions
};

export type SectionFilledOptions = {
  fields: FieldsType,
  ...ValidatorOptions
};

export type FieldFilledOptions = {
  field: FieldType,
  ...ValidatorOptions
};

export type SectionEmptyOptions = {
  fields: FieldsType,
  ...ValidatorOptions
};

export type FieldEmptyOptions = {
  field: FieldType,
  ...ValidatorOptions
};
