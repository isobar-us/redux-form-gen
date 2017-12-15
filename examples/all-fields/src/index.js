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

const _Form = ({fields}) => <FormGenerator fields={fields} />;

const Form = injectGenProps(
  reduxForm({
    form: 'exampleForm'
  })(_Form)
);

const App = () => (
  <Provider store={store}>
    <div style={styles}>
      <h2>All Fields Example using @isobar-us/redux-form-gen</h2>
      <Form fields={fields} />
    </div>
  </Provider>
);

render(<App />, document.getElementById('root'));
