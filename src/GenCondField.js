// import PropTypes from 'prop-types';
import React, {Component} from 'react';
import omit from 'lodash/omit';

import {consumeGenContext} from './contextUtils';
import {evalCond} from './conditionalUtils';
import GenField from './GenField';

class GenCondField extends Component {
  render() {
    const {field, parentQuestionId, parentVisible, path, gen: {customFieldTypes}, ...data} = this.props;
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
                  data,
                  customFieldTypes,
                  reduxFormDeep: true,
                  ...(parentQuestionId && {valueKey: parentQuestionId})
                })
              : true),
          required: field.conditionalRequired
            ? evalCond({
                cond: field.conditionalRequired,
                data,
                customFieldTypes,
                reduxFormDeep: true,
                ...(parentQuestionId && {valueKey: parentQuestionId})
              })
            : false,
          disabled: field.conditionalDisabled
            ? evalCond({
                cond: field.conditionalDisabled,
                data,
                customFieldTypes,
                reduxFormDeep: true,
                ...(parentQuestionId && {valueKey: parentQuestionId})
              })
            : false
        }}
      />
    );
  }
}

export default consumeGenContext(GenCondField);
