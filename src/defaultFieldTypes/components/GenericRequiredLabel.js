import React from 'react';
import RequiredIndicator from './RequiredIndicator';

const GenericRequiredLabel = ({field, required}) => (
  <label>
    <RequiredIndicator required={(field.required || required) && field.label} />
    {field.label}
  </label>
);

export default GenericRequiredLabel;
