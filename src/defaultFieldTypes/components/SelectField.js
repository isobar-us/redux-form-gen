import React, {Component} from 'react';
import {isNilOrEmpty} from '../../validators';
import FieldMetaMessages from './FieldMetaMessages';

class SelectField extends Component {
  render() {
    const {input, options} = this.props;
    return (
      <Frag>
        <select {...input} value={`${input.value}`}>
          {isNilOrEmpty(input.value) && <option value={''} disabled />}
          {options &&
            options.map(({label, value}, index) => (
              <option key={index} value={`${value}`}>
                {label}
              </option>
            ))}
        </select>
        <FieldMetaMessages {...this.props.meta} />
      </Frag>
    );
  }
}

export default SelectField;
