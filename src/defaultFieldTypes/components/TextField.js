import React, {Component} from 'react';
import FieldMetaMessages from './FieldMetaMessages';

class TextField extends Component {
  render() {
    const {input, disabled} = this.props;
    return (
      <Frag>
        <input {...input} disabled={disabled} type='text' />
        <FieldMetaMessages {...this.props.meta} />
      </Frag>
    );
  }
}

export default TextField;
