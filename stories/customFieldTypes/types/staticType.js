import React from 'react';
import {genericFieldProps} from '../../../src';

const StaticLabel = ({field}) => <label>{field.label}</label>;
const StaticText = ({field: {text}}) => <span>{text}</span>;

export const staticType = ({field}) => ({
  ...genericFieldProps({field}),
  _genFieldComponent: null,
  _genLabelComponent: StaticLabel,
  _genComponent: StaticText,
  values: field.options
});

export default staticType;
