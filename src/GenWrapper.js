// @flow
import React, {Component} from 'react';
import has from 'lodash/has';
import cn from 'classnames';
import {consumeGenContext} from './contextUtils';
import Fragment from 'react-dot-fragment';

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
      <Fragment>
        {labelComponent && labelComponent}
        {component && component}
      </Fragment>
    );
  }
}

export default consumeGenContext(GenWrapper);
