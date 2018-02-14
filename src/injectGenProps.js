// @flow
import React, {Component} from 'react';
import type {ComponentType} from 'react';
import PropTypes from 'prop-types';
import {getSectionErrors} from './validators';
import {buildLookupTable, getDefaultValues} from './utils';
import type {Props, State} from './injectGenProps.types';

const injectGenProps = (FormComponent: ComponentType<*>) => {
  class InjectedGenProps extends Component<Props, State> {
    static propTypes = {
      fields: PropTypes.array.isRequired,
      customFieldTypes: PropTypes.object,
      customOperators: PropTypes.object,
      initialValues: PropTypes.object
    };

    state = {
      initialValues: {},
      lookupTable: {}
    };

    componentWillMount() {
      this.calculateState(this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
      if (
        this.props.fields !== nextProps.fields ||
        this.props.customFieldTypes !== nextProps.customFieldTypes ||
        this.props.customOperators !== nextProps.customOperators ||
        this.props.initialValues !== nextProps.initialValues
      ) {
        this.calculateState(nextProps);
      }
    }

    calculateState = (props: Props) => {
      const {initialValues = {}, fields, customFieldTypes, customOperators} = props;
      const lookupTable = buildLookupTable({fields, customFieldTypes});
      this.setState({
        lookupTable,
        initialValues: getDefaultValues({
          fields,
          lookupTable,
          initialValues,
          customFieldTypes,
          customOperators
        })
      });
    };

    validate = (formValues: Object, props: Props) => {
      let errors = {};
      const {fields, customFieldTypes, customOperators, validate} = this.props;

      if (validate) {
        errors = validate(formValues, props);
      }

      getSectionErrors({
        fields,
        customFieldTypes,
        customOperators,
        data: formValues,
        lookupTable: this.state.lookupTable,
        errors
      });

      return errors;
    };

    render() {
      return <FormComponent {...this.props} validate={this.validate} initialValues={this.state.initialValues} />;
    }
  }

  return InjectedGenProps;
};

export default injectGenProps;
