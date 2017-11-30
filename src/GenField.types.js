import type {FieldType} from './types';
import type {GenContextProps} from './contextUtils.type';

export type Props = {
  field: FieldType,
  gen: GenContextProps,
  path: string,
  disabled?: boolean,
  visible?: boolean,
  parentQuestionId?: string
};
