import React from 'react';

const DividerComponent = () => <hr />;

export const dividerType = ({field}) => ({
  _genComponent: DividerComponent
});

export default dividerType;
