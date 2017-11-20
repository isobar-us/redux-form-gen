import React, {Component} from 'react';
import cn from 'classnames';
import FieldMetaMessages from './FieldMetaMessages';
import Frag from '../../Frag';

class RadioField extends Component {
  onChange = (e) => {
    let {input: {onChange}, handleChange} = this.props;

    if (handleChange) {
      handleChange(e.target.value);
    }

    onChange(e.target.value);
  };

  render() {
    let {input: {name, value: currentValue}, values, display, disabled} = this.props;

    let extraInputProps = Object.assign({}, this.props.input, {onChange: this.onChange});

    return (
      <Frag>
        <div
          className={cn('wrapper', {
            'wrapper--stacked': display === 'stacked',
            'wrapper--inline': !display || display === 'inline'
          })}
        >
          {values.map(({label, value}, index) => {
            const id = `${name}-${value}`;
            return (
              <label key={index} htmlFor={id}>
                <input
                  key={index}
                  type='radio'
                  {...extraInputProps}
                  value={value}
                  id={id}
                  disabled={disabled}
                  checked={value === currentValue}
                />
                {label}
              </label>
            );
          })}
        </div>
        <FieldMetaMessages {...this.props.meta} />
      </Frag>
    );
  }
}

export default RadioField;
