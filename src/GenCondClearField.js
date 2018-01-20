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
    const {condClearProps: {visible}} = this.props;
    const {condClearProps: {visible: nextVisible}} = nextProps;

    if (has(nextProps, 'input')) {
      if (visible && !nextVisible) {
        // backup current value and clear
        const {condClearProps: {fieldOptions, field}, input: {name, value, onChange}, gen} = nextProps;
        // skipCache only if the value changed to '' in the same tick as the visiblity change
        const skipCache = !isEqual(this.props.input.value, value) && isEqual(value, '');
        if (!skipCache) {
          gen.setCachedValue(name, value);

          const {hasDefaultValue, defaultValue} = getDefaultValueHelper({field, fieldOptions});
          onChange(hasDefaultValue ? defaultValue : '');
        }
      }

      if (!visible && nextVisible) {
        // restore old value
        const {input: {name, onChange}, gen} = nextProps;
        onChange(gen.getCachedValue(name));
      }
    } else if (has(nextProps, 'fields')) {
      // array
      if (visible && !nextVisible) {
        // backup current value and clear
        const {condClearProps: {fieldOptions, field}, fields, gen} = nextProps;
        const items = nextProps.fields.getAll();
        const {hasDefaultValue, defaultValue} = getDefaultValueHelper({field, fieldOptions});
        const defaultItems = hasDefaultValue && defaultValue ? defaultValue : [];

        gen.setCachedValue(fields.name, items);
        fields.removeAll();
        defaultItems.map((item) => fields.push(item));
      }

      if (!visible && nextVisible) {
        const {condClearProps: {fieldOptions, field}, fields, gen} = nextProps;
        const items = gen.getCachedValue(fields.name);
        const {hasDefaultValue, defaultValue} = getDefaultValueHelper({field, fieldOptions});
        const defaultItems = hasDefaultValue && defaultValue ? defaultValue : [];

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
    return <CondComponent {...omit(props, 'gen', 'condClearProps')} />;
  }
}

export default consumeGenContext(GenCondClearField);
