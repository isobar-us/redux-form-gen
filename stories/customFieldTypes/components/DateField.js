import React, {Component} from 'react';
import FieldMetaMessages from '../../../src/defaultFieldTypes/components/FieldMetaMessages';
import Fragment from 'react-dot-fragment';

class DateField extends Component {
  render() {
    const {input} = this.props;
    return (
      <Fragment>
        <input {...input} type='date' />
        <FieldMetaMessages {...this.props.meta} />
      </Fragment>
    );
  }
}

export default DateField;
