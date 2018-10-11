// @flow
import get from 'lodash/get';
import has from 'lodash/has';
import hasIn from 'lodash/hasIn';
import includes from 'lodash/includes';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
import isNumber from 'lodash/isNumber';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import {isNilOrEmpty, isFieldFilled, isFieldValid} from './validators';

import type {FieldType} from './types';
import type {ConditionalOperators, EvalCondOptions, ConditionalObject} from './conditionalUtils.types';

/*
  Helpers
 */

// used for render lifecycle where we don't care about conditionalValid
export const isCondField = (field: FieldType) =>
  has(field, 'conditionalVisible') || has(field, 'conditionalRequired') || has(field, 'conditionalDisabled');

const getCondValueKey = ({cond, valueKey}) => (has(cond, 'questionId') ? cond.questionId : valueKey);

const getOperator = (options, key) => {
  const {customOperators} = options;
  const operators = {...ops, ...(customOperators || {})};
  const op = get(operators, key);
  if (isNil(op)) {
    console.error(`[FormGenerator] Unknown conditional operator "${key}". Condition:`, options.cond);
  }
  return op;
};

/*
  Conditional Operators
 */
const ops: ConditionalOperators = {
  equals: ({value, param}) => isEqual(value, param),
  // cond
  and: ({value, param, ...options}) =>
    param.reduce((and, subCond) => and && evalCond({...options, cond: subCond}), true),
  or: ({value, param, ...options}) => param.reduce((or, subCond) => or || evalCond({...options, cond: subCond}), false),
  not: ({value, param, ...options}) => !evalCond({...options, cond: param}),
  cond: ({value, param, ...options}) => evalCond({...options, cond: param}),
  compare: (options) => {
    const {value, param, data} = options;

    const conds = Object.keys(omit(param, ['questionId']));
    return conds.length > 0
      ? conds.reduce((result, key) => {
          // will AND all the cond props
          const operator = getOperator(options, key);
          if (isNil(operator)) {
            return true;
          }
          const remoteQuestionId = get(param, key);
          const compareParam = get(
            data,
            getCondValueKey({
              ...options,
              cond: {
                ...(remoteQuestionId && {questionId: remoteQuestionId})
              }
            })
          );
          return result && operator({...options, value, param: compareParam});
        }, true)
      : true;
  },
  // generator hooks
  filled: ({value, param, ...options}) => {
    let fieldFilled = true;
    if (has(options, 'lookupTable')) {
      const {lookupTable} = options;
      const field = get(lookupTable, getCondValueKey(options));
      if (!isNil(field)) {
        // if field is defined in the lookupTable, run isFieldFilled()
        fieldFilled = isFieldFilled({...options, field, fieldOptions: null});
      } else {
        // if field is not defined in the lookupTable, just fall back to isNilOrEmpty
        fieldFilled = !isNilOrEmpty(value);
      }
    } else {
      console.warn('[Form Generator] attempted to check `filled` without a lookupTable. Condition:', options.cond); // TODO finalise this warning
      fieldFilled = !isNilOrEmpty(value);
    }
    return param === true ? fieldFilled : !fieldFilled;
  },
  // TODO experimental operator to check if this or another field is valid...
  // valid: ({value, param, ...options}) => {
  //   const {cond, lookupTable} = options;
  //   let field = options.field;
  //
  //   if (has(cond, 'questionId')) {
  //     if (has(options, 'lookupTable')) {
  //       field = get(lookupTable, cond.questionId);
  //     } else {
  //       console.warn('[Form Generator] attempted to check `valid` without a lookupTable. Condition:', options.cond); // TODO finalise this warning
  //     }
  //   }
  //
  //   const fieldValid = isFieldValid({
  //     ...options,
  //     field,
  //     fieldOptions: null,
  //   });
  //   return param === true ? fieldValid : !fieldValid;
  // },
  // lodash
  includes: ({value, param}) => includes(value, param),
  // comparison
  greaterThan: ({value, param}) => {
    if (isNilOrEmpty(value)) {
      return false;
    }
    const parsedValue = isNumber(value) ? value : parseFloat(value);
    return parsedValue > param;
  },
  lessThan: ({value, param}) => {
    if (isNilOrEmpty(value)) {
      return false;
    }
    const parsedValue = isNumber(value) ? value : parseFloat(value);
    return parsedValue < param;
  },
  greaterThanEqual: ({value, param}) => {
    if (isNilOrEmpty(value)) {
      return false;
    }
    const parsedValue = isNumber(value) ? value : parseFloat(value);
    return parsedValue >= param;
  },
  lessThanEqual: ({value, param}) => {
    if (isNilOrEmpty(value)) {
      return false;
    }
    const parsedValue = isNumber(value) ? value : parseFloat(value);
    return parsedValue <= param;
  },
  // length
  length: ({value, param}) => (isNil(value) ? false : hasIn(value, 'length') ? value.length === param : true),
  minLength: ({value, param}) => (isNil(value) ? false : hasIn(value, 'length') ? value.length >= param : true),
  maxLength: ({value, param}) => (hasIn(value, 'length') ? value.length <= param : true),
  // regex
  pobox: ({value, param}) => (param && isString(value) ? /p.*o.* box/gi.test(value) : true),
  email: ({value, param}) => (param && isString(value) ? /\S+@\S+\.\S+/.test(value) : true),
  regex: ({value, param}) => (isString(value) ? RegExp(param).test(value) : true)
};

/*
  Conditional Operator Aliases
 */
ops.gt = ops.greaterThan;
ops.lt = ops.lessThan;
ops.min = ops.greaterThanEqual;
ops.max = ops.lessThanEqual;
ops.value = ops.equals;

const defaultElseHandler = (options) => ops.filled({...options, param: true});

const defaultValueKey = '_value';

export const evalCond = (options: EvalCondOptions) => {
  options = {
    elseHandler: defaultElseHandler,
    valueKey: defaultValueKey,
    ...options
  };
  const {cond, data, elseHandler} = options;

  // TODO add support for getFieldPath() when doing get(data, path) ?
  const value = get(data, getCondValueKey(options));
  const conds = Object.keys(omit(cond, 'questionId'));

  return conds.length > 0
    ? conds.reduce((result, key) => {
        // will AND all the cond props
        const operator = getOperator(options, key);
        if (isNil(operator)) {
          return true;
        }
        const param = get(cond, key);
        return result && operator({...options, value, param});
      }, true)
    : elseHandler({...options, value});
};

const condValidElseHandler = (options) => {
  const {cond, lookupTable} = options;
  let field = options.field;
  let fieldOptions = null;

  if (has(cond, 'questionId')) {
    if (has(options, 'lookupTable')) {
      field = get(lookupTable, cond.questionId);
      fieldOptions = null;
    } else {
      console.warn('[Form Generator] attempted to check `valid` without a lookupTable. Condition:', options.cond); // TODO finalise this warning
    }
  }

  return isFieldValid({
    ...options,
    field,
    fieldOptions
  });

  // TODO hook into experimental `valid` operator when ready
  // return ops.valid({...options, param: true});
};
export const evalCondValid = (options: EvalCondOptions) => {
  const {data} = options;
  const value = get(data, getCondValueKey(options));

  // can not validate if the field is empty, so return true
  if (isNil(value) || value === '') {
    return true;
  }

  return evalCond({
    elseHandler: condValidElseHandler,
    ...options
  });
};

export default {
  evalCond,
  evalCondValid
};

// TODO consider renaming to getCondDependentFieldNames or something similar
export const condDependentFields = (cond: ConditionalObject) => {
  if (has(cond, 'questionId')) {
    return [cond.questionId];
  } else if (has(cond, 'and') && Array.isArray(cond.and)) {
    return cond.and.reduce((a, subCond) => a.concat(condDependentFields(subCond)), []);
  } else if (has(cond, 'or') && Array.isArray(cond.or)) {
    return cond.or.reduce((a, subCond) => a.concat(condDependentFields(subCond)), []);
  } else if (has(cond, 'not') && cond.not) {
    return condDependentFields(cond.not);
  }
  return [];
};
