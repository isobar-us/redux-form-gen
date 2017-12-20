import React, {Component} from 'react';
import GenField from '../../GenField';
import omit from 'lodash/omit';

class GenArrayItem extends Component {
  handleRemoveArrayItem = () => {
    const {arrayItemProps: {array, index}} = this.props;
    array.remove(index);
  };
  renderRemoveButtonLabel = () => 'Delete';
  renderRemoveButton = () => {
    return (
      <button type='button' onClick={this.handleRemoveArrayItem}>
        {this.renderRemoveButtonLabel()}
      </button>
    );
  };

  renderItemLabel = () => {
    const {field: {label}, arrayItemProps: {array, index}} = this.props;
    return label && label.replace('{index}', index + 1).replace('{indexOverTotal}', `${index + 1}/${array.length}`);
  };

  render() {
    const {field: {display, childFields}, path, ...props} = this.props;
    return (
      <div className='wrapper'>
        <div className='label--remove'>
          <label>{this.renderItemLabel()}</label>
          {(!display || display === 'stacked') && this.renderRemoveButton()}
        </div>
        <div className='generated-form__subform'>
          {childFields.map((field, fieldIndex) => (
            <GenField
              key={fieldIndex}
              {...{...omit(props, 'arrayItemProps'), field, path: `${path}.childFields[${fieldIndex}]`}}
            />
          ))}
        </div>
        {display && display === 'inline' && this.renderRemoveButton()}
      </div>
    );
  }
}

export default GenArrayItem;
