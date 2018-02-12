import React from 'react';
import {mount} from 'enzyme';
import {GenField, FormGenerator} from '../src';

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

const FormGenDecorator = ({children, ...props}) => (
  <Provider store={store}>
    <Form {...props}>
      <FormGenerator fields={[]}>{children}</FormGenerator>
    </Form>
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
    expect(consoleErrorSpy.mock.calls[0]).toMatchSnapshot(); // getFieldOptions error
    expect(consoleErrorSpy.mock.calls[1]).toMatchSnapshot(); // GenField error
    expect(consoleErrorSpy.mock.calls.length).toBe(2);
    stopErrorSuppression();
  });

  it('should log an error if attempting to render a field that is missing a name', () => {
    startErrorSupression();
    mount(
      <FormGenDecorator>
        <GenField field={{type: 'text'}} path='fields[0]' />
      </FormGenDecorator>
    );
    expect(consoleErrorSpy.mock.calls[0]).toMatchSnapshot(); // getFieldOptions error
    expect(consoleErrorSpy.mock.calls.length).toBe(1);
    stopErrorSuppression();
  });

  it('should log an error if path is missing', () => {
    startErrorSupression();
    mount(
      <FormGenDecorator>
        <GenField field={{type: 'text', questionId: 'foo'}} />
      </FormGenDecorator>
    );
    expect(consoleErrorSpy.mock.calls).toMatchSnapshot(); // path error
    expect(consoleErrorSpy.mock.calls.length).toBe(2);
    stopErrorSuppression();
  });
});
