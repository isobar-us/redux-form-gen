import React, {Component} from 'react';
import FieldMetaMessages from '../../../src/defaultFieldTypes/components/FieldMetaMessages';
import Frag from '../../../src/Frag';

class DateField extends Component {
  render() {
    const {input} = this.props;
    return (
      <Frag>
        <input {...input} type='date' />
        <FieldMetaMessages {...this.props.meta} />
      </Frag>
    );
  }
}

export default DateField;
