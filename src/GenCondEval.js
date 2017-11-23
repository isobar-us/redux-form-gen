import React, {Component} from 'react';
import {consumeReduxFormContext, consumeGenContext} from './contextUtils';
import {connect} from 'react-redux';
import {getFormValues} from 'redux-form';
import get from 'lodash/get';
import set from 'lodash/set';
import GenField from './GenField';
import omit from 'lodash/omit';
import {evalCond} from './conditionalUtils';

// TODO move this logic into GenField connect() ?
class GenCondEval extends Component {
  render() {
    const {field, parentQuestionId, parentVisible, path, gen: {customFieldTypes}, formValues: data} = this.props;
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
                  // reduxFormDeep: true,
                  ...(parentQuestionId && {valueKey: parentQuestionId})
                })
              : true),
          required: field.conditionalRequired
            ? evalCond({
                cond: field.conditionalRequired,
                data,
                customFieldTypes,
                // reduxFormDeep: true,
                ...(parentQuestionId && {valueKey: parentQuestionId})
              })
            : false,
          disabled: field.conditionalDisabled
            ? evalCond({
                cond: field.conditionalDisabled,
                data,
                customFieldTypes,
                // reduxFormDeep: true,
                ...(parentQuestionId && {valueKey: parentQuestionId})
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
      const formName = _reduxForm.form;
      const formValues = getFormValues(formName)(state);
      return {
        formValues: names.reduce((values, name) => set(values, name, get(formValues, name)), {})
      };
    })(GenCondEval)
  )
);
