// @flow
import isNil from 'lodash/isNil';
import trim from 'lodash/trim';
import isEmpty from 'lodash/isEmpty';

import get from 'lodash/get';
import set from 'lodash/set';
import has from 'lodash/has';
import omit from 'lodash/omit';
import isPlainObject from 'lodash/isPlainObject';
// import merge from 'lodash/merge';

import {evalCond, evalCondValid} from './conditionalUtils';
import {getFieldOptions} from './defaultFieldTypes';
import {mergePaths} from './utils';

import type {
  FieldValidatorOptions,
  SectionValidOptions,
  FieldValidOptions,
  SectionFilledOptions,
  FieldFilledOptions,
  SectionEmptyOptions,
  FieldEmptyOptions
} from './validators.types';

export const isNilOrEmpty = (value: mixed) =>
  // TODO doesn't work with NaN? what about Infinity?
  // $FlowFixMe
  isNil(value) || isEmpty(trim(value)) || ((isPlainObject(value) || Array.isArray(value)) && isEmpty(value));

/**
 * [getFieldPath description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
export const getFieldPath = (options: FieldValidatorOptions) => {
  const {pathPrefix, field} = options;
  return has(field, 'questionId') ? mergePaths(pathPrefix, field.questionId) : null; // TODO [test] make sure pathPrefix works
};

// TODO maybe describe this as `isRenderable` or `canRender`?
// it can get confusing when it comes to visible/hidden
/**
 * [isFieldHidden description]
 * @param  {[type]}  options [description]
 * @return {Boolean}         [description]
 */
export const isFieldHidden = (options: FieldValidatorOptions) => {
  options = {
    ...options,
    fieldOptions: resolveFieldOptions(options)
  };
  const {fieldOptions} = options;
  return has(fieldOptions, '_genHidden') ? fieldOptions._genHidden : false;
};

/**
 * [isFieldVisible description]
 * @param  {[type]}  options [description]
 * @return {Boolean}         [description]
 */
export const isFieldVisible = (options: FieldValidatorOptions) => {
  options = {
    ...options,
    fieldOptions: resolveFieldOptions(options)
  };
  const {field, parentQuestionId} = options;

  const hidden = isFieldHidden(options);

  return !hidden && has(field, 'conditionalVisible')
    ? evalCond({
        ...options,
        cond: field.conditionalVisible,
        ...(parentQuestionId && {valueKey: parentQuestionId})
      })
    : true;
};

/**
 * [isFieldDisabled description]
 * @param  {[type]}  options [description]
 * @return {Boolean}         [description]
 */
export const isFieldDisabled = (options: FieldValidatorOptions) => {
  const {field, parentQuestionId} = options;
  let fieldOptions = resolveFieldOptions(options);

  return (
    (has(field, 'disabled') && field.disabled) ||
    (has(fieldOptions, 'disabled') && fieldOptions.disabled) ||
    (has(field, 'conditionalDisabled') &&
      evalCond({
        ...options,
        cond: field.conditionalDisabled,
        ...(parentQuestionId && {valueKey: parentQuestionId})
      }))
  );
};

/**
 * [isFieldRequired description]
 * the required state takes into account the disabled state of a field
 * @param  {[type]}  options [description]
 * @return {Boolean}         [description]
 */
export const isFieldRequired = (options: FieldValidatorOptions) => {
  const {field, parentQuestionId} = options;
  let disabled = resolveDisabled(options);
  // let {disabled} = options;
  // if (isNil(disabled)) {
  //   disabled = isFieldDisabled(options);
  // }

  return (
    (!disabled && (has(field, 'required') && field.required)) ||
    (has(field, 'conditionalRequired') &&
      evalCond({
        ...options,
        cond: field.conditionalRequired,
        ...(parentQuestionId && {valueKey: parentQuestionId})
      }))
  );
};

/**
 * [isFieldFilled description]
 * @param  {[type]}  options [description]
 * @return {Boolean}         [description]
 */
export const isFieldFilled = (options: FieldValidatorOptions) => {
  const {field, data} = options;
  let fieldOptions = resolveFieldOptions(options);

  if (has(fieldOptions, '_genIsFilled') && !isNil(fieldOptions._genIsFilled)) {
    return fieldOptions._genIsFilled(options);
  } else if (has(field, 'questionId')) {
    const path = getFieldPath(options);
    const value = get(data, path);
    return !isNilOrEmpty(value);
  } else {
    return true; // default to true if there is no questionId
  }
};

/**
 * [isFieldEmpty description]
 * @param  {[type]}  options [description]
 * @return {Boolean}         [description]
 */
export const isFieldEmpty = (options: FieldValidatorOptions) => {
  const {field, data} = options;
  let fieldOptions = resolveFieldOptions(options);

  if (has(fieldOptions, '_genIsFilled') && !isNil(fieldOptions._genIsFilled)) {
    return !fieldOptions._genIsFilled(options);
  } else if (has(field, 'questionId')) {
    const path = getFieldPath(options);
    const value = get(data, path);
    return isNilOrEmpty(value);
  } else {
    return true; // default to true if there is no questionId
  }
};

/**
 * [isFieldValid description]
 * @param  {[type]}  options [description]
 * @return {Boolean}         [description]
 */
export const isFieldValid = (options: FieldValidatorOptions) => {
  const {field} = options;
  let fieldOptions = resolveFieldOptions(options);
  let fieldValid = true;

  if (has(fieldOptions, '_genIsValid') && !isNil(fieldOptions._genIsValid)) {
    fieldValid = fieldValid && fieldOptions._genIsValid(options);
  }
  if (has(field, 'conditionalValid')) {
    fieldValid =
      fieldValid &&
      evalCondValid({
        ...options,
        cond: field.conditionalValid,
        ...(field.questionId && {valueKey: field.questionId})
      });
  }

  // TODO should this take into account _genSectionErrors?
  // I think should, and check for empty object

  return fieldValid;
};

/**
 * [mapFieldChildren description]
 * @param  {[type]} options  [description]
 * @param  {[type]} iterator [description]
 * @return {[type]}          [description]
 */
export const mapFieldChildren = (options: FieldValidatorOptions, iterator: Function) => {
  let fieldOptions = resolveFieldOptions(options);
  options = omit(options, 'fieldOptions');
  const {field} = options;

  const parentOptions = {
    ...(field && {parent: field}),
    ...(field.questionId && {parentQuestionId: field.questionId})
  };

  // TODO figure out what to do about childFields in addition to special children, _genSkipChildren
  // reminder: _genSkipChildren is only to skip render, not skip traversal

  let allChildFields = [];
  // anything can have childFields
  if (has(field, 'childFields') && Array.isArray(field.childFields)) {
    allChildFields = allChildFields.concat(
      field.childFields.map((field, index) =>
        iterator({
          ...options,
          ...parentOptions,
          field,
          index
        })
      )
    );
  }

  // if the fieldOptions specifies additional children, use them too
  if (fieldOptions._genTraverseChildren) {
    allChildFields = allChildFields.concat(
      fieldOptions._genTraverseChildren({
        ...options,
        ...parentOptions,
        iterator
      })
    );
  } else if (has(fieldOptions, '_genChildren') && Array.isArray(fieldOptions._genChildren)) {
    allChildFields = allChildFields.concat(
      fieldOptions._genChildren.map((field, index) =>
        iterator({
          ...options,
          ...parentOptions,
          field,
          index
        })
      )
    );
  }
  return allChildFields;
};

// TODO figure out a way to replicate this pattern better
/**
 * [resolve description]
 * @param  {[type]} property [description]
 * @param  {[type]} resolver [description]
 * @param  {[type]} options  [description]
 * @return {[type]}          [description]
 */
export const resolve = (property: string, resolver: Function, options: Object) =>
  !isNil(options[property]) ? options[property] : resolver(options);

export const resolveFieldOptions = (options: FieldValidatorOptions) =>
  resolve('fieldOptions', getFieldOptions, options);
export const resolveDisabled = (options: FieldValidatorOptions) => resolve('disabled', isFieldDisabled, options);

// const resolverMap = {
//   fieldOptions: getFieldOptions,
//   disabled: isFieldDisabled,
//   visible: isFieldVisible,
//   required: isFieldRequired
// };
//
// const resolvers = Object.keys(resolverMap).reduce((resolvers, property) =>
//   Object.assign(resolvers, {
//     [property]: (options) => resolve(property, resolverMap[property], options)
//   })
// , {});
//
// const resolveAll = (props, options) => props.reduce((options, property) =>
//   Object.assign(options, {
//     [property]: resolvers[property](options)
//   })
// , options);

// ####################################################
// # Valid
// ####################################################

// options = {fields, data, lookupTable, customFieldTypes, parentQuestionId, errors = {}}
export const getSectionErrors = (options: SectionValidOptions) => {
  options = {
    // fields
    // customFieldTypes
    // data
    errors: {},
    deep: true,
    ...options
  };

  const {fields} = options;
  let {errors} = options;

  fields.map((field) => getSectionErrorsIterator({...options, field}));

  return errors;
};

export const INVALID_MESSAGE = 'Invalid Field';
export const REQUIRED_MESSAGE = 'Required Field';

export const getSectionErrorsIterator = (options: FieldValidOptions) => {
  options = {
    // field
    // customFieldTypes
    // data
    deep: false,
    errors: {},
    messages: {
      requiredMessage: REQUIRED_MESSAGE,
      invalidMessage: INVALID_MESSAGE,
      ...options.messages
    },
    ...options,
    fieldOptions: resolveFieldOptions(options)
  };

  const {field, messages, deep, fieldOptions} = options;
  let {errors} = options;

  const requiredMessage = has(field, 'requiredMessage') ? field.requiredMessage : messages.requiredMessage;
  const invalidMessage = has(field, 'invalidMessage') ? field.invalidMessage : messages.invalidMessage;

  // only parse valid field types
  if (!isNil(fieldOptions)) {
    if (isFieldVisible(options)) {
      const disabled = isFieldDisabled(options);
      const required = isFieldRequired({...options, disabled});

      if (has(fieldOptions, 'name')) {
        const path = getFieldPath(options);

        if (required && !isFieldFilled(options)) {
          set(errors, path, requiredMessage);
        } else if (!isFieldValid(options)) {
          set(errors, path, invalidMessage);
        }
      }

      if (has(fieldOptions, '_genSectionErrors')) {
        fieldOptions._genSectionErrors(options);
      }

      if (deep) {
        mapFieldChildren({...options, fieldOptions: null}, getSectionErrorsIterator);
      }
    }
  }
  return errors;
};

// ####################################################
// # Filled
// ####################################################

// options = {field, data, lookupTable, customFieldTypes, parentQuestionId}
export const isSectionFilledIterator = (options: FieldFilledOptions) => {
  options = {
    // field
    // customFieldTypes
    // data
    deep: false,
    ...options,
    fieldOptions: resolveFieldOptions(options)
  };
  const {deep, fieldOptions} = options;
  let fieldFilled = true;

  if (!isNil(fieldOptions)) {
    if (isFieldVisible(options)) {
      const disabled = isFieldDisabled(options);
      const required = isFieldRequired({...options, disabled});

      if (required) {
        fieldFilled = fieldFilled && isFieldFilled(options);
      }

      if (deep) {
        fieldFilled =
          fieldFilled &&
          mapFieldChildren({...options, fieldOptions: null}, isSectionFilledIterator).reduce(
            (result, fieldResult) => result && fieldResult,
            true
          );
      }
    }
  }

  return fieldFilled;
};

// returns true if a section has any fields that have been filled out, false otherwise
// lookupTable is required if you have fields that are conditionalValid.
export const isSectionFilled = (options: SectionFilledOptions) => {
  options = {
    // fields
    // customFieldTypes
    // data
    deep: true,
    ...options
  };
  const {fields} = options;

  return fields.reduce((valid, field) => valid && isSectionFilledIterator({...options, field}), true);
};

// ####################################################
// # Empty
// ####################################################

export const isSectionEmptyIterator = (options: FieldEmptyOptions) => {
  options = {
    // field
    // customFieldTypes
    // data
    deep: false,
    ...options,
    fieldOptions: resolveFieldOptions(options)
  };
  const {deep, fieldOptions} = options;
  let fieldEmpty = true;

  if (!isNil(fieldOptions)) {
    if (isFieldVisible(options)) {
      fieldEmpty = isFieldEmpty(options);

      if (deep) {
        fieldEmpty =
          fieldEmpty &&
          mapFieldChildren({...options, fieldOptions: null}, isSectionEmptyIterator).reduce(
            (result, fieldResult) => result && fieldResult,
            true
          );
      }
    }
  }

  return fieldEmpty;
};

// returns true if a section has any fields that have been filled out, false otherwise
export const isSectionEmpty = (options: SectionEmptyOptions) => {
  options = {
    // fields
    // customFieldTypes
    // data
    deep: true,
    ...options
  };
  const {fields} = options;

  return fields.reduce((empty, field) => empty && isSectionEmptyIterator({...options, field}), true);
};
