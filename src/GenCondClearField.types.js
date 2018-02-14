import type {FieldProps} from 'redux-form';
import type {FieldOptions, FieldType} from './types';

export type Props = {
  ...FieldProps,
  condClearProps: {
    fieldOptions: FieldOptions,
    field: FieldType,
    visible: boolean
  }
};
