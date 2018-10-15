import React from 'react';
import GenField from '../../GenField';
import {FormSection} from 'redux-form';
import Frag from '../../Frag';

export const SectionLabel = (props) => {
  const {field, path} = props;
  const label = field.label ? <div className='generated-form__header'>{field.label}</div> : null;

  const Wrapper = field.questionId ? FormSection : Frag;

  return (
    <Frag>
      {label}
      <Wrapper name={field.questionId}>
        {field.childFields &&
          field.childFields.map((field, index) => (
            <GenField key={index} field={{...field}} path={`${path}.childFields[${index}]`} />
          ))}
      </Wrapper>
    </Frag>
  );
};

export const sectionType = ({field}) => ({
  _genComponent: SectionLabel,
  _genSkipChildren: true
});

export default sectionType;
