import type {Props as FormGeneratorProps} from './FormGenerator.types';

export type GenContextProps = {
  getCachedValue: Function,
  setCachedValue: Function
} & FormGeneratorProps;
