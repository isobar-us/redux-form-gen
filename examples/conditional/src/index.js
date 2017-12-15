import React from 'react';
import {render} from 'react-dom';
import {createStore, combineReducers} from 'redux';
import {reducer as formReducer, reduxForm} from 'redux-form';
import {Provider} from 'react-redux';
import FormGenerator, {injectGenProps} from '@isobar-us/redux-form-gen';
import '@isobar-us/redux-form-gen/dist/style.css';

const rootReducer = combineReducers({
  form: formReducer
});
const store = createStore(rootReducer);

const styles = {
  fontFamily: 'sans-serif'
};

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

const _Form = ({fields}) => <FormGenerator fields={fields} />;

const Form = injectGenProps(
  reduxForm({
    form: 'exampleForm'
  })(_Form)
);

const App = () => (
  <Provider store={store}>
    <div style={styles}>
      <h2>Conditional Example using @isobar-us/redux-form-gen</h2>
      <Form fields={fields} />
    </div>
  </Provider>
);

render(<App />, document.getElementById('root'));
