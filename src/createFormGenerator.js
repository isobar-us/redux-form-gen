import React from 'react';
import {
  FormGenerator,
  getDefaultValues,
  getFieldOptions,
  buildLookupTable,
  getSectionErrors,
  evalCond,
  injectGenProps,
  isFieldFilled,
  isFieldEmpty,
  isFieldVisible,
  mapFieldChildren,
  isNilOrEmpty
} from '@isobar-us/redux-form-gen';

const mergeCustomOptions = (customOptions, options) => ({
  ...options,
  customFieldTypes: {...customOptions.customFieldTypes, ...(options.customFieldTypes || {})},
  customOperators: {...customOptions.customOperators, ...(options.customOperators || {})}
});

const wrapComponent = (Wrapped, customOptions) => {
  const ComponentWrapper = (options) => <Wrapped {...mergeCustomOptions(customOptions, options)} />;

  return ComponentWrapper;
};

const wrapFunction = (wrapped, customOptions) => {
  return (options, ...args) => wrapped(mergeCustomOptions(customOptions, options), ...args);
};

const createFormGenerator = (customOptions) => {
  return {
    // functions
    getDefaultValues: wrapFunction(getDefaultValues, customOptions),
    getFieldOptions: wrapFunction(getFieldOptions, customOptions),
    buildLookupTable: wrapFunction(buildLookupTable, customOptions),
    getSectionErrors: wrapFunction(getSectionErrors, customOptions),
    evalCond: wrapFunction(evalCond, customOptions),
    isFieldFilled: wrapFunction(isFieldFilled, customOptions),
    isFieldEmpty: wrapFunction(isFieldEmpty, customOptions),
    isFieldVisible: wrapFunction(isFieldVisible, customOptions),
    mapFieldChildren: wrapFunction(mapFieldChildren, customOptions),
    // components
    FormGenerator: wrapComponent(FormGenerator, customOptions),
    injectGenProps: (Form) => {
      const GenForm = injectGenProps(Form);
      const InjectedGenProps = (options) => <GenForm {...mergeCustomOptions(options)} />;
      return InjectedGenProps;
    },
    // non-wrapped
    isNilOrEmpty
  };
};

export default createFormGenerator;
