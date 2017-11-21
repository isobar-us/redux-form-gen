import React, {Component} from 'react';

import {consumeGenContext} from './contextUtils';
import GenField from './GenField';

class GenChildField extends Component {
  render() {
    const {field, visible, path, input: {value: _parentValue}} = this.props;
    return <GenField {...{field, _parentValue, visible, path}} />;
  }
}

export default consumeGenContext(GenChildField);
