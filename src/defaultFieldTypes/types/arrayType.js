import {FieldArray} from 'redux-form';
import {genericFieldProps} from '../defaultFieldTypes';
import {isNilOrEmpty} from '../../validators';
import {mergePaths} from '../../utils';
import get from 'lodash/get';
import omit from 'lodash/omit';
import GenArray from '../components/GenArray';
import {SectionLabel} from './sectionType';

const arrayType = ({field, values, ...itemProps}) => ({
  ...genericFieldProps({field}),
  _genFieldComponent: FieldArray,
  _genLabelComponent: SectionLabel,
  _genDefaultValue: [],
  _genTraverseChildren: ({iterator, ...options}) => {
    const {data} = options;
    const arrayField = field;
    if (!isNilOrEmpty(data)) {
      const arrayValues = get(data, mergePaths(options.pathPrefix, field.questionId));
      if (arrayValues) {
        return arrayValues.map((arrayItemValues, index) =>
          iterator({
            ...options,
            pathPrefix: mergePaths(options.pathPrefix, `${arrayField.questionId}[${index}]`),
            field: field.item,
            // Don't merge scopes anymore since default is local scope
            // data: {...data, ...arrayItemValues}, // spread across, to merge scopes
            itemProps: {
              index,
              array: arrayValues
            }
          })
        );
      } else {
        return [];
      }
    } else {
      return [field.item];
    }
  },
  _genChildren: [field.item],
  item: field.item,
  addLabel: field.addLabel,
  maxItems: field.maxItems,
  itemProps: omit(itemProps, 'visible'), // don't pass visibility down to child elements, since array takes care of clearing/restoring it's own values.
  component: GenArray
});

export default arrayType;
