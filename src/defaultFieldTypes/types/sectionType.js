import React from 'react';

export const SectionLabel = ({field}) =>
  field.label ? <div className='generated-form__header'>{field.label}</div> : null;
export const sectionType = ({field}) => ({
  _genComponent: SectionLabel
});

export default sectionType;
