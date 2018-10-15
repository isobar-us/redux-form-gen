import React, {Component} from 'react';
import FieldMetaMessages from './FieldMetaMessages';
import Fragment from 'react-dot-fragment';

class TextareaField extends Component {
  render() {
    const {input, disabled} = this.props;
    return (
      <Fragment>
        <textarea {...input} disabled={disabled}>
          {input.value}
        </textarea>
        <FieldMetaMessages {...this.props.meta} />
      </Fragment>
    );
  }
}

export default TextareaField;
