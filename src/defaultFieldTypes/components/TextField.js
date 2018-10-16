import React, {Component} from 'react';
import FieldMetaMessages from './FieldMetaMessages';
import Fragment from 'react-dot-fragment';

class TextField extends Component {
  render() {
    const {input, disabled} = this.props;
    return (
      <Fragment>
        <input {...input} disabled={disabled} type='text' />
        <FieldMetaMessages {...this.props.meta} />
      </Fragment>
    );
  }
}

export default TextField;
