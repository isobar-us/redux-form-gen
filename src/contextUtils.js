// @flow
import React from 'react';
import PropTypes from 'prop-types';

import createContext from 'create-react-context';
export const GenContext = createContext({wasGenerated: false});

export function withGenContext(Component: Function) {
  return function GenContextConsumer(props: mixed) {
    return <GenContext.Consumer>{(gen) => <Component {...props} gen={gen} />}</GenContext.Consumer>;
  };
}

export const consumeGenContext = withGenContext;

// inspired by
// https://medium.com/react-ecosystem/how-to-handle-react-context-a7592dfdcbc

export const reduxFormContext = {
  _reduxForm: PropTypes.object
};

export function consumeReduxFormContext(Component: Function) {
  function ReduxFormContextConsumer(props: mixed, context: mixed) {
    return <Component {...props} {...context} />;
  }
  ReduxFormContextConsumer.contextTypes = reduxFormContext;

  return ReduxFormContextConsumer;
}
