// @flow
import React, {Component} from 'react';
import {consumeReduxFormContext, consumeGenContext} from './contextUtils';
import {connect} from 'react-redux';
import {getFormValues} from 'redux-form';
import get from 'lodash/get';
import set from 'lodash/set';
import GenField from './GenField';
import omit from 'lodash/omit';
import {evalCond} from './conditionalUtils';
import {getGenContextOptions} from './utils';

import {Props} from './GenCondEval.types';

// TODO move this logic into GenField connect() ?
class GenCondEval extends Component<Props> {
  render() {
    const {field, parentQuestionId, parentVisible, path, data} = this.props;

    const options = {
      data,
      ...getGenContextOptions(this.props.gen),
      ...(parentQuestionId && {valueKey: parentQuestionId})
    };

    return (
      <GenField
        {...{
          path,
          field: omit(field, 'conditionalVisible', 'conditionalRequired', 'conditionalDisabled'),
          visible:
            parentVisible &&
            (field.conditionalVisible
              ? evalCond({
                  ...options,
                  cond: field.conditionalVisible
                })
              : true),
          required: field.conditionalRequired
            ? evalCond({
                ...options,
                cond: field.conditionalRequired
              })
            : false,
          disabled: field.conditionalDisabled
            ? evalCond({
                ...options,
                cond: field.conditionalDisabled
              })
            : false
        }}
      />
    );
  }
}

export default consumeReduxFormContext(
  consumeGenContext(
    connect((state, {_reduxForm, names}) => {
      const {form, sectionPrefix} = _reduxForm;
      const formValues = getFormValues(form)(state);
      const sectionPrefixValues = sectionPrefix ? get(formValues, sectionPrefix) : {};

      // merge section data scope with the global scope
      const mergedData = {...formValues, ...sectionPrefixValues};

      return {
        data: names.reduce((values, name) => set(values, name, get(mergedData, name)), {})
      };
    })(GenCondEval)
  )
);
