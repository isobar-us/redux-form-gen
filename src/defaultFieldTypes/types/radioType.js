import RadioField from '../components/RadioField';
import {genericFieldProps} from '../defaultFieldTypes';
import has from 'lodash/has';
import pick from 'lodash/pick';

export const radioType = ({field}) => ({
  ...genericFieldProps({field}),
  component: RadioField,
  ...(has(field, 'options')
    ? {
        values: field.options
      }
    : {}),
  ...pick(field, 'display')
});

export default radioType;
