import {Props as GenFieldProps} from './GenField.types';
import * as React from 'react';

export type Props = {
  ...GenFieldProps,
  labelComponent: React.Node,
  fieldComponent: React.Node,
  component: React.Node
};
