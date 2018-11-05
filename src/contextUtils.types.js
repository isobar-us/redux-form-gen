import type {Props as FormGeneratorProps} from './FormGenerator.types';

export type GenContextProps = {
  ...FormGeneratorProps,
  getCachedValue: Function,
  setCachedValue: Function
};

export type ReduxFormContextType = {
  _reduxForm: mixed
};
