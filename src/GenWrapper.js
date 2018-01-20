// @flow
import React, {Component} from 'react';
import has from 'lodash/has';
import cn from 'classnames';
import {consumeGenContext} from './contextUtils';
import Frag from './Frag';

import type {Props} from './GenWrapper.types.js';

class GenWrapper extends Component<Props> {
  render() {
    const {field, gen, fieldComponent, labelComponent, component} = this.props;
    const display = has(field, 'display') ? field.display : gen.display;
    const orientation = {
      'wrapper--stacked': display === 'stacked',
      'wrapper--inline': display === 'inline'
    };

    return fieldComponent ? (
      labelComponent ? (
        <div className={cn('wrapper', orientation)}>
          {labelComponent}
          {fieldComponent}
        </div>
      ) : (
        fieldComponent
      )
    ) : labelComponent && component ? (
      <div className={cn('wrapper', orientation)}>
        {labelComponent}
        {component}
      </div>
    ) : (
      // if either the label or component is missing, don't treat as an input-container. just render what you have.
      <Frag>
        {labelComponent && labelComponent}
        {component && component}
      </Frag>
    );
  }
}

export default consumeGenContext(GenWrapper);
