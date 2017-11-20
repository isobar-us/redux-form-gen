import {genericFieldProps} from '../defaultFieldTypes';
import TextField from '../components/TextField';

export const textType = ({field}) => ({
  ...genericFieldProps({field}),
  component: TextField
});

export default textType;
