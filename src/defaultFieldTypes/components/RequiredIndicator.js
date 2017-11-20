import React from 'react';

const RequiredIndicator = ({required}) => (required ? <span className='required-field'>*</span> : null);

export default RequiredIndicator;
