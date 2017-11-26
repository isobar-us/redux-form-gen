import type {FieldType, FieldsType} from './types';

type ValidatorOptions = {
  data: Object,
  customFieldTypes?: Object,
  lookupTable?: Object,
  pathPrefix?: string,
  parentQuestionId?: string,
  messages?: {
    requiredMessage?: string,
    invalidMessage?: string
  }
};

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
