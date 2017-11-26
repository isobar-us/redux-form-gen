import {ElementType} from 'react';
import type {ConditionalObject} from './conditionalUtils';

export type FieldType = {
  type: string,
  questionId?: ?string,
  childFields?: Array<FieldType>,
  conditionalVisible: ConditionalObject
};

export type FieldsType = Array<FieldType>;

export type FieldOptions = {
  _genFieldComponent?: ElementType,
  _genLabelComponent?: ElementType,
  _genComponent?: ElementType,
  _genChildren?: FieldsType,
  _genDefaultValue?: mixed,
  _genIsFilled: Function,
  _genIsValid: Function,
  _genSectionErrors: Function,
  _genTraverseChildren: Function,
  _genSkipChildren: boolean,
  _genHidden: boolean
};

export type CustomFieldTypes = {
  [key: string]: {({field: FieldType}): FieldOptions}
};
