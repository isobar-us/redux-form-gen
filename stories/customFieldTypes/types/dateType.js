import {genericFieldProps} from '../../../src';
import DateField from '../components/DateField';

const dateType = ({field}) => ({
  ...genericFieldProps({field}),
  component: DateField
});

export default dateType;
