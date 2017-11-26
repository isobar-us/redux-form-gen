// @flow
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {consumeReduxFormContext, genContext} from './contextUtils';
import Frag from './Frag';

import GenField from './GenField';

import omit from 'lodash/omit';
import set from 'lodash/set';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';

import type {Props, State} from './FormGenerator.types';

class FormGenerator extends Component<Props, State> {
  static childContextTypes = genContext;
  getChildContext = () => {
    return {
      gen: {
        ...omit(this.props, '_reduxForm'),
        getCachedValue: this.getCachedValue,
        setCachedValue: this.setCachedValue
      }
    };
  };

  static propTypes = {
    fields: PropTypes.array.isRequired, // an array of field objects
    customQuestionProps: PropTypes.object, // object key = questionId, value = an object of props for the specified questionId's
    visibleDepth: PropTypes.string, // dot-notation string, used to rendering fields after this path (startsWith)
    customFieldTypes: PropTypes.objectOf(PropTypes.func),
    sectionArrayIndex: PropTypes.number,
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
  };

  render() {
    let {fields, children} = this.props;
    let path = 'fields';

    return fields ? (
      <Frag>
        <div className='generated-form'>
          {fields.map((field, index) => <GenField key={index} {...{field, path: `${path}[${index}]`}} />)}
        </div>
        {children}
      </Frag>
    ) : null;
  }
}

export default consumeReduxFormContext(FormGenerator);
