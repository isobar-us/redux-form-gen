import {genericFieldProps} from '../defaultFieldTypes';
import pick from 'lodash/pick';
import SelectField from '../components/SelectField';

export const selectType = ({field}) => ({
  ...genericFieldProps({field}),
  component: SelectField,
  ...pick(field, 'options')
});

export default selectType;
