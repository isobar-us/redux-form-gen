import PropTypes from 'prop-types';
import React, {Component} from 'react';
import cn from 'classnames';

import has from 'lodash/has';
import startsWith from 'lodash/startsWith';
import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';

import {consumeGenContext} from './contextUtils';
import GenCondEval from './GenCondEval';
import GenCondClearField from './GenCondClearField';
import Frag from './Frag';

import {isCondField, condDependentFields} from './conditionalUtils';

import {getFieldOptions} from './defaultFieldTypes';

export const omitGenOptions = (fieldOptions) => omitBy(fieldOptions, (value, key) => startsWith(key, '_gen'));

class _GenField extends Component {
  static propTypes = {
    field: PropTypes.shape({
      type: PropTypes.string.isRequired
    })
  };
  componentWillMount() {
    if (isNil(this.props.gen)) {
      throw new Error('GenField must be rendered as a child of a <FormGenerator>');
    }
  }

  getGenOptions = (field, visible) => {
    const {gen, disabled = false} = this.props;
    let options = {};

    if (has(gen, 'customQuestionProps')) {
      const listeners = gen.customQuestionProps[field.questionId];
      if (listeners) {
        options = {...listeners, ...options}; // listeners shouldn't override calculated options, at least for now
      }
    }

    if (has(gen, 'disabled') && gen.disabled === true) {
      options.disabled = gen.disabled;
    } else if (disabled === true) {
      options.disabled = disabled;
    }

    return options;
  };

  render() {
    const {gen, field, parentQuestionId, visible = true, /* disabled = false, */ path} = this.props || {};

    const fieldOptions = getFieldOptions({...this.props, customFieldTypes: this.props.gen.customFieldTypes});
    if (isNil(fieldOptions)) {
      console.error(`Form Generator: unknown field type "${field.type}". \nField:`, field, '\n. skipping render.');
      return null;
    }
    let options = {
      ...this.getGenOptions(field, visible),
      ...omitGenOptions(fieldOptions)
    };

    // Don't render this field or it's children if it's hidden
    if (fieldOptions._genHidden === true) return null;

    const display = has(field, 'display') ? field.display : gen.display;
    const orientation = {
      'wrapper--stacked': display === 'stacked',
      'wrapper--inline': display === 'inline'
    };
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
      (!isNil(options.name) || !isNil(options.names)) &&
      React.createElement(fieldOptions._genFieldComponent, {
        ...options,
        component: GenCondClearField,
        condComponent: options.component,
        visible,
        _fieldOptions: fieldOptions
      });

    const labelComponent =
      !isNil(fieldOptions._genLabelComponent) && React.createElement(fieldOptions._genLabelComponent, this.props);

    const component = !isNil(fieldOptions._genComponent) && React.createElement(fieldOptions._genComponent, this.props);

    // find `cond` prefixed props automatically
    const condDependentFieldNames = [
      ...(field.questionId ? [field.questionId] : []),
      ...(parentQuestionId ? [parentQuestionId] : []),
      ...(field.conditionalVisible ? condDependentFields(field.conditionalVisible) : []),
      ...(field.conditionalRequired ? condDependentFields(field.conditionalRequired) : []),
      ...(field.conditionalDisabled ? condDependentFields(field.conditionalDisabled) : [])
    ];

    return (
      (isCondField(field) && // a wrapper to evaluate conditional visibility
        (condDependentFieldNames.length > 0 ? (
          <GenCondEval
            names={condDependentFieldNames}
            field={field}
            {...parentQuestionId && {parentQuestionId}}
            parentVisible={visible}
            path={path}
          />
        ) : (
          <GenCondEval {...{field, path, parentVisible: visible, ...(parentQuestionId && {parentQuestionId})}} />
        ))) || (
        <div
          /* TODO refactor these divs used to hide for visibility/path. */
          className={cn('section', {'section--hidden': !visible})}
        >
          {' '}
          {/* hide if invisible */}
          <div className={cn({'wrapper--hidden-path': !isPathVisible})}>
            {fieldComponent ? (
              <div className={cn('wrapper', orientation)}>
                {labelComponent && labelComponent}
                {fieldComponent && fieldComponent}
              </div>
            ) : labelComponent && component ? (
              <div className={cn('wrapper', orientation)}>
                {labelComponent}
                {component}
              </div>
            ) : (
              // if either the label or component is missing, don't treat as an input-container. just render what you have.
              <Frag>
                {labelComponent && labelComponent}
                {component && component}
              </Frag>
            )}
          </div>
          {!fieldOptions._genSkipChildren &&
            field.childFields &&
            field.childFields.map((childField, index) => (
              <GenField
                key={index}
                {...{
                  field: childField,
                  visible,
                  path: `${path}.childFields[${index}]`,
                  ...(field.questionId && {parentQuestionId: field.questionId})
                }}
              />
            ))}
        </div>
        // )
      )
    );
  }
}

const GenField = consumeGenContext(_GenField);

export default GenField;
