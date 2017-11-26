// @flow
// import type {ChildrenArray} from 'react';

type Props = {
  children?: any // ChildrenArray<*>
};

const Frag = ({children}: Props) => children || null;

export default Frag;
