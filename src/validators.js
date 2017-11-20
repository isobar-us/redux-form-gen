import isNil from 'lodash/isNil';
import trim from 'lodash/trim';
import isEmpty from 'lodash/isEmpty';

import get from 'lodash/get';
import set from 'lodash/set';
import has from 'lodash/has';
import hasIn from 'lodash/hasIn';
import keys from 'lodash/keys';
import omit from 'lodash/omit';
import values from 'lodash/values';
import isNumber from 'lodash/isNumber';
import isEqual from 'lodash/isEqual';
import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';
// import merge from 'lodash/merge';

import {evalCond, evalCondValid, evalCondRequired} from './conditionalUtils';
import {getFieldOptions} from './defaultFieldTypes';
import {mergePaths} from './utils';

const ops = {
  greaterThan: (v, p) => (isNumber(v) ? v > p : parseFloat(v) > p),
  lessThan: (v, p) => (isNumber(v) ? v < p : parseFloat(v) < p),
  min: (v, p) => (isNumber(v) ? v >= p : parseFloat(v) >= p),
  max: (v, p) => (isNumber(v) ? v <= p : parseFloat(v) <= p),
  greaterThanEqual: (v, p) => (isNumber(v) ? v >= p : parseFloat(v) >= p),
  lessThanEqual: (v, p) => (isNumber(v) ? v <= p : parseFloat(v) <= p),
  length: (v, p) => (hasIn(v, 'length') ? v.length === p : true),
  minLength: (v, p) => (hasIn(v, 'length') ? v.length >= p : true),
  maxLength: (v, p) => (hasIn(v, 'length') ? v.length <= p : true),
  equals: (v, p) => isEqual(v, p),
  pobox: (v, p) => (p ? /p.*o.* box/gi.test(v) : true),
  email: (v, p) => (p ? /\S+@\S+\.\S+/.test(v) : true),
  regex: (v, p) => RegExp(p).test(v)
  // dateBeforeFuture: (v, p) => moment(v).startOf('day').isBefore(moment().startOf('day').add(...p))
};

ops.phone = (v, p) => (p ? ops.length(v, 10) : true);

export const isNilOrEmpty = (value) =>
  isNil(value) || isEmpty(trim(value)) || ((isPlainObject(value) || isArray(value)) && isEmpty(value));

// ####################################################
// # Valid
// ####################################################

export const isSectionValid = (options) => {
  options = {
    // fields
    // customFieldTypes
    // data
    errors: {},
    ...options
  };

  const {fields, parent, data} = options;
  let {errors} = options;

  const _parentValue = parent && get(data, parent.questionId);

  fields.map((field) => isFieldValid({...options, _parentValue, field}));
  return errors;
};

export const INVALID_MESSAGE = 'Invalid Field';
export const REQUIRED_MESSAGE = 'Required Field';

export const isFieldValid = (options) => {
  options = {
    // field
    // customFieldTypes
    // data
    errors: {},
    ...options
  };

  const {field, customFieldTypes, pathPrefix, data, _parentValue} = options;
  let {errors} = options;

  const fieldOptions = getFieldOptions({field, customFieldTypes});

  // only parse valid field types
  if (!isNil(fieldOptions)) {
    const visible = has(fieldOptions, '_genHidden') ? !fieldOptions._genHidden : true;

    if (has(field, 'conditionalVisible')) {
      if (evalCond({cond: field.conditionalVisible, data: {...data, _parentValue}})) {
        isFieldValid({...options, field: omit(field, 'conditionalVisible')});
      }
    } else if (visible) {
      const disabled =
        (has(field, 'disabled') && field.disabled) ||
        (has(fieldOptions, 'disabled') && fieldOptions.disabled) ||
        (has(field, 'conditionalDisabled') &&
          evalCond({
            ...options,
            cond: field.conditionalDisabled,
            data: {...data, _parentValue}
          }));
      const required =
        (!disabled && (has(field, 'required') && field.required)) ||
        (has(field, 'conditionalRequired') &&
          evalCondRequired({
            ...options,
            cond: field.conditionalRequired,
            data: {...data, _parentValue}
          }));

      if (has(fieldOptions, 'name')) {
        const path = mergePaths(pathPrefix, fieldOptions.name);
        const value = get(data, path);

        if (
          required === true &&
          (has(fieldOptions, '_genIsFilled') ? !fieldOptions._genIsFilled(options) : isNilOrEmpty(value))
        ) {
          set(errors, path, REQUIRED_MESSAGE);
        } else if (has(fieldOptions, '_genIsValid') && !fieldOptions._genIsValid(options)) {
          set(errors, path, INVALID_MESSAGE);
        } else if (has(fieldOptions, '_genSectionErrors')) {
          fieldOptions._genSectionErrors(options);
        } else if (
          has(field, 'conditionalValid') &&
          !evalCondValid({...options, cond: field.conditionalValid, data: {...data, _parentValue}})
        ) {
          set(errors, path, INVALID_MESSAGE);
        } else {
          keys(ops).map((op) => {
            if (has(field, op)) {
              const operator = ops[op];
              if (isNil(operator)) {
                throw new Error(`[FormGenerator] Unknown validation operator "${op}"`);
              }
              if (!operator(value, field[op])) {
                set(errors, path, INVALID_MESSAGE);
              }
            }
          });
        }
      } else {
        // // if there is no questionId, and the is _genIsValid,
        // // then expect the result of _genIsValid to be an errors object, and merge the result
        // // this is needed to support multifields
        // if (has(fieldOptions, '_genIsValid')) {
        //   const fieldErrors = fieldOptions._genIsValid({
        //     ...options,
        //     messages: {
        //       invalid: INVALID_MESSAGE,
        //       required: REQUIRED_MESSAGE
        //     }
        //   });
        //   if (!isEmpty(fieldErrors)) {
        //     merge(errors, fieldErrors);
        //   }
        // }
      }
      if (has(field, 'childFields') && Array.isArray(field.childFields)) {
        isSectionValid({...options, parent: field, fields: field.childFields});
      }

      if (fieldOptions._genTraverseChildren) {
        fieldOptions._genTraverseChildren({
          ...options,
          iterator: isFieldValid
        });
      } else if (has(fieldOptions, '_genChildren') && Array.isArray(fieldOptions._genChildren)) {
        isSectionValid({...options, parent: field, fields: fieldOptions._genChildren});
      }
    }
  }
  return errors;
};

// ####################################################
// # Filled
// ####################################################

export const isFieldFilled = (options) => {
  const {field, data, lookupTable, _parentValue} = options;
  let fieldFilled = true;

  if (has(field, 'conditionalVisible')) {
    if (evalCond({cond: field.conditionalVisible, data: {...data, _parentValue}})) {
      fieldFilled =
        fieldFilled &&
        isFieldFilled({...options, field: omit(field, 'conditionalVisible'), data, lookupTable, _parentValue});
    }
  } else {
    const required =
      (has(field, 'required') && field.required) ||
      (has(field, 'conditionalRequired') &&
        evalCondRequired({
          cond: field.conditionalRequired,
          data: {...data, _parentValue}
        }));

    const fieldOptions = getFieldOptions(options);

    let conditionalValid = field.conditionalValid || {};

    // TODO: move away from this pattern, try out the _genIsFilled pattern
    if (required) {
      if (has(fieldOptions, '_genIsFilled')) {
        fieldFilled = fieldFilled && fieldOptions._genIsFilled({...options});
      } else {
        let conditionalRequiredValid = {
          questionId: field.questionId,
          filled: true
        };
        fieldFilled =
          fieldFilled &&
          evalCondValid({
            cond: conditionalRequiredValid,
            data: {...data, _parentValue},
            lookupTable,
            customFieldTypes: options.customFieldTypes
          });
      }
    }

    // console.log('hit standard', field, conditionalValid);

    if (!isEmpty(conditionalValid)) {
      fieldFilled =
        fieldFilled &&
        evalCondValid({
          cond: conditionalValid,
          data: {...data, _parentValue},
          lookupTable,
          customFieldTypes: options.customFieldTypes
        });
    }

    // console.log('is field filled', fieldFilled);

    // if (required && has(field, 'conditionalValid')) {
    //   fieldFilled = fieldFilled && evalConditionalValid(field.conditionalValid, {...data, _parentValue}, lookupTable, {shallow: true});
    // }

    // TODO: not sure if we need this exactly, might push into _genOperators.filled ? similar to _genOperators.valid? or is that just condValid?
    // if (has(fieldOptions, '_genIsFilled')) {
    //   fieldFilled = fieldFilled && fieldOptions._genIsFilled({...options, required});
    // }

    if (has(fieldOptions, '_genTraverseChildren')) {
      fieldFilled =
        fieldFilled &&
        fieldOptions
          ._genTraverseChildren({
            ...options,
            iterator: ({field, ...iteratorOptions}) => isFieldFilled({field, ...iteratorOptions})
          })
          .reduce((result, fieldResult) => result && fieldResult, true);
    } else if (has(fieldOptions, '_genChildren') && Array.isArray(fieldOptions._genChildren)) {
      fieldFilled = fieldFilled && isSectionFilled({...options, fields: fieldOptions._genChildren, parent: field});
    }

    // trick to detect arrays?
    // if (fieldOptions._genFieldComponent === FieldArray && has(fieldOptions, '_genChildren')) {
    //   console.log('*&*&&*&*&*&*&&* caught array', field);
    // }

    if (has(field, 'childFields') && Array.isArray(field.childFields)) {
      fieldFilled = fieldFilled && isSectionFilled({...options, fields: field.childFields, parent: field});
    }

    // if (has(field, 'childFields') && Array.isArray(field.childFields)) {
    //   fieldFilled = fieldFilled && isSectionFilled({data, fields: field.childFields, lookupTable, parent: field});
    // }
  }
  return fieldFilled;
};

// returns true if a section has any fields that have been filled out, false otherwise
// lookupTable is required if you have fields that are conditionalValid.
export const isSectionFilled = ({data, fields, lookupTable = {}, parent, ...options}) => {
  const _parentValue = parent && get(data, parent.questionId);
  return fields.reduce((valid, field) => {
    return valid && isFieldFilled({...options, field, data, lookupTable, _parentValue});
  }, true);
};

// ####################################################
// # Empty
// ####################################################

// TODO needs rewrite

// returns true if a section has any fields that have been filled out, false otherwise
export const isSectionEmpty = (data, fields) => {
  return fields.reduce((empty, field) => {
    let fieldEmpty = true;

    fieldEmpty =
      has(field, 'questionId') && has(data, field.questionId) ? isNilOrEmpty(get(data, field.questionId)) : true;
    if (field.childFields) {
      fieldEmpty = fieldEmpty && isSectionEmpty(data, field.childFields);
    } else if (field.columns) {
      fieldEmpty = fieldEmpty && field.columns.reduce((colEmpty, col) => colEmpty && isSectionEmpty(data, col), true);
    } else if (field.type === 'sectionArray' || field.type === 'array') {
      // TODO detect arrays with _genTraverseChildren instead
      let sectionArray = get(data, field.questionId);
      if (Array.isArray(sectionArray)) {
        fieldEmpty =
          fieldEmpty &&
          sectionArray.reduce(
            (sectionValid, sectionValues) => sectionValid && isSectionEmpty({...data, ...sectionValues}, field.fields),
            true
          );
      }
    } else if (field.fields) {
      if (!Array.isArray(field.fields)) {
        fieldEmpty = fieldEmpty && isSectionEmpty(data, values(field.fields));
      }
    }

    return empty && fieldEmpty;
  }, true);
};
