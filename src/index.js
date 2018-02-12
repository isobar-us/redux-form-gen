// @flow
import FormGenerator from './FormGenerator';

import defaultFieldTypes, {getFieldOptions, genericFieldProps} from './defaultFieldTypes';
import GenericRequiredLabel from './defaultFieldTypes/components/GenericRequiredLabel';
import RequiredIndicator from './defaultFieldTypes/components/RequiredIndicator';
import injectGenProps from './injectGenProps';

import {
  isSectionEmpty,
  isSectionEmptyIterator,
  isSectionFilled,
  isSectionFilledIterator,
  getSectionErrors,
  getSectionErrorsIterator,
  isNilOrEmpty,
  getFieldPath,
  isFieldHidden,
  isFieldVisible,
  isFieldRequired,
  isFieldDisabled,
  isFieldEmpty,
  isFieldFilled,
  isFieldValid,
  mapFieldChildren
} from './validators';

import {getDefaultValues, buildLookupTable} from './utils';

import {consumeGenContext, GenContext} from './contextUtils';

import {evalCond, evalCondValid} from './conditionalUtils';

import GenField from './GenField';
import GenWrapper from './GenWrapper';

export type {FieldOptions, CustomFieldTypes} from './types';

export {
  FormGenerator,
  // defaultFieldTypes
  defaultFieldTypes,
  getFieldOptions,
  RequiredIndicator,
  GenericRequiredLabel,
  genericFieldProps,
  injectGenProps,
  // validators
  isSectionEmpty,
  isSectionEmptyIterator,
  isSectionFilled,
  isSectionFilledIterator,
  getSectionErrors,
  getSectionErrorsIterator,
  isNilOrEmpty,
  // validator utils
  getFieldPath,
  isFieldHidden,
  isFieldVisible,
  isFieldRequired,
  isFieldDisabled,
  isFieldEmpty,
  isFieldFilled,
  isFieldValid,
  mapFieldChildren,
  // utils
  getDefaultValues,
  buildLookupTable,
  // contextUtils
  consumeGenContext,
  GenContext,
  // conditionalUtils
  evalCond,
  evalCondValid,
  // internals
  GenField,
  GenWrapper
};
