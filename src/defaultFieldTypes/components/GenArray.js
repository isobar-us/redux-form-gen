// import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {FormSection} from 'redux-form';

import Fragment from 'react-dot-fragment';
import {consumeGenContext} from '../../contextUtils';
import GenField from '../../GenField';
import {getDefaultValues, getGenContextOptions} from '../../utils';
import isNil from 'lodash/isNil';

class GenArray extends Component {
  handleAddArrayItem = () => {
    const newItem = getDefaultValues({
      fields: [this.props.item],
      ...getGenContextOptions(this.props.gen),
      initialValues: {}
    });
    return this.props.fields.push(newItem);
  };

  isAddButtonEnabled = () => {
    const {fields, maxItems} = this.props;
    return isNil(maxItems) || fields.length < maxItems;
  };

  renderAddButtonLabel = () => {
    const {addLabel} = this.props;
    return !isNil(addLabel) ? addLabel : 'Add';
  };
  renderAddButton = () => {
    return (
      <button type='button' onClick={this.handleAddArrayItem}>
        {this.renderAddButtonLabel()}
      </button>
    );
  };

  render() {
    const {fields, item, itemProps} = this.props;
    return (
      <Fragment>
        {fields.map((name, index) => (
          <FormSection name={name} key={name}>
            <GenField {...{arrayItemProps: {array: fields, index}, field: item, path: `${itemProps.path}.item`}} />
          </FormSection>
        ))}
        {this.isAddButtonEnabled() && this.renderAddButton()}
      </Fragment>
    );
  }
}

const GenArrayUnrwrapped = GenArray;
export {GenArrayUnrwrapped};

export default consumeGenContext(GenArray);
