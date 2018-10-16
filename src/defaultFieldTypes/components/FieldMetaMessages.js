import React, {Component} from 'react';
import Fragment from 'react-dot-fragment';

class FieldMetaMessages extends Component {
  render() {
    const {touched, warning, error} = this.props;
    return (
      <Fragment>
        {touched && warning && <p className={'field-warning-message'}>{warning}</p>}
        {touched && error && <p className={'field-error-message'}>{error}</p>}
      </Fragment>
    );
  }
}

export default FieldMetaMessages;
