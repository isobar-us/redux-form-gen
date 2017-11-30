// @flow
import * as React from 'react';

type Props = {
  children?: React.Node
};

const Frag = ({children}: Props) => children || null;

export default Frag;
