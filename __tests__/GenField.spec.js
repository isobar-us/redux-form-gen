import React from 'react';
import {mount} from 'enzyme';
import {GenField, FormGenerator, GenContext} from '../src';

import {reduxForm, reducer as formReducer} from 'redux-form';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';

const reducer = combineReducers({form: formReducer});
let store = createStore(reducer, {});

const Form = reduxForm({
  form: 'testForm'
})(({children}) => <div>{children}</div>);
// const isDirtySelector = isDirty('testForm');
// const getFormValuesSelector = getFormValues('testForm');

const FormGenDecorator = ({children, formProps, genProps}) => (
  <Provider store={store}>
    <Form {...formProps}>
      <FormGenerator fields={[]} {...genProps}>
        {children}
      </FormGenerator>
    </Form>
  </Provider>
);

// reset the redux store after each test
beforeEach(() => {
  store = createStore(reducer, {});
});

let consoleErrorSpy;
let consoleWarnSpy;
const startErrorSupression = () => {
  consoleErrorSpy = jest.spyOn(console, 'error');
  consoleErrorSpy.mockImplementation(() => {}); // suppress error log
  consoleWarnSpy = jest.spyOn(console, 'warn');
  consoleWarnSpy.mockImplementation(() => {}); // suppress warn log
};

const stopErrorSuppression = () => {
  consoleErrorSpy.mockReset();
  consoleErrorSpy.mockRestore();
  consoleWarnSpy.mockReset();
  consoleWarnSpy.mockRestore();
};

describe('GenField', () => {
  it('should throw an error if not rendered inside a FormGenerator', () => {
    startErrorSupression();
    expect(() => {
      mount(<GenField />);
    }).toThrowErrorMatchingSnapshot();
    stopErrorSuppression();
  });

  it('should log an error if attempting to render an unknown type', () => {
    startErrorSupression();
    mount(
      <FormGenDecorator>
        <GenField field={{type: 'foo'}} path='fields[0]' />
      </FormGenDecorator>
    );
    expect(consoleWarnSpy.mock.calls.length).toBe(0);
    expect(consoleErrorSpy.mock.calls.length).toBe(2);
    expect(consoleErrorSpy.mock.calls[0]).toMatchSnapshot(); // getFieldOptions error
    expect(consoleErrorSpy.mock.calls[1]).toMatchSnapshot(); // GenField error
    stopErrorSuppression();
  });

  it('should log an error if attempting to render a field that is missing a name', () => {
    startErrorSupression();
    mount(
      <FormGenDecorator>
        <GenField field={{type: 'text'}} path='fields[0]' />
      </FormGenDecorator>
    );
    expect(consoleWarnSpy.mock.calls.length).toBe(0);
    expect(consoleErrorSpy.mock.calls.length).toBe(1);
    expect(consoleErrorSpy.mock.calls[0]).toMatchSnapshot(); // getFieldOptions error
    stopErrorSuppression();
  });

  it('should log an error if path is missing', () => {
    startErrorSupression();
    mount(
      <FormGenDecorator>
        <GenField field={{type: 'text', questionId: 'foo'}} />
      </FormGenDecorator>
    );
    expect(consoleWarnSpy.mock.calls.length).toBe(0);
    expect(consoleErrorSpy.mock.calls.length).toBe(2);
    expect(consoleErrorSpy.mock.calls).toMatchSnapshot(); // path error
    stopErrorSuppression();
  });

  it('should warn backup check for filled', () => {
    const fooField = {
      type: 'text',
      questionId: 'foo',
      conditionalVisible: {
        questionId: 'bar'
      }
    };

    startErrorSupression();
    mount(
      <Provider store={store}>
        <Form>
          <GenContext.Provider value={{wasGenerated: true}}>
            <GenField field={fooField} path='fields[0]' />
          </GenContext.Provider>
        </Form>
      </Provider>
    );
    expect(consoleWarnSpy.mock.calls.length).toBe(1);
    expect(consoleErrorSpy.mock.calls.length).toBe(0);
    expect(consoleWarnSpy.mock.calls).toMatchSnapshot();
    stopErrorSuppression();
  });

  it('should use the field type def for _genIsFilled', () => {
    const customFieldTypes = {
      bar: () => ({
        _genIsFilled: () => true
      })
    };
    const fooField = {
      type: 'text',
      questionId: 'foo',
      conditionalVisible: {
        questionId: 'bar'
      }
    };

    const barField = {
      type: 'bar',
      questionId: 'bar'
    };
    const wrapper = mount(
      <FormGenDecorator
        genProps={{
          lookupTable: {
            bar: barField
          },
          customFieldTypes
        }}
      >
        <GenField field={fooField} path='fields[0]' />
      </FormGenDecorator>
    );

    expect(wrapper.find('.section--hidden').length).toBe(0);
  });

  it('should use backup check for filled', () => {
    const customFieldTypes = {
      bar: () => ({
        _genIsFilled: () => true
      })
    };

    const fooField = {
      type: 'text',
      questionId: 'foo',
      conditionalVisible: {
        questionId: 'bar'
      }
    };

    const wrapper = mount(
      <FormGenDecorator
        genProps={{
          customFieldTypes
        }}
      >
        <GenField field={fooField} path='fields[0]' />
      </FormGenDecorator>
    );

    expect(wrapper.find('.section--hidden').length).toBe(1);
  });
});
