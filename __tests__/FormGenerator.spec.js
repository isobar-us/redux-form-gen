import React from 'react';
import {mount} from 'enzyme';

import {reduxForm, reducer as formReducer, isDirty, getFormValues} from 'redux-form';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';

import {FormGenerator, getDefaultValues, defaultFieldTypes} from '../src';
import RadioField from '../src/defaultFieldTypes/components/RadioField';
import TextField from '../src/defaultFieldTypes/components/TextField';
import GenArray from '../src/defaultFieldTypes/components/GenArray';

const reducer = combineReducers({form: formReducer});
let store = createStore(reducer, {});

const Form = reduxForm({
  form: 'testForm'
})(({children}) => <div>{children}</div>);
const isDirtySelector = isDirty('testForm');
const getFormValuesSelector = getFormValues('testForm');

const FormDecorator = ({children, ...props}) => (
  <Provider store={store}>
    <Form {...props}>{children}</Form>
  </Provider>
);

// reset the redux store after each test
beforeEach(() => {
  store = createStore(reducer, {});
});

let consoleErrorSpy;
const startErrorSupression = () => {
  consoleErrorSpy = jest.spyOn(console, 'error');
  consoleErrorSpy.mockImplementation(() => {}); // suppress error log
};

const stopErrorSuppression = () => {
  consoleErrorSpy.mockReset();
  consoleErrorSpy.mockRestore();
};

describe('<FormGenerator/>', () => {
  it('should throw an error if rendered outside reduxForm', () => {
    startErrorSupression();
    expect(() => {
      mount(<FormGenerator fields={[]} />);
    }).toThrowErrorMatchingSnapshot();
    stopErrorSuppression();
  });

  it('should render null when no fields passed, and error on PropTypes', () => {
    startErrorSupression();
    mount(
      <FormDecorator>
        <FormGenerator />
      </FormDecorator>
    );
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    stopErrorSuppression();
  });

  it('should not render any fields', () => {
    const wrapper = mount(
      <FormDecorator>
        <FormGenerator fields={[]} />
      </FormDecorator>
    );
    expect(wrapper.find('label').exists()).toBe(false);
    expect(wrapper.find('input').exists()).toBe(false);
  });

  it('should not render _genHidden field types', () => {
    const fieldTypes = {
      hiddenText: ({field}) => ({
        ...defaultFieldTypes.text({field}),
        _genHidden: true
      })
    };
    const wrapper = mount(
      <FormDecorator>
        <FormGenerator
          fields={[
            {
              type: 'hiddenText',
              label: 'a label',
              questionId: 'foo'
            }
          ]}
          customFieldTypes={fieldTypes}
        />
      </FormDecorator>
    );

    expect(wrapper.find('label').exists()).toBe(false);
    expect(wrapper.find('input').exists()).toBe(false);
  });

  it('should render all fields disabled', () => {
    const wrapper = mount(
      <FormDecorator>
        <FormGenerator
          disabled
          fields={[
            {
              type: 'text',
              label: 'a label',
              questionId: 'foo'
            }
          ]}
        />
      </FormDecorator>
    );

    expect(wrapper.find('input').props().disabled).toBe(true);
  });

  it('should render all fields enabled', () => {
    const wrapper = mount(
      <FormDecorator>
        <FormGenerator
          fields={[
            {
              type: 'text',
              label: 'a label',
              questionId: 'foo'
            }
          ]}
        />
      </FormDecorator>
    );

    expect(wrapper.find('input').props().disabled).toBeUndefined();
  });

  it('should attach props to fields via customQuestionProps', () => {
    const customQuestionProps = {
      bar: {
        customProp: true
      }
    };
    const fields = [
      {
        type: 'text',
        questionId: 'bar'
      }
    ];
    const wrapper = mount(
      <FormDecorator>
        <FormGenerator fields={fields} customQuestionProps={customQuestionProps} />
      </FormDecorator>
    );

    expect(wrapper.find(TextField).props().customProp).toBe(true);
  });

  describe('type text', () => {
    it('should render field and label', () => {
      const wrapper = mount(
        <FormDecorator>
          <FormGenerator fields={[{type: 'text', questionId: 'foo', label: 'Foo'}]} />
        </FormDecorator>
      );
      expect(wrapper.find('label').text()).toBe('Foo');
      expect(wrapper.find('input').exists()).toBe(true);
    });

    it('should not show hidden fields', () => {
      const wrapper = mount(
        <FormDecorator>
          <FormGenerator
            fields={[
              {
                type: 'text',
                questionId: 'foo',
                label: 'Foo',
                childFields: [
                  {
                    type: 'text',
                    questionId: 'bar',
                    label: 'Bar',
                    conditionalVisible: {
                      value: '123'
                    }
                  }
                ]
              }
            ]}
          />
        </FormDecorator>
      );
      expect(wrapper.find('.section--hidden').length).toBe(1);
    });

    it('should show hidden fields if cond matches', () => {
      const wrapper = mount(
        <FormDecorator initialValues={{foo: '123'}}>
          <FormGenerator
            fields={[
              {
                type: 'text',
                questionId: 'foo',
                label: 'Foo',
                childFields: [
                  {
                    type: 'text',
                    questionId: 'bar',
                    label: 'Bar',
                    conditionalVisible: {
                      value: '123'
                    }
                  }
                ]
              }
            ]}
          />
        </FormDecorator>
      );
      expect(wrapper.find('.wrapper--hidden').length).toBe(0);
    });

    it('should be disabled if cond matches', () => {
      const wrapper = mount(
        <FormDecorator initialValues={{foo: '123'}}>
          <FormGenerator
            fields={[
              {
                type: 'text',
                questionId: 'foo',
                label: 'Foo',
                childFields: [
                  {
                    type: 'text',
                    questionId: 'bar',
                    label: 'Bar',
                    conditionalDisabled: {
                      value: '123'
                    }
                  }
                ]
              }
            ]}
          />
        </FormDecorator>
      );
      const foo = wrapper.findWhere((n) => n.is(TextField) && n.props().input.name === 'foo');
      const bar = wrapper.findWhere((n) => n.is(TextField) && n.props().input.name === 'bar');
      expect(foo.props().disabled).toBeUndefined();
      expect(bar.props().disabled).toBe(true);
    });

    it('should apply display = inline style from gen props', () => {
      const wrapper = mount(
        <FormDecorator initialValues={{foo: '123'}}>
          <FormGenerator
            fields={[
              {
                type: 'text',
                questionId: 'foo',
                label: 'Foo'
              }
            ]}
            display='inline'
          />
        </FormDecorator>
      );

      expect(wrapper.find('.wrapper--inline').length).toBe(1);
    });

    it('should default to display = stacked', () => {
      const wrapper = mount(
        <FormDecorator initialValues={{foo: '123'}}>
          <FormGenerator
            fields={[
              {
                type: 'text',
                questionId: 'foo',
                label: 'Foo'
              }
            ]}
          />
        </FormDecorator>
      );

      expect(wrapper.find('.wrapper--stacked').length).toBe(1);
    });
  });

  describe('dirty/prisine with CondClearField', () => {
    const conditionalStructure = [
      {
        type: 'radio',
        label: 'one',
        questionId: 'one',
        options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}],
        childFields: [
          {
            type: 'array',
            questionId: 'array',
            conditionalVisible: {value: 'yes'},
            item: {
              type: 'arrayItem',
              childFields: [
                {
                  type: 'array',
                  questionId: 'subArray',
                  defaultValue: [
                    {
                      subArray_item_text: ''
                    }
                  ],
                  item: {
                    type: 'arrayItem',
                    childFields: [
                      {
                        type: 'text',
                        questionId: 'subArray_item_text'
                      }
                    ]
                  }
                },
                {
                  type: 'radio',
                  label: 'one',
                  questionId: 'array_item_vis',
                  options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}]
                },
                {
                  type: 'text',
                  questionId: 'array_item_text',
                  conditionalVisible: {
                    questionId: 'array_item_vis',
                    equals: 'yes'
                  }
                }
              ]
            }
          },
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

    it('should remove & restore hidden values from the state', () => {
      const wrapper = mount(
        <FormDecorator
          initialValues={getDefaultValues({
            fields: conditionalStructure,
            initialValues: {
              one: 'no'
            }
          })}
        >
          <FormGenerator fields={conditionalStructure} />
        </FormDecorator>
      );
      const one = wrapper.findWhere((n) => n.is(RadioField) && n.props().input.name === 'one');
      const two = wrapper.findWhere((n) => n.is(RadioField) && n.props().input.name === 'two');
      const three = wrapper.findWhere((n) => n.is(RadioField) && n.props().input.name === 'three');
      const four = wrapper.findWhere((n) => n.is(RadioField) && n.props().input.name === 'four');
      const array = wrapper.findWhere((n) => n.is(GenArray) && n.props().fields.name === 'array');

      one.props().input.onChange('yes');
      two.props().input.onChange('yes');
      three.props().input.onChange('yes');
      four.props().input.onChange('no');
      array.props().fields.push({
        array_item_vis: 'yes',
        array_item_text: 'something'
      });
      array.props().fields.push({
        array_item_vis: 'yes',
        array_item_text: 'another'
      });

      let state = store.getState();
      expect(isDirtySelector(state)).toBe(true);
      expect(getFormValuesSelector(state)).toEqual({
        one: 'yes',
        two: 'yes',
        three: 'yes',
        four: 'no',
        array: [
          {
            array_item_vis: 'yes',
            array_item_text: 'something'
          },
          {
            array_item_vis: 'yes',
            array_item_text: 'another'
          }
        ]
      });

      one.props().input.onChange('no');
      state = store.getState();
      expect(isDirtySelector(state)).toBe(false);
      expect(getFormValuesSelector(state)).toEqual({
        one: 'no',
        array: []
      });

      one.props().input.onChange('yes');
      state = store.getState();
      expect(isDirtySelector(state)).toBe(true);
      expect(getFormValuesSelector(state)).toEqual({
        one: 'yes',
        two: 'yes',
        three: 'yes',
        four: 'no',
        array: [
          {
            array_item_vis: 'yes',
            array_item_text: 'something'
          },
          {
            array_item_vis: 'yes',
            array_item_text: 'another'
          }
        ]
      });
    });

    it('should allow reset of cachedValues via FormGenerator.clearCachedValues()', () => {
      const wrapper = mount(
        <FormDecorator
          initialValues={getDefaultValues({
            fields: conditionalStructure,
            initialValues: {
              one: 'yes',
              two: 'yes',
              three: 'yes',
              four: 'no',
              array: [
                {
                  array_item_text: 'something'
                }
              ]
            }
          })}
        >
          <FormGenerator fields={conditionalStructure} />
        </FormDecorator>
      );

      const one = wrapper.findWhere((n) => n.is(RadioField) && n.props().input.name === 'one');

      let state = store.getState();
      one.props().input.onChange('no');

      state = store.getState();
      expect(isDirtySelector(state)).toBe(true);
      expect(getFormValuesSelector(state)).toEqual({
        one: 'no',
        two: '',
        three: '',
        four: '',
        array: []
      });

      wrapper
        .find('FormGenerator')
        .instance()
        .clearCachedValues();

      one.props().input.onChange('yes');
      state = store.getState();
      expect(isDirtySelector(state)).toBe(true);
      expect(getFormValuesSelector(state)).toEqual({
        one: 'yes',
        two: '',
        three: '',
        four: '',
        array: []
      });
    });

    it('should remove & restore hidden initialValues', () => {
      const wrapper = mount(
        <FormDecorator
          initialValues={getDefaultValues({
            fields: conditionalStructure,
            initialValues: {
              one: 'yes',
              two: 'yes',
              three: 'yes',
              four: 'no',
              array: [
                {
                  array_item_text: 'something'
                }
              ]
            }
          })}
        >
          <FormGenerator fields={conditionalStructure} />
        </FormDecorator>
      );
      const one = wrapper.findWhere((n) => n.is(RadioField) && n.props().input.name === 'one');

      let state = store.getState();
      expect(isDirtySelector(state)).toBe(false);
      expect(getFormValuesSelector(state)).toEqual({
        one: 'yes',
        two: 'yes',
        three: 'yes',
        four: 'no',
        array: [
          {
            subArray: [
              {
                subArray_item_text: ''
              }
            ],
            array_item_text: 'something'
          }
        ]
      });

      one.props().input.onChange('no');
      state = store.getState();
      expect(isDirtySelector(state)).toBe(true);
      expect(getFormValuesSelector(state)).toEqual({
        one: 'no',
        two: '',
        three: '',
        four: '',
        array: []
      });

      one.props().input.onChange('yes');
      state = store.getState();
      expect(isDirtySelector(state)).toBe(false);
      expect(getFormValuesSelector(state)).toEqual({
        one: 'yes',
        two: 'yes',
        three: 'yes',
        four: 'no',
        array: [
          {
            subArray: [
              {
                subArray_item_text: ''
              }
            ],
            array_item_text: 'something'
          }
        ]
      });
    });
  });
});
