import React, {Component} from 'react';
import FieldMetaMessages from './FieldMetaMessages';
import Frag from '../../Frag';

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
