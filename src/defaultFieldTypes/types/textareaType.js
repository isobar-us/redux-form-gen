// import {genericFieldProps} from '../defaultFieldTypes';
import TextareaField from '../components/TextareaField';

import textType from './textType';

export const textareaType = (options) => ({
  ...textType(options),
  component: TextareaField
});

export default textareaType;
