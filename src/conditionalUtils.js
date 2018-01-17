// @flow
import get from 'lodash/get';
import has from 'lodash/has';
import hasIn from 'lodash/hasIn';
import includes from 'lodash/includes';
import omit from 'lodash/omit';
import keys from 'lodash/keys';
import isEqual from 'lodash/isEqual';
import isNumber from 'lodash/isNumber';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import {isNilOrEmpty, getFieldErrors} from './validators';

import type {FieldType} from './types';

export const isCondField = (field: FieldType) =>
  has(field, 'conditionalVisible') || has(field, 'conditionalRequired') || has(field, 'conditionalDisabled');
export const omitCondProps = (field: FieldType) => omit(field, 'conditionalVisible');
import type {ConditionalOperators, EvalCondOptions, ConditionalObject} from './conditionalUtils.types';

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
  // lodash
  filled: ({value, param, ...options}) => {
    return param === true ? !isNilOrEmpty(value) : isNilOrEmpty(value); // TODO use lookupTable & customFieldTypes for _genIsFilled
    // TODO ops.filled should use isFieldFilled just like condValidElseHandler

    // return
    //   const {cond, data, lookupTable, customFieldTypes} = options;
    //   const field = get(lookupTable, cond.questionId);
    //   // if a dependent field doesn't have required:true, then it will always return true. we force it here.
    //   return getFieldErrors({customFieldTypes, field: {...field, required: true}, data, lookupTable});
  },
  includes: ({value, param}) => includes(value, param),
  // comparison
  greaterThan: ({value, param}) => {
    const nvalue = isNil(value) ? 0 : value; // treat nil as 0
    return isNumber(nvalue) ? nvalue > param : parseFloat(nvalue) > param;
  },
  lessThan: ({value, param}) => {
    const nvalue = isNil(value) ? 0 : value; // treat nil as 0
    return isNumber(nvalue) ? nvalue < param : parseFloat(nvalue) < param;
  },
  greaterThanEqual: ({value, param}) => {
    const nvalue = isNil(value) ? 0 : value; // treat nil as 0
    return isNumber(nvalue) ? nvalue >= param : parseFloat(nvalue) >= param;
  },
  lessThanEqual: ({value, param}) => {
    const nvalue = isNil(value) ? 0 : value; // treat nil as 0
    return isNumber(nvalue) ? nvalue <= param : parseFloat(nvalue) <= param;
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

const defaultElseHandler = ({value}) => !isNilOrEmpty(value); // TODO should point to ops.filled

const defaultValueKey = '_value';

export const evalCond = (opts: EvalCondOptions) => {
  const options = {elseHandler: defaultElseHandler, valueKey: defaultValueKey, ...opts};
  const {cond, data, elseHandler, reduxFormDeep, valueKey} = options;

  const value = has(cond, 'questionId')
    ? reduxFormDeep ? get(data, `${cond.questionId}.input.value`) : get(data, cond.questionId)
    : reduxFormDeep ? get(data, `${valueKey}.input.value`) : get(data, valueKey);
  const conds = keys(omit(cond, 'questionId'));
  return conds.length > 0
    ? conds.reduce((result, key) => {
        // will AND all the cond props
        const operator = get(ops, key);
        if (isNil(operator)) {
          throw new Error(`[FormGenerator] Unknown conditional operator "${key}"`);
        }
        const param = get(cond, key);
        return result && operator({...options, value, param});
      }, true)
    : elseHandler({...options, value});
};

const condValidElseHandler = (options) => {
  const {cond, data, lookupTable, customFieldTypes} = options;
  const field = get(lookupTable, cond.questionId);

  const fieldErrors = getFieldErrors({
    customFieldTypes,
    field: {
      ...field,
      required: true // if a dependent field doesn't have required:true, then it will always return true. we force it here.
    },
    data,
    lookupTable
  });

  return isNilOrEmpty(fieldErrors); // need to check if the errors object is empty. if empty, field is valid.
};
export const evalCondValid = (args: EvalCondOptions) =>
  evalCond({
    elseHandler: condValidElseHandler,
    ...args
  });

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
