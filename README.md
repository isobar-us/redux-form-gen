# redux-form-gen

A pluggable form generator for redux-form.

## Getting Started

```
yarn add @isobar-us/redux-form-gen
```

or

```
npm install --save @isobar-us/redux-form-gen
```

## Examples

### Defining your own field types

```javascript
import {Field} from 'redux-form';
import FormGenerator, {GenericRequiredLabel} from '@isobar-us/redux-form-gen';

const SelectField => () => {
  // ... your custom select field
};

// defining your own field type definition.
const selectType = ({field}) => ({
  _genFieldComponent: Field,
  _genLabelComponent: GenericRequiredLabel,
  name: field.questionId,
  component: SelectField,
  options: field.options
});

// mapping the type string (key) to the type definition (value)
const customFieldTypes = {
  select: selectType
};

// using your new field type
const fields = [
  {
    type: 'select', // matches the key in `customFieldTypes`
    questionId: 'test',
    label: 'Who would win in a fight?',
    options: [
      {label: 'Horse-sized duck', value: 'horse-sized_duck'},
      {label: '100 duck-sized horses', value: '100_duck-sized_horses'}
    ]
  }
]

// passing your field and customFieldTypes into <FormGenerator />
const MyForm = () =>
  <FormGenerator fields={fields} customFieldTypes={customFieldTypes} />;
```

### 🏖 Code Sandboxes 🏖

* Coming Soon...

## Custom Field Type Options

| Property                                | Type      | Description                                                                                           |
| --------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------- |
| `_genFieldComponent`                    | Component | This is the `reduxForm` field component that this should use to render                                |
| `_genDisplayComponent`                  | Component | the React Component used for static display of a value                                                |
| `_genLabelComponent`                    | Component | the Component used to render the field label. defaults to `GenericRequiredLabel`                      |
| `_genChildren`                          | array     | used to override the default `childFields` when iterating only (not rendering)                        |
| `_genDefaultValue`                      | any       | used to calculate initialValues for a `reduxForm` component                                           |
| `_genIsFilled`                          | func      | `fn({data, field, lookupTable, customFieldTypes}) => bool`                                            |
| `_genTraverseChildren`                  | func      | `fn({iterator, data, lookupTable}) => something.map((field) => iterator({field, data, lookupTable}))` |
| `_genSkipChildren`                      | bool      | skip rendering of `childFields`                                                                       |
| `_genHidden`                            | bool      | skip rendering of this field and all it's children.                                                   |
| ...                                     | ...       | ...                                                                                                   |
| any other props for `<Field>` component | any       | `name`, `names`, `component` etc...                                                                   |

**Note**: Any props with the `_gen` prefix are omitted when rendering the `_genFieldComponent`

## Development

This project uses [Yarn](https://yarnpkg.com/) for dependency management and [Storybook](https://storybook.js.org/) for
development.

```
$ yarn install
$ yarn run storybook
```

Visit <http://localhost:6006> in your browser to see the storybook development environment.

## Build

```
$ yarn run clean
$ yarn run check # Make sure tests and lints are passing
$ yarn run build
```

Or simply use the following command which combines the 3 commands above:

```
$ yarn run prepublish
```

## Known Bugs

* built in `SelectField` can only take strings as option values, since they get converted to strings on the `<option>`
  tag
