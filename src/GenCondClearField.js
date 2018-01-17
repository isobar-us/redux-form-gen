// @flow
import React, {Component} from 'react';
import omit from 'lodash/omit';
import {consumeGenContext} from './contextUtils';
import {getDefaultValueHelper} from './utils';
import has from 'lodash/has';
import isEqual from 'lodash/isEqual';

import type {Props} from './GenCondClearField.types';

class GenCondClearField extends Component<Props> {
  componentWillReceiveProps(nextProps) {
    if (has(nextProps, 'input')) {
      if (this.props.visible && !nextProps.visible) {
        // backup current value and clear
        const {_fieldOptions, _field, input: {name, value, onChange}, gen} = nextProps;
        // skipCache only if the value changed to '' in the same tick as the visiblity change
        const skipCache = !isEqual(this.props.input.value, value) && isEqual(value, '');
        if (!skipCache) {
          gen.setCachedValue(name, value);

          const {hasDefaultValue, defaultValue} = getDefaultValueHelper({
            field: _field,
            fieldOptions: _fieldOptions
          });
          onChange(hasDefaultValue ? defaultValue : '');
        }
      }

      if (!this.props.visible && nextProps.visible) {
        // restore old value
        const {input: {name, onChange}, gen} = nextProps;
        onChange(gen.getCachedValue(name));
      }
    } else if (has(nextProps, 'fields')) {
      // array
      if (this.props.visible && !nextProps.visible) {
        // backup current value and clear
        const {fields, _fieldOptions, _field, gen} = nextProps;
        const items = nextProps.fields.getAll();
        const {hasDefaultValue, defaultValue} = getDefaultValueHelper({
          field: _field,
          fieldOptions: _fieldOptions
        });

        const defaultItems = hasDefaultValue && defaultValue ? defaultValue : [];

        gen.setCachedValue(fields.name, items);
        fields.removeAll();
        defaultItems.map((item) => fields.push(item));
      }

      if (!this.props.visible && nextProps.visible) {
        const {fields, _fieldOptions, gen} = nextProps;
        const items = gen.getCachedValue(fields.name);
        const defaultItems = _fieldOptions._genDefaultValue;
        if (items) {
          // restore old value
          fields.removeAll();
          items.map((item) => fields.push(item));
        } else if (fields.length === 0 && defaultItems) {
          // otherwise set the default value
          defaultItems.map((item) => fields.push(item));
        }
      }
    }
  }

  render() {
    const {condComponent: CondComponent, ...props} = this.props;
    return <CondComponent {...omit(props, 'visible', 'gen', '_fieldOptions', '_field')} />;
  }
}

export default consumeGenContext(GenCondClearField);
