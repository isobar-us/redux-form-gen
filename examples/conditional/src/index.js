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
    type: 'text',
    label: 'First Name',
    required: true,
    questionId: 'firstName'
  },
  {
    type: 'text',
    label: 'Last Name',
    required: true,
    questionId: 'lastName'
  },
  {
    conditionalVisible: {
      and: [{questionId: 'firstName'}, {questionId: 'lastName'}]
    },
    type: 'section',
    label: 'Personal Questions',
    childFields: [
      {
        type: 'radio',
        label: 'Can you dance?',
        questionId: 'canDance',
        options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}]
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
        Basic Example
        <small>using @isobar-us/redux-form-gen</small>
      </h2>
      <MyForm fields={fields} /> {/* make sure to pass fields into the component wrapped with injectGenProps() */}
    </div>
  </Provider>
);

render(<App />, document.getElementById('root'));
