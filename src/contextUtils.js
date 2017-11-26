// @flow
// inspired by
// https://medium.com/react-ecosystem/how-to-handle-react-context-a7592dfdcbc
import React from 'react';
import PropTypes from 'prop-types';

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

export const genContext = {
  gen: PropTypes.object
};

export const reduxFormContext = {
  _reduxForm: PropTypes.object
};
// const getGenContext = (props) => ({
//   gen: props
// });

// export const provideGenContext = provideContext(genContext, getGenContext);
export const consumeGenContext = consumeContext(genContext);
export const consumeReduxFormContext = consumeContext(reduxFormContext);
