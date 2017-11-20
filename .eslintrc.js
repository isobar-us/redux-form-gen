module.exports = {
  parser: 'babel-eslint',
  root: true,
  extends: ['eslint:recommended', 'standard', 'standard-react'],
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.config.js'
      }
    }
  },
  globals: {
    __DEVTOOLS__: false,
    __COVERAGE__: false
  },
  parserOptions: {
    ecmaVersion: '6',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    indent: 0,
    semi: [2, 'always'],
    strict: [2, 'safe'], // use-strict not needed in ES6 classes
    'max-len': [2, {code: 120, ignoreComments: true}],
    'import/first': 0,
    'no-multi-spaces': 0,
    'jsx-quotes': [2, 'prefer-single'],
    'space-before-function-paren': [1, 'never'],
    'prefer-template': 2,
    'no-warning-comments': [
      1,
      {
        terms: ['todo', 'fixme', 'xxx', 'blocked'],
        location: 'start'
      }
    ],
    'no-unused-vars': 2,
    'no-undefined': 2,
    'no-console': ['error', {allow: ['warn', 'error']}],
    'prefer-arrow-callback': 2,
    'no-mixed-operators': 0,
    'object-curly-spacing': [2, 'never'],
    'arrow-parens': ['error', 'always'],
    'react/prop-types': 0,
    'react/jsx-indent-props': 0,
    'react/jsx-handler-names': 2,
    'react/jsx-no-bind': [2, {ignoreRefs: true}],
    'react/jsx-boolean-value': 0,
    'react/jsx-no-undef': [2, {allowGlobals: true}],
    'react/no-unused-prop-types': 0,
    'no-var': 2,
    'generator-star-spacing': 0 // fixes bug with eslint generator rule
  }
};
