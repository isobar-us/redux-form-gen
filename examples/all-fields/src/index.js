import React from 'react';
import {render} from 'react-dom';
import {createStore, combineReducers} from 'redux';
import {reducer as formReducer, reduxForm, Form} from 'redux-form';
import {Provider} from 'react-redux';
import FormGenerator, {injectGenProps} from '@isobar-us/redux-form-gen';
import '@isobar-us/redux-form-gen/dist/style.css';

const rootReducer = combineReducers({
  form: formReducer
});
const store = createStore(rootReducer);

const onSubmit = (values) => alert(JSON.stringify(values, null, 2));

const fields = [
  {
    type: 'section',
    label: 'Default Field Types',
    childFields: [
      {
        type: 'text',
        questionId: 'text',
        label: 'Text Label',
        required: true
      },
      {
        type: 'textarea',
        questionId: 'textarea',
        label: 'Textarea Label',
        required: true
      },
      {
        type: 'group',
        label: 'Group Label',
        childFields: [
          {
            type: 'radio',
            questionId: 'radio',
            label: 'Radio Label',
            required: true,
            options: [{label: 'Option 1', value: '1'}, {label: 'Option 2', value: '2'}, {label: 'Option 3', value: '3'}]
          },
          {
            type: 'select',
            questionId: 'select',
            label: 'Select Label',
            required: true,
            options: [{label: 'Option 1', value: 1}, {label: 'Option 2', value: 2}, {label: 'Option 3', value: 3}]
          }
        ]
      },
      {
        type: 'array',
        label: 'Array (Todos)',
        questionId: 'array',
        addLabel: 'Add Todo',
        item: {
          type: 'arrayItem',
          label: '{index}',
          display: 'inline',
          childFields: [
            {
              type: 'text',
              questionId: 'text'
            }
          ]
        }
      }
    ]
  }
];

const MyFields = ({fields, handleSubmit}) => (
  <Form onSubmit={handleSubmit}>
    <FormGenerator fields={fields} /> {/* pass your fields into <FormGenerator /> */}
    <button type='submit'>Submit</button>
  </Form>
);

// wrap reduxForm in injectGenProps to take care of validation and initialValues
const MyForm = injectGenProps(
  reduxForm({
    form: 'exampleForm',
    onSubmit
  })(MyFields)
);

const App = () => (
  <Provider store={store}>
    <div>
      <h2>
        All Fields Example
        <small>using @isobar-us/redux-form-gen</small>
      </h2>
      <MyForm fields={fields} /> {/* make sure to pass fields into the component wrapped with injectGenProps() */}
    </div>
  </Provider>
);

render(<App />, document.getElementById('root'));
