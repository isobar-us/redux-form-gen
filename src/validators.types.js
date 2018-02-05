import type {FieldType, FieldsType, FieldOptions} from './types';

type ValidatorOptions = {
  data: Object,
  customFieldTypes?: Object,
  lookupTable: Object,
  pathPrefix?: string,
  parentQuestionId?: string,
  messages?: {
    requiredMessage?: string,
    invalidMessage?: string
  }
};

export type FieldValidatorOptions = {
  field: FieldType,
  fieldOptions?: FieldOptions,
  ...ValidatorOptions
}

export type SectionValidOptions = {
  fields: FieldsType,
  errors?: Object,
  ...ValidatorOptions
};

export type FieldValidOptions = {
  field: FieldType,
  errors?: Object,
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
