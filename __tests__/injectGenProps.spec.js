import React from 'react';
import {mount, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});
import {injectGenProps} from '../src';

const propsAtNthRender = (spy, callNumber) => spy.mock.calls[callNumber][0];
const propsAtLastRender = (spy) => propsAtNthRender(spy, spy.mock.calls.length - 1);

import {reduxForm, reducer as formReducer} from 'redux-form';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
const reducer = combineReducers({form: formReducer});
let store = createStore(reducer, {});

const Form = reduxForm({
  form: 'testForm'
})((props) => {
  const {children} = props;
  formRender(props);
  return <div>{children}</div>;
});
// const isDirtySelector = isDirty('testForm');
// const getFormValuesSelector = getFormValues('testForm');

const formRender = jest.fn();

const FormDecorator = ({children, ...props}) => (
  <Provider store={store}>
    <Form {...props}>{children}</Form>
  </Provider>
);

// reset the redux store after each test
beforeEach(() => {
  store = createStore(reducer, {});
  formRender.mockClear();
});

describe('injectGenProps()', () => {
  it('should pass in generated props', () => {
    const validate = jest.fn();

    const FormGen = injectGenProps(FormDecorator);
    const wrapper = mount(<FormGen fields={[]} initialValues={{}} validate={validate} />);

    expect(propsAtLastRender(formRender).initialValues).toBeDefined();
    expect(propsAtLastRender(formRender).initialValues).toEqual({});
    expect(propsAtLastRender(formRender).validate).toBeDefined();
    expect(validate).toBeCalled();

    wrapper.setProps({initialValues: {something: 'lol'}});
    expect(propsAtLastRender(formRender).initialValues).toEqual({something: 'lol'});
  });
});
