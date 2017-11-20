import React, {Component} from 'react';

class FieldMetaMessages extends Component {
  render() {
    const {touched, warning, error} = this.props;
    return (
      <Frag>
        {touched && warning && <p className={'field-warning-message'}>{warning}</p>}
        {touched && error && <p className={'field-error-message'}>{error}</p>}
      </Frag>
    );
  }
}

export default FieldMetaMessages;
