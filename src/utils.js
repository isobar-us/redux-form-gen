import set from 'lodash/set';
import has from 'lodash/has';
import isNil from 'lodash/isNil';
import compact from 'lodash/compact';
import {getFieldOptions} from './defaultFieldTypes';
import defaultsDeep from 'lodash/defaultsDeep';

export const buildLookupTable = (options, table = {}) => {
  const {fields, customFieldTypes} = options;
  if (fields) {
    fields.map((field) => {
      const fieldOptions = getFieldOptions({field, customFieldTypes});

      if (!isNil(fieldOptions)) {
        // only parse valid field types
        if (field.questionId) {
          if (!isNil(table[field.questionId])) {
            // console.error('duplicate question id', field.questionId, field);
          } else {
            // if (Array.isArray(field.fields)) {
            //   set(table, field.questionId, newBuildLookupTable({
            //     ...options,
            //     fields: field.fields
            //   }));
            // } else {
            // console.info('setting field', field.questionId);
            set(table, field.questionId, field);
            // }
          }
        }

        // const table = {
        //   questionId: {
        //     item: {...field}
        //     childField: {
        //       subQuestionId: {
        //         ...field
        //       }
        //     }
        //   }
        // }

        // get(lookupTable, `${pathPrefix}.childField.${questionId}`)

        // trick to detect arrays?
        // if (fieldOptions._genFieldComponent === FieldArray && has(fieldOptions, '_genChildren')) {
        //   console.log('*&*&&*&*&*&*&&* caught array', field);
        // }

        // if (fieldOptions._genTraverseChildren) {
        //   const childFields = fieldOptions._genTraverseChildren({
        //     iterator: ({field}) => field
        //   });
        // }
        if (field.childFields) {
          buildLookupTable(
            {
              ...options,
              fields: field.childFields
            },
            table
          );
        }

        if (fieldOptions._genChildren) {
          buildLookupTable(
            {
              ...options,
              fields: fieldOptions._genChildren
            },
            table
          );
        }
      }
    });
  }
  return table;
};

export const getDefaultValues = (options) => {
  options = {
    // defaultValues: {},
    ...options,
    defaultValues: defaultsDeep(options.defaultValues, options.initialValues)
  };

  const {fields} = options;
  let {defaultValues} = options;

  fields.map((field) => getDefaultValue({...options, field}));
  return defaultValues;
};

const getDefaultValue = (options) => {
  options = {
    // defaultValues: {},
    ...options,
    defaultValues: defaultsDeep(options.defaultValues, options.initialValues)
  };

  // needs lookupTable and conditionalVisible support

  const {field, customFieldTypes, pathPrefix} = options;
  let {defaultValues} = options;

  const fieldOptions = getFieldOptions({field, customFieldTypes});
  if (!isNil(fieldOptions)) {
    // only parse valid field types

    if (!fieldOptions._genHidden) {
      // don't generate defaultValues for _genHidden fields.
      const fieldPath = has(field, 'questionId') ? mergePaths(pathPrefix, field.questionId) : pathPrefix;
      if (has(field, 'questionId') && !has(defaultValues, fieldPath)) {
        // might need isNilOrEmpty(get(defaultValues, fieldPath)) in the future
        if (has(field, 'defaultValue')) {
          set(defaultValues, fieldPath, field.defaultValue);
        } else if (has(fieldOptions, '_genDefaultValue')) {
          set(defaultValues, fieldPath, fieldOptions._genDefaultValue);
        }
      }
    }

    if (has(field, 'childFields') && Array.isArray(field.childFields)) {
      getDefaultValues({...options, fields: field.childFields});
    }

    if (fieldOptions._genTraverseChildren) {
      fieldOptions._genTraverseChildren({
        ...options,
        iterator: getDefaultValue
      });
    } else if (has(fieldOptions, '_genChildren') && Array.isArray(fieldOptions._genChildren)) {
      getDefaultValues({...options, fields: fieldOptions._genChildren});
    }
  }
  return defaultValues;
};

// used to merge existing and null/undefined paths together correctly
export const mergePaths = (...paths) => compact(paths).join('.');

// export const traverseStructure = ({iterator, fields, parentField, values, fieldTypes}) => {
//   fields.map((field) => {
//     const fieldOptions = fieldTypes[field.type](field);
//
//   });
// };

// const genHookContext = {
//   genHook: PropTypes.object
// };
//
// const getGenHookContext = (props) => ({
//   genHook: {
//     structure,
//   }
// });
//
// export const provideGenHookContext = provideContext(genContext, getGenContext);
// export const consumeGenHookContext = consumeContext(genContext);

// export const generatorHook = (options, reduxFormHOC, FormComponent) => {
//   class WrappedFormComponent extends Component {
//     // hook into handleSubmit
//     handleSubmit = (handler) => {
//       return this.props.handleSubmit((formValues) => {
//         const {fields, customFieldTypes} = this.props;
//
//         // TODO not needed, since it will need to happen onChange, and store cache of "delete" values so we can "restore" when visibile again.
//         handler(stripHiddenFields({ // strip hidden fields from formValues
//           values: formValues,
//           fields,
//           customFieldTypes
//         }));
//       });
//     };
//
//     render() {
//       return (
//         <FormComponent {...this.props} handleSubmit={this.handleSubmit} /> // eslint-ignore-line react/jsx-handler-names
//       );
//     }
//   }
//
//   const ReduxFormComponent = reduxFormHOC(WrappedFormComponent);
//
//   class WrappedReduxForm extends Component {
//     getOption = (name) => this.props[name] || options[name] || {};
//     validate = (formValues, props) => {
//       const passedValidate = this.props.validate;
//       let errors = passedValidate(formValues, props);
//       errors = {
//         ...errors,
//         ...isStructureValid(this.getOption('fields'), this.getOption('customFieldTypes'))
//       }
//
//       return errors;
//     }
//
//     getInitialValues = () => {
//       getDefaultValues()
//     }
//     render() {
//       return (
//         <ReduxFormComponent validate={this.validate} initialValues={this.getInitialValues()} />
//       );
//     }
//   }
//
//   return WrappedReduxForm;
//
//   // return const WrappedReduxForm = (props) => React.createElement(,
// };

// Example usage
// export default generatorHook({
//   customFieldTypes: {}
// }, reduxForm({form: 'test'}), () => <div />);
