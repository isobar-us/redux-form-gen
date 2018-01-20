import React from 'react';
import {render} from 'react-dom';
import {createStore, combineReducers} from 'redux';
import {reducer as formReducer, reduxForm, Form} from 'redux-form';
import {Provider} from 'react-redux';
import {FormGenerator, injectGenProps} from '@isobar-us/redux-form-gen';
import '@isobar-us/redux-form-gen/dist/style.css';

const rootReducer = combineReducers({
  form: formReducer
});
const store = createStore(rootReducer);

const onSubmit = (values) => alert(JSON.stringify(values, null, 2));

const fields = [
  {
    type: 'section',
    label: 'Step 1',
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
      }
    ]
  },
  {
    type: 'section',
    label: 'Step 2',
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
    label: 'Step 3 - Todos',
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
];

class WizardFields extends React.Component {
  state = {
    currentStep: 0
  };

  handleNextStep = () =>
    this.setState({
      currentStep: this.state.currentStep + 1
    });

  handlePrevStep = () =>
    this.setState({
      currentStep: this.state.currentStep - 1
    });

  render() {
    const {fields, handleSubmit} = this.props;
    const {currentStep} = this.state;
    return (
      <Form onSubmit={handleSubmit}>
        {/* pass your fields into <FormGenerator /> */}
        <FormGenerator fields={fields} visibleDepth={`fields[${this.state.currentStep}]`} />
        {currentStep > 0 && <button onClick={this.handlePrevStep}>Prev</button>}
        {currentStep < fields.length && <button onClick={this.handleNextStep}>Next</button>}
        {currentStep === fields.length && (<button type='submit'>Submit</button>)}
      </Form>
    );
  }
}

// wrap reduxForm in injectGenProps to take care of validation and initialValues
const WizardForm = injectGenProps(
  reduxForm({
    form: 'exampleForm',
    onSubmit
  })(WizardFields)
);

const App = () => (
  <Provider store={store}>
    <div>
      <h2>
        Wizard Example
        <small>using @isobar-us/redux-form-gen</small>
      </h2>
      <WizardForm fields={fields} /> {/* make sure to pass fields into the component wrapped with injectGenProps() */}
    </div>
  </Provider>
);

render(<App />, document.getElementById('root'));
