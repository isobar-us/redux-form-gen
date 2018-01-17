import defaultFieldTypes from './defaultFieldTypes';
import isNil from 'lodash/isNil';
import defaultFieldOptions from './defaultFieldOptions';

const getFieldOptions = (options) => {
  const {field, customFieldTypes = {}} = options;
  const fieldTypes = {...defaultFieldTypes, ...customFieldTypes};
  // // for debugging
  // if (isNil(options.customFieldTypes)) {
  //   console.warn('getFieldOptions', options.customFieldTypes, new Error().stack);
  // }

  if (!field || !field.type) {
    console.error('Form Generator: you must specify a type for this field', field);
    return null;
  }

  const buildFieldOptions = fieldTypes[field.type];

  if (isNil(buildFieldOptions)) {
    console.error(
      `Form Generator: unknown field type "${field.type}". \nField:`,
      field,
      '\nKnown Types:',
      Object.keys(fieldTypes)
    );
    return null;
  }
  return {
    ...defaultFieldOptions,
    ...buildFieldOptions(options)
  };
};

export default getFieldOptions;
