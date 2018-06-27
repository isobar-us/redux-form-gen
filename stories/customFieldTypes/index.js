import {Fields} from 'redux-form';
import values from 'lodash/values';
import {defaultFieldTypes} from '../../src';

const genericMultiProps = (field) => ({
  _genFieldComponent: Fields,
  _genChildren: values(field.fields),
  _field: field,
  names: values(field.fields).map((subField) => subField.questionId)
});

import columnsType from './types/columnsType';
import dateType from './types/dateType';
import dateUnknownType from './types/dateUnknownType';
import staticType from './types/staticType';
import dividerType from './types/dividerType';
import persistTextType from './types/persistTextType';

export default {
  columns: columnsType,
  date: dateType,
  dateUnknown: dateUnknownType,
  divider: dividerType,
  checkbox: defaultFieldTypes.text,
  persistText: persistTextType,
  static: staticType
};

export {genericMultiProps};
