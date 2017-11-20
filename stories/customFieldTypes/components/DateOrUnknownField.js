import React, {Component} from 'react';

class DateOrUnknownField extends Component {
  getDateField = (props) => (props || this.props)[(props || this.props)._field.fields.date.questionId];
  getUnknownField = (props) => (props || this.props)[(props || this.props)._field.fields.unknown.questionId];

  componentDidUpdate = (prevProps) => {
    if (this.getUnknownField().input.value && !this.getUnknownField(prevProps).input.value) {
      this.getDateField().input.onChange(''); // clear date value when you check unknown
    }
  };

  render() {
    const {_field: {fields}} = this.props;
    return (
      <div className='form-gen__date'>
        {fields.date && (
          <div className='form-gen__date-calendar'>
            <label className='hide'>{fields.date.label}</label>
            <input {...this.getDateField().input} type='date' disabled={this.getUnknownField().input.value} />
          </div>
        )}
        {fields.unknown && (
          <div className='form-gen__date-unknown'>
            <input
              type='checkbox'
              {...this.getUnknownField().input}
              id={`form-gen__${this.getUnknownField().input.name}`}
            />
            <label htmlFor={`form-gen__${this.getUnknownField().input.name}`}>{fields.unknown.label}</label>
          </div>
        )}
      </div>
    );
  }
}

export default DateOrUnknownField;
