// @flow
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import cn from 'classnames';

import has from 'lodash/has';
import startsWith from 'lodash/startsWith';
import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';

import {consumeGenContext, consumeReduxFormContext} from './contextUtils';
import GenCondClearField from './GenCondClearField';
import Frag from './Frag';

import {isCondField, getFieldDependencies, evalCond} from './conditionalUtils';
import {getGenContextOptions, mergePaths} from './utils';

import {getFieldOptions} from './defaultFieldTypes';

import type {Props} from './GenField.types';
import type {FieldOptions} from './types';
import {getFieldPath} from './validators';

const propsToNotUpdateFor = ['_reduxForm'];
import isDeepEqual from 'react-fast-compare';

import {connect} from 'react-redux';
import {getFormValues} from 'redux-form';
import get from 'lodash/get';
import set from 'lodash/set';

export const omitGenOptions = (fieldOptions: FieldOptions) =>
  omitBy(fieldOptions, (value, key: string) => startsWith(key, '_gen'));

class GenField extends Component<Props> {
  static propTypes = {
    field: PropTypes.shape({
      type: PropTypes.string.isRequired
    })
  };

  static defaultProps = {
    required: false,
    disabled: false,
    visible: true
  };

  componentWillMount() {
    if (isNil(this.props.gen) || !this.props.gen.wasGenerated) {
      throw new Error('GenField must be rendered as a child of a <FormGenerator>');
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    const nextPropsKeys = Object.keys(nextProps);
    const thisPropsKeys = Object.keys(this.props);
    // if we have children, we MUST update in React 16
    // https://twitter.com/erikras/status/915866544558788608

    // needed to prevent additional re-renders due to dynamically built `data` object in connect
    // object reference changes every time connect runs, so isDeepEqual checks for that
    // TODO see if we only need to deepEqual the `data` prop?
    return !!(
      this.props.children ||
      nextProps.children ||
      nextPropsKeys.length !== thisPropsKeys.length ||
      nextPropsKeys.some((prop) => {
        return !~propsToNotUpdateFor.indexOf(prop) && !isDeepEqual(this.props[prop], nextProps[prop]);
      })
    );
  }

  getGenOptions = (props) => {
    const {gen, disabled, field} = props;
    let options = {};

    if (has(gen, 'customQuestionProps')) {
      const listeners = gen.customQuestionProps[field.questionId];
      if (listeners) {
        options = {...listeners, ...options}; // listeners shouldn't override calculated options, at least for now
      }
    }

    // `disabled` prop from the <FormGenerator /> component
    if (has(gen, 'disabled') && gen.disabled === true) {
      options.disabled = gen.disabled;
    } else if (disabled === true) {
      options.disabled = disabled;
    }

    return options;
  };

  render() {
    // todo figure out how to differentiate between path in FML and path in data.
    const {gen, field, pathPrefix, parentPath, data, path} = this.props;

    // Conditional Evaluation
    const evalOptions = {
      data,
      ...getGenContextOptions(gen),
      ...(parentPath && {valueKey: parentPath})
    };

    const calculatedProps = {
      ...this.props
    };

    if (this.props.visible && field.conditionalVisible) {
      calculatedProps.visible = evalCond({
        ...evalOptions,
        cond: field.conditionalVisible
      });
    }
    if (field.conditionalRequired) {
      calculatedProps.required = evalCond({
        ...evalOptions,
        cond: field.conditionalRequired
      });
    }
    if (field.conditionalDisabled) {
      calculatedProps.disabled = evalCond({
        ...evalOptions,
        cond: field.conditionalDisabled
      });
    }
    const {visible} = calculatedProps;

    const fieldOptions = getFieldOptions({
      ...calculatedProps,
      ...getGenContextOptions(this.props.gen)
    });
    if (isNil(fieldOptions)) {
      console.error(`Form Generator: unknown field type "${field.type}". \nField:`, field, '\n. skipping render.');
      return null;
    }

    let options = {
      ...this.getGenOptions(calculatedProps),
      ...omitGenOptions(fieldOptions)
    };

    // Don't render this field or it's children if it's hidden
    if (fieldOptions._genHidden === true) return null;

    const isPathVisible = has(gen, 'visibleDepth') ? startsWith(path, gen.visibleDepth) : true;
    if (isNil(path)) {
      console.error('Missing path for ', field);
    }

    if (options.component && !(options.name || options.names)) {
      console.error('Form Generator: you must specify a questionId for this field', field);
      return null;
    }

    const fieldComponent =
      !isNil(fieldOptions._genFieldComponent) &&
      !isNil(options.component) &&
      React.createElement(fieldOptions._genFieldComponent, {
        ...options,
        component: GenCondClearField,
        condComponent: options.component,
        condClearProps: {
          visible,
          fieldOptions,
          field
        }
      });

    const labelComponent =
      !isNil(fieldOptions._genLabelComponent) && React.createElement(fieldOptions._genLabelComponent, calculatedProps);

    const component =
      !isNil(fieldOptions._genComponent) && React.createElement(fieldOptions._genComponent, calculatedProps);

    const wrapperComponent =
      !isNil(fieldOptions._genWrapperComponent) &&
      React.createElement(fieldOptions._genWrapperComponent, {
        ...calculatedProps,
        labelComponent,
        fieldComponent,
        component
      });

    return (
      <div
        /* TODO refactor these divs used to hide for visibility/path.
          maybe get rid of the top-most div, and pass visibility to childFields via props?
          Then we would just need to focus on hiding individual fields...
          This would be more in-line with a render-props pattern, which would be very flexible
        */
        className={cn('section', {'section--hidden': !visible})}
      >
        {' '}
        {/* hide if invisible */}
        <div className={cn({'wrapper--hidden-path': !isPathVisible})}>
          {wrapperComponent || (
            <Frag>
              {labelComponent && labelComponent}
              {fieldComponent && fieldComponent}
              {component && component}
            </Frag>
          )}
        </div>
        {!fieldOptions._genSkipChildren &&
          field.childFields &&
          field.childFields.map((childField, index) => (
            <GenFieldWrapped
              key={index}
              {...{
                field: childField,
                visible,
                path: `${path}.childFields[${index}]`,
                ...(field.questionId && {
                  parentPath: getFieldPath({
                    field,
                    pathPrefix
                  })
                })
              }}
            />
          ))}
      </div>
    );
  }
}

const GenFieldWrapped = consumeReduxFormContext(
  consumeGenContext(
    connect(
      (state, props) => {
        const {_reduxForm, field} = props;
        const {form, sectionPrefix} = _reduxForm;

        let calculatedProps = {};

        if (isCondField(field)) {
          const dependentFields = getFieldDependencies(props);

          const formValues = getFormValues(form)(state);

          const data = dependentFields.reduce((values, {questionId, globalScope}) => {
            const path = globalScope ? questionId : mergePaths(sectionPrefix, questionId);
            const value = get(formValues, path);
            return set(values, path, value);
          }, {});

          calculatedProps.data = data;
        }

        return {
          ...calculatedProps,
          pathPrefix: sectionPrefix
        };
      },
      null,
      // omit _reduxForm and dispatch from props
      (stateProps, dispatchProps, {_reduxForm, ...ownProps}) => {
        return Object.assign({}, ownProps, stateProps);
      }
    )(GenField)
  )
);

export default GenFieldWrapped;
