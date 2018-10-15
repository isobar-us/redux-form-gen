// @flow
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {consumeReduxFormContext, GenContext} from './contextUtils';
import {buildLookupTable, isShallowEqual} from './utils';
import Frag from './Frag';

import GenField from './GenField';

import omit from 'lodash/omit';
import set from 'lodash/set';
import get from 'lodash/get';

import type {Props, State} from './FormGenerator.types';

const propsToNotUpdateFor = ['_reduxForm'];

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

  // used as child context
  state = {
    wasGenerated: true,
    lookupTable: null
  };

  // cache outside of state, since we don't pass the cache down, only functions
  cachedValues = {};

  setCachedValue = (questionId: string, value: mixed) => {
    set(this.cachedValues, questionId, value);
  };

  getCachedValue = (questionId: string) => {
    return get(this.cachedValues, questionId);
  };

  clearCachedValues = () => {
    this.cachedValues = {};
  };

  componentWillMount = () => {
    if (!this.props._reduxForm) {
      throw new Error('FormGenerator must be inside a component decorated with reduxForm()');
    }

    this.updateContext(this.props);
  };

  componentWillReceiveProps(nextProps: Props) {
    if (!isShallowEqual(this.props, nextProps)) {
      this.updateContext(nextProps);
    }

    // clear cache if form has been reset
    if (this.props._reduxForm.anyTouched && !nextProps._reduxForm.anyTouched) {
      this.clearCachedValues();
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    const nextPropsKeys = Object.keys(nextProps);
    const thisPropsKeys = Object.keys(this.props);

    return !!(
      this.props.children ||
      nextProps.children ||
      nextPropsKeys.length !== thisPropsKeys.length ||
      nextPropsKeys.some((prop) => {
        return !~propsToNotUpdateFor.indexOf(prop) && this.props[prop] !== nextProps[prop];
      }) ||
      (this.props._reduxForm.anyTouched && !nextProps._reduxForm.anyTouched)
    );
  }

  updateContext = (props: Props) => {
    let lookupTable = this.state.lookupTable;
    if (!lookupTable || this.props.fields !== props.fields) {
      lookupTable = props.lookupTable || buildLookupTable(props);
    }

    this.setState({
      ...omit(props, '_reduxForm', 'children'),
      getCachedValue: this.getCachedValue,
      setCachedValue: this.setCachedValue,
      wasGenerated: true,
      lookupTable
    });
  };

  render() {
    let {fields, children} = this.props;
    let path = 'fields';

    return fields ? (
      <GenContext.Provider value={this.state}>
        <Frag>
          <div className='generated-form'>
            {fields.map((field, index) => <GenField key={index} field={field} path={`${path}[${index}]`} />)}
          </div>
          {children}
        </Frag>
      </GenContext.Provider>
    ) : null;
  }
}

export default consumeReduxFormContext(FormGenerator);
