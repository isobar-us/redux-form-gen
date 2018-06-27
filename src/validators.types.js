import type {FieldType, FieldsType, FieldOptions, CustomFieldTypes} from './types';
import type {CustomOperators} from './conditionalUtils.types';

/**
 * [ValidatorOptions description]
 */
type ValidatorOptions = { // eslint-disable-line no-unused-vars
  data: Object,
  customFieldTypes?: CustomFieldTypes,
  customOperators?: CustomOperators,
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
};

/**
 * Options passed into isSectionValid()
 * @extends ValidatorOptions
 */
export type SectionValidOptions = {
  fields: FieldsType,
  errors?: Object,
  onSetError: Function,
  ...ValidatorOptions
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

export type SectionEmptyOptions = {
  fields: FieldsType,
  ...ValidatorOptions
};

export type FieldEmptyOptions = {
  field: FieldType,
  ...ValidatorOptions
};
