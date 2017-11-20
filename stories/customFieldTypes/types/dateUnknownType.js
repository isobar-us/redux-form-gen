import DateOrUnknownField from '../components/DateOrUnknownField';
import {genericMultiProps} from '../';
import {GenericRequiredLabel, isNilOrEmpty} from '../../../src';
import get from 'lodash/get';

export const dateUnknownType = ({field}) => ({
  ...genericMultiProps(field),
  _genLabelComponent: GenericRequiredLabel,
  _genIsFilled: ({data, field}) =>
    !isNilOrEmpty(get(data, field.fields.date.questionId)) || !isNilOrEmpty(get(data, field.fields.unknown.questionId)),
  component: DateOrUnknownField
});

export default dateUnknownType;
