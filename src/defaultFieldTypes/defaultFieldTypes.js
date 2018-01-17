import {Field} from 'redux-form';
import GenericRequiredLabel from './components/GenericRequiredLabel';

/*

Special Props

_genFieldComponent: overrides default <Field ... />

_genFieldComponent || _genComponent
*/

// TODO maybe try moving the component props into a getComponentProps({field}) to prevent regen of function defs??

// const defaultIsFilled = ({data, field}) => !isNilOrEmpty(get(data, field.questionId));

// TODO get rid of _gen prefix, and keep components like FieldComponent and LabelComponent caps to use directly as react components?
export const genericFieldProps = ({field}) => ({
  _genFieldComponent: Field,
  // _genWrapperComponent: GenWrapper, // default
  // _genComponent: (props) => { // props are the props passed to GenField
  //   return (<span>Display Component Placeholder</span>);
  // },
  // _genIsValid: ({data}) => true, // override for special fields
  // _genIsFilled: defaultIsFilled, // only specify for `filled` operator override
  _genLabelComponent: GenericRequiredLabel,
  // _genChildren: field.childFields, // default to field.childFields, use this to override
  // _genDefaultValue: null // only use this for arrays and check fields

  // any props without _gen prefix get passed into _genFieldComponent
  name: field.questionId
});

import textType from './types/textType';
import textareaType from './types/textareaType';
import arrayType from './types/arrayType';
import arrayItemType from './types/arrayItemType';
import sectionType from './types/sectionType';
import groupType from './types/groupType';
import selectType from './types/selectType';
import radioType from './types/radioType';

export const defaultFieldTypes = {
  text: textType,
  textarea: textareaType,
  select: selectType,
  radio: radioType,
  group: groupType,
  section: sectionType,
  array: arrayType,
  arrayItem: arrayItemType
};

export default defaultFieldTypes;
