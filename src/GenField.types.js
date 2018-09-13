import type {FieldType} from './types';
import type {GenContextProps} from './contextUtils.types';

export type Props = {
  field: FieldType,
  gen: GenContextProps,
  path: string,
  disabled?: boolean,
  visible?: boolean,
  parentPath?: string
};
