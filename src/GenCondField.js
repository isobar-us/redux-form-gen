// import PropTypes from 'prop-types';
import React, {Component} from 'react';
import omit from 'lodash/omit';

import {consumeGenContext} from './contextUtils';
import {evalCond, evalCondRequired} from './conditionalUtils';
import GenField from './GenField';

class GenCondField extends Component {
  render() {
    const {field, _parentValue, parentVisible, path, gen: {customFieldTypes}, ...fields} = this.props;
    return (
      <GenField
        {...{
          path,
          field: omit(field, 'conditionalVisible', 'conditionalRequired', 'conditionalDisabled'),
          visible:
            parentVisible &&
            (field.conditionalVisible
              ? evalCond({
                  cond: field.conditionalVisible,
                  data: {
                    ...fields,
                    _parentValue
                  },
                  customFieldTypes,
                  reduxFormDeep: true
                })
              : true),
          required: field.conditionalRequired
            ? evalCondRequired({
                cond: field.conditionalRequired,
                data: {
                  ...fields,
                  _parentValue
                },
                customFieldTypes,
                reduxFormDeep: true
              })
            : false,
          disabled: field.conditionalDisabled
            ? evalCond({
                cond: field.conditionalDisabled,
                data: {
                  ...fields,
                  _parentValue
                },
                customFieldTypes,
                reduxFormDeep: true
              })
            : false
        }}
      />
    );
  }
}

export default consumeGenContext(GenCondField);
