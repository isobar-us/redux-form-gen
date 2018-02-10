// @flow
import set from 'lodash/set';
import has from 'lodash/has';
import isNil from 'lodash/isNil';
import {getFieldOptions} from './defaultFieldTypes';
import defaultsDeep from 'lodash/defaultsDeep';
import {isFieldHidden, getFieldPath, resolveFieldOptions, mapFieldChildren} from './validators';

import type {BuildLookupTableOptions, GetDefaultValuesOptions, GetDefaultValueOptions} from './utils.types';

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

export const hasFieldDefaultValue = (options: GetDefaultValueOptions) => {
  const {field} = options;
  const fieldOptions = resolveFieldOptions(options);
  return has(field, 'defaultValue') || has(fieldOptions, '_genDefaultValue');
};

export const getFieldDefaultValue = (options: GetDefaultValueOptions) => {
  const {field} = options;
  const fieldOptions = resolveFieldOptions(options);
  return has(field, 'defaultValue')
    ? field.defaultValue
    : has(fieldOptions, '_genDefaultValue') ? fieldOptions._genDefaultValue : '';
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
    defaultValues: defaultsDeep(options.defaultValues, options.initialValues),
    fieldOptions: resolveFieldOptions(options)
  };

  // TODO does this need conditionalVisible (with lookupTable) support?
  // should a field still generate a defaultValue even if not visible? I think so...
  // so most likely don't need that

  const {field, fieldOptions} = options;
  let {defaultValues} = options;

  if (!isNil(fieldOptions)) {
    // only parse valid field types

    if (!isFieldHidden(options)) {
      // don't generate defaultValues for _genHidden fields.
      const fieldPath = getFieldPath(options);
      if (has(field, 'questionId') && !has(defaultValues, fieldPath)) {
        // might need isNilOrEmpty(get(defaultValues, fieldPath)) in the future
        if (hasFieldDefaultValue(options)) {
          set(defaultValues, fieldPath, getFieldDefaultValue(options));
        }
      }
    }

    mapFieldChildren({...options, fieldOptions: null}, getDefaultValue);
  }
  return defaultValues;
};

// used to merge existing and null/undefined paths together correctly
export const mergePaths = (...paths: Array<string>) => paths.filter((v) => v).join('.');
