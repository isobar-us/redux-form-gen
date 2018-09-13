import React from 'react';
import {storiesOf} from '@storybook/react';
import {reduxForm, reducer as formReducer, getFormValues} from 'redux-form';
import {createStore, combineReducers} from 'redux';
import {Provider, connect} from 'react-redux';

import FormGenerator from '../src/FormGenerator';
import {genericFieldProps} from '../src/defaultFieldTypes';
import injectGenProps from '../src/injectGenProps';

import './style.scss';
import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/monokai.css';
import 'codemirror/mode/javascript/javascript';
import CodeMirror from 'react-codemirror';

import customFieldTypes from './customFieldTypes';

const reducer = combineReducers({form: formReducer});
const store = createStore(reducer, {}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const ExampleForm = reduxForm({
  form: 'exampleForm'
})(({children, className, valid, error, dirty}) => (
  <div className={className}>
    <p>validation: {valid ? 'valid' : error || 'invalid'}</p>
    <p>{dirty ? 'dirty' : 'pristine'}</p>
    {children}
  </div>
));

const ExampleFormValues = connect((state) => ({formValues: getFormValues('exampleForm')(state)}))(({formValues}) => (
  <pre>{JSON.stringify(formValues, null, 2)}</pre>
));

const BaseForm = injectGenProps(({children, childColumns, ...props}) => (
  <ExampleForm {...props}>
    <div className='flex'>
      {childColumns ? children : <div className='col'>{children}</div>}
      <div className='col'>
        <ExampleFormValues />
      </div>
    </div>
  </ExampleForm>
));

const ReduxDecorator = (story) => <Provider store={store}>{story()}</Provider>;

const CheckboxField = (props) => <input {...props.input} type='checkbox' checked={!!props.input.value} />;
const checkboxType = ({field}) => ({
  ...genericFieldProps({field}),
  _genDefaultValue: false,
  component: CheckboxField
});

const basicInfoExample = [
  {
    type: 'text',
    questionId: 'firstName',
    label: 'First Name'
  },
  {
    type: 'text',
    questionId: 'lastName',
    label: 'Last Name'
  },
  {
    type: 'date',
    questionId: 'birthday',
    label: 'Date of Birth'
  },
  {
    type: 'radio',
    questionId: 'gender',
    label: 'Gender',
    options: [{label: 'Female', value: 'female'}, {label: 'Male', value: 'male'}, {label: 'Other', value: 'other'}]
  }
];

import allFieldsStructure from './allFieldsStructure';
import wizardStructure from './wizardStructure';

storiesOf('FormGenerator', module)
  .addDecorator(ReduxDecorator)
  .add('basic form', () => (
    <BaseForm fields={basicInfoExample} customFieldTypes={customFieldTypes}>
      <FormGenerator fields={basicInfoExample} customFieldTypes={customFieldTypes} />
    </BaseForm>
  ))
  .add('all field types', () => (
    <BaseForm fields={allFieldsStructure} customFieldTypes={customFieldTypes}>
      <FormGenerator fields={allFieldsStructure} customFieldTypes={customFieldTypes} />
    </BaseForm>
  ))
  .add('all field types inline', () => (
    <BaseForm fields={allFieldsStructure} customFieldTypes={customFieldTypes}>
      <FormGenerator fields={allFieldsStructure} customFieldTypes={customFieldTypes} display='inline' />
    </BaseForm>
  ))
  .add('empty generator', () => (
    <ExampleForm>
      <FormGenerator />
    </ExampleForm>
  ))
  .add('progressive disclosure', () => {
    const progressiveDisclosureStructure = [
      {
        type: 'text',
        questionId: 'bar',
        label: 'Bar Label'
      },
      {
        type: 'text',
        label: 'Foo label',
        questionId: 'foo',
        required: true,
        conditionalVisible: {
          questionId: 'bar'
        },
        childFields: [
          {
            type: 'select',
            label: 'a copy',
            questionId: 'foo',
            options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}]
          }
        ]
      }
    ];
    return (
      <BaseForm fields={progressiveDisclosureStructure}>
        <FormGenerator fields={progressiveDisclosureStructure} />
      </BaseForm>
    );
  })
  .add('with custom types', () => {
    const exampleStructure = [
      {
        label: 'Bar',
        type: 'text',
        questionId: 'bar'
      },
      {
        type: 'foo'
      },
      {
        type: 'checkbox',
        questionId: 'baz',
        label: 'Baz'
      },
      {
        type: 'persistText',
        questionId: 'persist',
        label: 'persist text',
        conditionalVisible: {
          questionId: 'bar',
          equals: 'bar'
        }
      }
    ];
    const exampleFieldTypes = {
      ...customFieldTypes,
      checkbox: checkboxType,
      foo: () => ({
        _genComponent: () => <span>A FOO</span>
      })
    };
    return (
      <BaseForm fields={exampleStructure} customFieldTypes={exampleFieldTypes}>
        <FormGenerator fields={exampleStructure} customFieldTypes={exampleFieldTypes} />
      </BaseForm>
    );
  })
  .add('nested progressive disclosure', () => {
    const exampleStructure = [
      {
        type: 'radio',
        label: 'one',
        questionId: 'one',
        defaultValue: 'no',
        options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}],
        childFields: [
          {
            type: 'radio',
            label: 'two',
            questionId: 'two',
            conditionalVisible: {value: 'yes'},
            options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}],
            childFields: [
              {
                type: 'radio',
                label: 'three',
                questionId: 'three',
                conditionalVisible: {value: 'yes'},
                options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}],
                childFields: [
                  {
                    type: 'radio',
                    label: 'four',
                    questionId: 'four',
                    conditionalVisible: {value: 'yes'},
                    options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}]
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
    const exampleFieldTypes = {
      check: checkboxType,
      foo: () => ({
        _genComponent: () => <span>A FOO</span>
      })
    };
    return (
      <BaseForm fields={exampleStructure} customFieldTypes={exampleFieldTypes}>
        <FormGenerator fields={exampleStructure} customFieldTypes={exampleFieldTypes} />
      </BaseForm>
    );
  })
  .add('with an array (ToDos example)', () => {
    const todoFields = [
      {
        label: 'Todos',
        type: 'array',
        questionId: 'todos',
        item: {
          type: 'arrayItem',
          label: '{index}',
          childFields: [
            {
              type: 'text',
              questionId: 'description',
              conditionalDisabled: {
                questionId: 'completed',
                equals: true
              }
            },
            {
              type: 'check',
              questionId: 'completed'
            }
          ]
        }
      }
    ];

    const todoFieldTypes = {
      check: checkboxType
    };
    return (
      <BaseForm fields={todoFields} customFieldTypes={todoFieldTypes}>
        <FormGenerator fields={todoFields} customFieldTypes={todoFieldTypes} />
      </BaseForm>
    );
  })
  .add('wizard form example', () => <Wizard />)
  .add('form editor', () => <FormEditor />)
  .add('entire disabled form', () => <DisabledForm />);

const disabledFormFields = [
  {
    type: 'radio',
    questionId: 'tacos',
    label: 'Do you like tacos?',
    required: true,
    options: [
      {
        label: 'Yes',
        value: 'yes'
      },
      {
        label: 'No',
        value: 'no'
      }
    ]
  },
  {
    type: 'text',
    questionId: 'favoriteKind',
    label: "What's your favorite kind of taco?",
    required: true,
    conditionalVisible: {
      questionId: 'tacos',
      value: 'yes'
    }
  }
];
class DisabledForm extends React.Component {
  state = {
    disabled: true
  };

  handleToggleDisabled = () => this.setState({disabled: !this.state.disabled});

  render() {
    // const {fields} = this.props;
    return (
      <BaseForm fields={disabledFormFields} initialValues={{tacos: 'yes'}}>
        <button onClick={this.handleToggleDisabled}>{this.state.disabled ? 'Enable' : 'Disable'} Form</button>
        <FormGenerator fields={disabledFormFields} disabled={this.state.disabled} />
      </BaseForm>
    );
  }
}

class Wizard extends React.Component {
  state = {
    structure: wizardStructure,
    currentStep: 0
  };

  handleWizardNext = () => {
    this.setState({
      currentStep: this.state.currentStep + 1
    });
  };

  handleWizardPrev = () => {
    this.setState({
      currentStep: this.state.currentStep - 1
    });
  };

  render() {
    return (
      <BaseForm customFieldTypes={customFieldTypes} fields={this.state.structure}>
        {this.state.currentStep > 0 && <button onClick={this.handleWizardPrev}>Back</button>}
        {this.state.currentStep < this.state.structure.length - 1 && (
          <button onClick={this.handleWizardNext}>Next</button>
        )}

        <FormGenerator
          customFieldTypes={customFieldTypes}
          fields={this.state.structure}
          visibleDepth={`fields[${this.state.currentStep}]`}
        />
      </BaseForm>
    );
  }
}

const editorExample = [
  {
    type: 'text',
    questionId: 'text',
    label: 'Global Text'
  },
  {
    type: 'section',
    label: 'Section Label',
    questionId: 'section',
    childFields: [
      {
        type: 'text',
        questionId: 'globalText',
        globalScope: true
      },
      {
        type: 'text',
        questionId: 'text',
        label: 'Section Text',
        conditionalVisible: {
          questionId: 'text',
          globalScope: true,
          equals: 'yes'
        }
      }
    ]
  }
];

class FormEditor extends React.Component {
  state = {
    structure: editorExample,
    rawStructure: JSON.stringify(editorExample, null, 2),
    error: null
  };

  handleChangeStructure = (code) => {
    const raw = code;
    try {
      const json = JSON.parse(raw);
      this.setState({
        rawStructure: raw,
        structure: json,
        error: null
      });
    } catch (err) {
      this.setState({
        rawStructure: raw,
        error: err.message
      });
    }
  };

  render() {
    return (
      <BaseForm fields={this.state.structure} customFieldTypes={customFieldTypes} childColumns>
        <div className='col'>
          <CodeMirror
            value={this.state.rawStructure}
            onChange={this.handleChangeStructure}
            options={{
              mode: 'javascript',
              tabSize: 2,
              lineNumbers: true
              // theme: 'monokai'
            }}
          />
          {(this.state.error && (
            <div className='form-editor__message form-editor__message--error'>Error: {this.state.error}</div>
          )) || <div className='form-editor__message form-editor__message--valid'>Valid JSON</div>}
        </div>
        <div className='col scroll'>
          <FormGenerator fields={this.state.structure} customFieldTypes={customFieldTypes} />
        </div>
      </BaseForm>
    );
  }
}
