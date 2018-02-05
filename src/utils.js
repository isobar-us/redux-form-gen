// @flow
import set from 'lodash/set';
import has from 'lodash/has';
import isNil from 'lodash/isNil';
import {getFieldOptions} from './defaultFieldTypes';
import defaultsDeep from 'lodash/defaultsDeep';

import type {
  BuildLookupTableOptions,
  GetDefaultValuesOptions,
  GetDefaultValueOptions,
  HasDefaultValueOptions
} from './utils.types';

export const buildLookupTable = (options: BuildLookupTableOptions, table: Object = {}) => {
  const {fields, customFieldTypes} = options;
  if (fields) {
    fields.map((field) => {
      const fieldOptions = getFieldOptions({field, customFieldTypes});

      /* TODO use questionRef for unique ids?
         - this would allow for multiple fields to reference the same questionId
         - would need to transform questionRef => questionId when running evalCond using lookupTable?
      */

      if (!isNil(fieldOptions)) {
        // only parse valid field types
        if (field.questionId) {
          if (!isNil(table[field.questionId])) {
            // console.error('duplicate question id', field.questionId, field);
          } else {
            // if (Array.isArray(field.fields)) {
            //   set(table, field.questionId, newBuildLookupTable({
            //     ...options,
            //     fields: field.fields
            //   }));
            // } else {
            // console.info('setting field', field.questionId);
            set(table, field.questionId, field);
            // }
          }
        }

        // const table = {
        //   questionId: {
        //     item: {...field}
        //     childField: {
        //       subQuestionId: {
        //         ...field
        //       }
        //     }
        //   }
        // }

        // get(lookupTable, `${pathPrefix}.childField.${questionId}`)

        // trick to detect arrays?
        // if (fieldOptions._genFieldComponent === FieldArray && has(fieldOptions, '_genChildren')) {
        //   console.log('*&*&&*&*&*&*&&* caught array', field);
        // }

        // if (fieldOptions._genTraverseChildren) {
        //   const childFields = fieldOptions._genTraverseChildren({
        //     iterator: ({field}) => field
        //   });
        // }
        if (field.childFields) {
          buildLookupTable(
            {
              ...options,
              fields: field.childFields
            },
            table
          );
        }

        if (fieldOptions._genChildren) {
          buildLookupTable(
            {
              ...options,
              fields: fieldOptions._genChildren
            },
            table
          );
        }
      }
    });
  }
  return table;
};

export const getDefaultValueHelper = ({field, fieldOptions}: HasDefaultValueOptions) => {
  if (has(field, 'defaultValue')) {
    return {
      hasDefaultValue: true,
      defaultValue: field.defaultValue
    };
  } else if (has(fieldOptions, '_genDefaultValue')) {
    return {
      hasDefaultValue: true,
      defaultValue: fieldOptions._genDefaultValue
    };
  }
  return {
    hasDefaultValue: false,
    defaultValue: ''
  };
};

export const getDefaultValues = (options: GetDefaultValuesOptions) => {
  options = {
    // defaultValues: {},
    ...options,
    data: options.initialValues || {},
    defaultValues: defaultsDeep(options.defaultValues, options.initialValues)
  };

  const {fields} = options;
  let {defaultValues} = options;

  fields.map((field) => getDefaultValue({...options, field}));
  return defaultValues;
};

const getDefaultValue = (options: GetDefaultValueOptions) => {
  options = {
    // defaultValues: {},
    ...options,
    data: options.initialValues || {},
    defaultValues: defaultsDeep(options.defaultValues, options.initialValues)
  };

  // needs lookupTable and conditionalVisible support

  const {field, customFieldTypes, pathPrefix} = options;
  let {defaultValues} = options;

  const fieldOptions = getFieldOptions({field, customFieldTypes});
  if (!isNil(fieldOptions)) {
    // only parse valid field types

    if (!fieldOptions._genHidden) {
      // don't generate defaultValues for _genHidden fields.
      const fieldPath = has(field, 'questionId') ? mergePaths(pathPrefix, field.questionId) : pathPrefix;
      if (has(field, 'questionId') && !has(defaultValues, fieldPath)) {
        // might need isNilOrEmpty(get(defaultValues, fieldPath)) in the future
        const {hasDefaultValue, defaultValue} = getDefaultValueHelper({field, fieldOptions});
        if (hasDefaultValue) {
          set(defaultValues, fieldPath, defaultValue);
        }
      }
    }

    if (has(field, 'childFields') && Array.isArray(field.childFields)) {
      getDefaultValues({...options, fields: field.childFields});
    }

    if (fieldOptions._genTraverseChildren) {
      fieldOptions._genTraverseChildren({
        ...options,
        iterator: getDefaultValue
      });
    } else if (has(fieldOptions, '_genChildren') && Array.isArray(fieldOptions._genChildren)) {
      getDefaultValues({...options, fields: fieldOptions._genChildren});
    }
  }
  return defaultValues;
};

// used to merge existing and null/undefined paths together correctly
export const mergePaths = (...paths: Array<string>) => paths.filter((v) => v).join('.');

// export const traverseStructure = ({iterator, fields, parentField, values, fieldTypes}) => {
//   fields.map((field) => {
//     const fieldOptions = fieldTypes[field.type](field);
//
//   });
// };
