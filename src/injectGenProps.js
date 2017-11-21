import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {isSectionValid} from './validators';
import {buildLookupTable, getDefaultValues} from './utils';

const injectGenProps = (FormComponent) => {
  class InjectedGenProps extends Component {
    static propTypes = {
      fields: PropTypes.array.isRequired,
      customFieldTypes: PropTypes.object,
      data: PropTypes.object
    };

    state = {
      initialValues: {},
      lookupTable: {}
    };

    componentWillMount() {
      this.calculateState(this.props);
    }

    componentWillReceiveProps(nextProps) {
      if (
        this.props.fields !== nextProps.fields ||
        this.props.customFieldTypes !== nextProps.customFieldTypes ||
        this.props.initialValues !== nextProps.initialValues
      ) {
        this.calculateState(nextProps);
      }
    }

    calculateState = (props) => {
      const {initialValues = {}, fields, customFieldTypes = {}} = props;
      const lookupTable = buildLookupTable({fields, customFieldTypes});
      this.setState({
        lookupTable,
        initialValues: getDefaultValues({
          fields,
          lookupTable,
          data: initialValues,
          initialValues,
          customFieldTypes
        })
      });
    };

    validate = (formValues, props) => {
      let errors = {};
      const {fields, customFieldTypes} = this.props;
      // const isFilled = isSectionFilled({
      //   data: formValues,
      //   fields,
      //   customFieldTypes,
      //   lookupTable: this.state.lookupTable
      // });

      isSectionValid({
        fields,
        customFieldTypes,
        data: formValues,
        lookupTable: this.state.lookupTable,
        errors
      });
      // if (!isFilled) {
      //   errors._error = 'Missing Required Fields';
      // }
      return errors;
    };

    render() {
      return <FormComponent {...this.props} validate={this.validate} initialValues={this.state.initialValues} />;
    }
  }

  return InjectedGenProps;
};

export default injectGenProps;
