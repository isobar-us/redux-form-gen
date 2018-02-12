// @flow
import React from 'react';
import PropTypes from 'prop-types';

import createReactContext from 'create-react-context';
export const GenContext = createReactContext({wasGenerated: false});

export const consumeGenContext = (Component: Function) => (props: mixed) => (
  <GenContext.Consumer>
    {(gen) => <Component {...props} gen={gen} /> }
  </GenContext.Consumer>
);

// inspired by
// https://medium.com/react-ecosystem/how-to-handle-react-context-a7592dfdcbc

// const provideContext = (childContextTypes, getChildContext) => (WrappedComponent) => {
//   class ContextProvider extends Component {
//     static childContextTypes = childContextTypes;
//     getChildContext = () => getChildContext(this.props);
//
//     render() {
//       return <WrappedComponent {...this.props} />;
//     }
//   }
//   return ContextProvider;
// };

const consumeContext = (contextTypes) => (Component: Function) => {
  /* The context is passed as props. This way the component is
   completely decoupled from the context API.
  */
  const ContextConsumer = (props: mixed, context: mixed) => <Component {...props} {...context} />;
  ContextConsumer.contextTypes = contextTypes;
  return ContextConsumer;
};

export const reduxFormContext = {
  _reduxForm: PropTypes.object
};

export const consumeReduxFormContext = consumeContext(reduxFormContext);
