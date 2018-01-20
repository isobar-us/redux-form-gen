import type {FieldType, FieldsType} from './types';

/**
 * [ValidatorOptions description]
 */
type ValidatorOptions = { // eslint-disable-line no-unused-vars
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

/**
 * Options passed into isSectionValid()
 * @extends ValidatorOptions
 */
export type SectionValidOptions = {
  fields: FieldsType,
  errors?: Object
  /* :: ...ValidatorOptions */
};

/**
 * [FieldValidOptions description]
 * @extends ValidatorOptions
 */
export type FieldValidOptions = {
  field: FieldType,
  errors?: Object
  /* :: ...ValidatorOptions */
};

/**
 * Options passed into isSectionFilled()
 * @extends ValidatorOptions
 */
export type SectionFilledOptions = {
  fields: FieldsType
  /* :: ...ValidatorOptions */
};

/**
 * [FieldFilledOptions description]
 * @extends ValidatorOptions
 */
export type FieldFilledOptions = {
  field: FieldType
  /* :: ...ValidatorOptions */
};
