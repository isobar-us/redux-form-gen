import React from 'react';
import RequiredIndicator from '../components/RequiredIndicator';

const GroupLabel = ({field, required}) =>
  field.label ? (
    <label>
      <RequiredIndicator required={field.required || required} />
      {field.label}
    </label>
  ) : null;
export const groupType = ({field}) => ({
  _genComponent: GroupLabel
});

export default groupType;
