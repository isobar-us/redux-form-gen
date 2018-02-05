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

export const isNilOrEmpty = (value: mixed) =>
  // TODO doesn't work with NaN? what about Infinity?
  // $FlowFixMe
  isNil(value) || isEmpty(trim(value)) || ((isPlainObject(value) || Array.isArray(value)) && isEmpty(value));

// TODO maybe describe this as `isRenderable` or `canRender`?
// it can get confusing when it comes to visible/hidden
/**
 * [isFieldHidden description]
 * @param  {[type]}  options [description]
 * @return {Boolean}         [description]
 */
export const isFieldHidden = (options) => {
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
export const isFieldVisible = (options) => {
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
export const isFieldDisabled = (options) => {
  const {field, parentQuestionId} = options;
  let fieldOptions = resolveFieldOptions(options);

  return (has(field, 'disabled') && field.disabled) ||
    (has(fieldOptions, 'disabled') && fieldOptions.disabled) ||
    (has(field, 'conditionalDisabled') &&
      evalCond({
        ...options,
        cond: field.conditionalDisabled,
        ...(parentQuestionId && {valueKey: parentQuestionId})
      })
    );
};

/**
 * [isFieldRequired description]
 * the required state takes into account the disabled state of a field
 * @param  {[type]}  options [description]
 * @return {Boolean}         [description]
 */
export const isFieldRequired = (options) => {
  const {field, parentQuestionId} = options;
  let disabled = resolveDisabled(options);
  // let {disabled} = options;
  // if (isNil(disabled)) {
  //   disabled = isFieldDisabled(options);
  // }

  return (!disabled && (has(field, 'required') && field.required)) ||
  (has(field, 'conditionalRequired') &&
    evalCond({
      ...options,
      cond: field.conditionalRequired,
      ...(parentQuestionId && {valueKey: parentQuestionId})
    }));
};

/**
 * [_isFieldFilled description]
 * @param  {[type]}  options [description]
 * @return {Boolean}         [description]
 */
export const _isFieldFilled = (options) => {
  const {field, data, pathPrefix} = options;
  let fieldOptions = resolveFieldOptions(options);

  if (has(fieldOptions, '_genIsFilled')) {
    return fieldOptions._genIsFilled(options);
  } else if (has(field, 'questionId')) {
    const path = mergePaths(pathPrefix, field.questionId); // TODO [test] make sure pathPrefix works
    const value = get(data, path);
    return !isNilOrEmpty(value);
  } else {
    return true; // default to true if there is no questionId
  }
};

/**
 * [_isFieldEmpty description]
 * @param  {[type]}  options [description]
 * @return {Boolean}         [description]
 */
export const _isFieldEmpty = (options) => {
  const {field, data, pathPrefix} = options;
  let fieldOptions = resolveFieldOptions(options);

  if (has(fieldOptions, '_genIsFilled')) {
    return !fieldOptions._genIsFilled(options);
  } else if (has(field, 'questionId')) {
    const path = mergePaths(pathPrefix, field.questionId); // TODO [test] make sure pathPrefix works
    const value = get(data, path);
    return isNilOrEmpty(value);
  } else {
    return true; // default to true if there is no questionId
  }
};

/**
 * [_isFieldValid description]
 * @param  {[type]}  options [description]
 * @return {Boolean}         [description]
 */
export const _isFieldValid = (options) => {
  const {field} = options;
  let fieldOptions = resolveFieldOptions(options);
  let fieldValid = true;

  if (has(fieldOptions, '_genIsValid')) {
    fieldValid = fieldValid && fieldOptions._genIsValid(options);
  } else if (has(field, 'conditionalValid')) {
    fieldValid = fieldValid && evalCondValid({
      ...options,
      cond: field.conditionalValid,
      ...(field.questionId && {valueKey: field.questionId})
    });
  }

  return fieldValid;
};

/**
 * [mapFieldChildren description]
 * @param  {[type]} options  [description]
 * @param  {[type]} iterator [description]
 * @return {[type]}          [description]
 */
export const mapFieldChildren = (options, iterator: Function) => {
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
      field.childFields.map((field, index) => iterator({
        ...options,
        ...parentOptions,
        field,
        index
      }))
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
      fieldOptions._genChildren.map((field, index) => iterator({
        ...options,
        ...parentOptions,
        field,
        index
      }))
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

const resolveFieldOptions = (options) => resolve('fieldOptions', getFieldOptions, options);
const resolveDisabled = (options) => resolve('disabled', isFieldDisabled, options);

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

import type {
  SectionValidOptions,
  FieldValidOptions,
  SectionFilledOptions,
  FieldFilledOptions
} from './validators.types';

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

  const {fields, parent} = options;
  let {errors} = options;

  const parentQuestionId = parent && parent.questionId; // TODO see if this can be removed

  fields.map((field) => getFieldErrors({...options, parentQuestionId, field}));

  return errors;
};

export const INVALID_MESSAGE = 'Invalid Field';
export const REQUIRED_MESSAGE = 'Required Field';

export const getFieldErrors = (options: FieldValidOptions) => {
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

  const {field, pathPrefix, messages, deep, fieldOptions} = options;
  let {errors} = options;

  const requiredMessage = has(field, 'requiredMessage') ? field.requiredMessage : messages.requiredMessage;
  const invalidMessage = has(field, 'invalidMessage') ? field.invalidMessage : messages.invalidMessage;

  // only parse valid field types
  if (!isNil(fieldOptions)) {
    if (isFieldVisible(options)) {
      const disabled = isFieldDisabled(options);
      const required = isFieldRequired({...options, disabled});

      if (has(fieldOptions, 'name')) {
        const path = mergePaths(pathPrefix, fieldOptions.name);

        if (required && !_isFieldFilled(options)) {
          set(errors, path, requiredMessage);
        } else if (!_isFieldValid(options)) {
          set(errors, path, invalidMessage);
        }
      } else {
        // if a field uses `names` then this is how to throw errors
        if (has(fieldOptions, '_genSectionErrors')) {
          fieldOptions._genSectionErrors(options);
        }
      }

      if (deep) {
        mapFieldChildren({...options, fieldOptions: null}, getFieldErrors);
      }
    }
  }
  return errors;
};

// ####################################################
// # Filled
// ####################################################

// options = {field, data, lookupTable, customFieldTypes, parentQuestionId}
export const isFieldFilled = (options: FieldFilledOptions) => {
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
        fieldFilled = fieldFilled && _isFieldFilled(options);
      }

      if (deep) {
        fieldFilled = fieldFilled && mapFieldChildren({...options, fieldOptions: null}, isFieldFilled)
          .reduce((result, fieldResult) => result && fieldResult, true);
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
  const {fields, parent} = options;

  const parentQuestionId = parent && parent.questionId; // TODO see if this can be removed

  return fields.reduce((valid, field) => valid && isFieldFilled({...options, parentQuestionId, field}), true);
};

// ####################################################
// # Empty
// ####################################################

export const isFieldEmpty = (options) => {
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
      fieldEmpty = _isFieldEmpty(options);

      if (deep) {
        fieldEmpty = fieldEmpty && mapFieldChildren({...options, fieldOptions: null}, isFieldEmpty)
          .reduce((result, fieldResult) => result && fieldResult, true);
      }
    }
  }

  return fieldEmpty;
};

// returns true if a section has any fields that have been filled out, false otherwise
export const isSectionEmpty = (options) => {
  options = {
    // fields
    // customFieldTypes
    // data
    deep: true,
    ...options
  };
  const {fields, parent} = options;

  const parentQuestionId = parent && parent.questionId; // TODO see if this can be removed

  return fields.reduce((empty, field) => empty && isFieldEmpty({...options, parentQuestionId, field}), true);
};
