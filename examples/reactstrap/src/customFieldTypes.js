import React from 'react';
import {FormGroup, Label, Input} from 'reactstrap';
import {RequiredIndicator, genericFieldProps} from '@isobar-us/redux-form-gen';
import FieldMetaMessages from '@isobar-us/redux-form-gen/lib/defaultFieldTypes/components/FieldMetaMessages';

const RequiredLabel = ({field, required}) => (
  <Label>
    <RequiredIndicator required={(field.required || required) && field.label} />
    {field.label}
  </Label>
);

const InputField = ({input, meta}) => (
  <FormGroup>
    <Input {...input} valid={meta.valid} />
    <FieldMetaMessages {...meta} />
  </FormGroup>
);

const customFieldTypes = {
  text: ({field}) => ({
    ...genericFieldProps({field}),
    _genLabelComponent: RequiredLabel,
    component: InputField
  })
};

export default customFieldTypes;
