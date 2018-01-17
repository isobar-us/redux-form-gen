import * as React from 'react';
import type {ConditionalObject} from './conditionalUtils';

export type FieldType = {
  type: string,
  questionId?: string,
  childFields?: Array<FieldType>,
  conditionalVisible?: ConditionalObject,
  conditionalRequired?: ConditionalObject,
  conditionalDisabled?: ConditionalObject,
  conditionalValid?: ConditionalObject,
  requiredMessage?: string,
  invalidMessage?: string
};

export type FieldsType = Array<FieldType>;

export type FieldOptions = {
  _genFieldComponent?: React.ElementType,
  _genLabelComponent?: React.ElementType,
  _genComponent?: React.ElementType,
  _genChildren?: FieldsType,
  _genDefaultValue?: mixed,
  _genIsFilled?: Function,
  _genIsValid?: Function,
  _genSectionErrors?: Function,
  _genTraverseChildren?: Function,
  _genSkipChildren?: boolean,
  _genHidden?: boolean
};

export type CustomFieldTypes = {
  [key: string]: {({field: FieldType}): FieldOptions}
};
