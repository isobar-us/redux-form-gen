// @flow
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {consumeReduxFormContext, GenContext} from './contextUtils';
import {buildLookupTable} from './utils';

import GenField from './GenField';

import omit from 'lodash/omit';
import set from 'lodash/set';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';

import type {Props, State} from './FormGenerator.types';

class FormGenerator extends Component<Props, State> {
  static propTypes = {
    fields: PropTypes.array.isRequired, // an array of field objects
    customQuestionProps: PropTypes.object, // object key = questionId, value = an object of props for the specified questionId's
    visibleDepth: PropTypes.string, // dot-notation string, used to rendering fields after this path (startsWith)
    customFieldTypes: PropTypes.objectOf(PropTypes.func),
    customOperators: PropTypes.objectOf(PropTypes.func),
    display: PropTypes.oneOf(['stacked', 'inline']),
    disabled: PropTypes.bool // if true, disables all fields in the form
  };

  static defaultProps = {
    display: 'stacked'
  };

  state = {
    cachedValues: {} // TODO find a better way to do value caching for hidden fields
  };

  setCachedValue = (questionId, value) => {
    this.setState((prevState) => ({
      ...prevState,
      cachedValues: set(cloneDeep(prevState.cachedValues), questionId, value)
    }));
  };

  getCachedValue = (questionId) => {
    return get(this.state.cachedValues, questionId);
  };

  clearCachedValues = () => {
    this.setState({
      cachedValues: {}
    });
  };

  componentWillMount = () => {
    if (!this.props._reduxForm) {
      throw new Error('FormGenerator must be inside a component decorated with reduxForm()');
    }

    this.storeLookupTable(this.props);
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.fields !== nextProps.fields) {
      this.storeLookupTable(nextProps);
    }
  }

  storeLookupTable = (props) =>
    this.setState({
      lookupTable: props.lookupTable || buildLookupTable(props)
    });

  render() {
    let {fields, children} = this.props;
    let path = 'fields';

    return fields ? (
      <GenContext.Provider
        value={{
          ...omit(this.props, '_reduxForm'),
          getCachedValue: this.getCachedValue,
          setCachedValue: this.setCachedValue,
          wasGenerated: true,
          ...(this.state.lookupTable && {lookupTable: this.state.lookupTable})
        }}
      >
        <div className='generated-form'>
          {fields.map((field, index) => <GenField key={index} {...{field, path: `${path}[${index}]`}} />)}
        </div>
        {children}
      </GenContext.Provider>
    ) : null;
  }
}

export default consumeReduxFormContext(FormGenerator);
