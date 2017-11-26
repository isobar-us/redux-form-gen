// @flow
import React, {Component} from 'react';
import omit from 'lodash/omit';
import {consumeGenContext} from './contextUtils';
import has from 'lodash/has';
import isEqual from 'lodash/isEqual';

import type {Props} from './GenCondClearField.types';

class GenCondClearField extends Component<Props> {
  componentWillReceiveProps(nextProps) {
    if (has(nextProps, 'input')) {
      if (this.props.visible && !nextProps.visible) {
        // backup current value and clear
        const {_fieldOptions, input: {name, value, onChange}, gen} = nextProps;
        // skipCache only if the value changed to '' in the same tick as the visiblity change
        const skipCache = !isEqual(this.props.input.value, value) && isEqual(value, '');
        if (!skipCache) {
          gen.setCachedValue(name, value);
          onChange(_fieldOptions._genDefaultValue || '');
        }
      }

      if (!this.props.visible && nextProps.visible) {
        // restore old value
        const {input: {name, onChange}, gen} = nextProps;
        onChange(gen.getCachedValue(name));
      }
    } else if (has(nextProps, 'fields')) {
      if (this.props.visible && !nextProps.visible) {
        // backup current value and clear
        const {fields, gen} = nextProps;
        const items = nextProps.fields.getAll();
        gen.setCachedValue(fields.name, items);
        fields.removeAll();
      }

      if (!this.props.visible && nextProps.visible) {
        const {fields, _fieldOptions, gen} = nextProps;
        const items = gen.getCachedValue(fields.name);
        const defaultItems = _fieldOptions._genDefaultValue;
        if (items) {
          // restore old value
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
    return <CondComponent {...omit(props, 'visible', 'gen', '_fieldOptions')} />;
  }
}

export default consumeGenContext(GenCondClearField);
