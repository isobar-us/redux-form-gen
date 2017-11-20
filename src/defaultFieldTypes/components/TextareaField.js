import React, {Component} from 'react';
import FieldMetaMessages from './FieldMetaMessages';
import Frag from '../../Frag';

class TextareaField extends Component {
  render() {
    const {input, disabled} = this.props;
    return (
      <Frag>
        <textarea {...input} disabled={disabled}>
          {input.value}
        </textarea>
        <FieldMetaMessages {...this.props.meta} />
      </Frag>
    );
  }
}

export default TextareaField;
