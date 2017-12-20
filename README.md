# redux-form-gen

[![NPM Version](https://img.shields.io/npm/v/@isobar-us/redux-form-gen.svg?style=flat)](https://www.npmjs.com/package/@isobar-us/redux-form-gen)
[![NPM Downloads](https://img.shields.io/npm/dm/@isobar-us/redux-form-gen.svg?style=flat)](https://www.npmjs.com/package/@isobar-us/redux-form-gen)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A pluggable form generator for redux-form.

✅ No dependency on styling frameworks (bootstrap, etc)

✅ Pluggable - Add your own custom field types

✅ Uses a plain JSON object to define the form - can be sent from the server

✅ Supports conditional logic using JSON

## Installation

```bash
yarn add @isobar-us/redux-form-gen
```

or

```bash
npm install --save @isobar-us/redux-form-gen
```

## Documentation

* [API Docs](./API.md)

## Examples

### 🏖 Code Sandboxes 🏖

* [Basic Example](https://codesandbox.io/s/github/isobar-us/redux-form-gen/tree/v0.7.2/examples/basic)
* [All Fields Example](https://codesandbox.io/s/github/isobar-us/redux-form-gen/tree/v0.7.2/examples/all-fields)
* [Conditional Example](https://codesandbox.io/s/github/isobar-us/redux-form-gen/tree/v0.7.2/examples/conditional)
* [Wizard Example](https://codesandbox.io/s/github/isobar-us/redux-form-gen/tree/v0.7.2/examples/wizard)
* [Reactstrap Example](https://codesandbox.io/s/github/isobar-us/redux-form-gen/tree/v0.7.2/examples/reactstrap) (uses `customFieldTypes`)

### Simple Usage

```javascript
import {reduxForm, Form} from 'redux-form';
import FormGenerator, {injectGenProps} from '@isobar-us/redux-form-gen';

const fields = [
  {
    type: 'text',
    label: 'First Name',
    required: true,
    questionId: 'firstName'
  },
  {
    type: 'text',
    label: 'Last Name',
    required: true,
    questionId: 'lastName'
  }
];

// pass your fields into <FormGenerator />
const MyFields = ({handleSubmit}) => (
  <Form onSubmit={handleSubmit}>
    <FormGenerator fields={fields} />
    <button type='submit'>Submit</button>
  </Form>
);

// wrap reduxForm in injectGenProps to take care of validation and initialValues
const MyForm = injectGenProps(
  reduxForm({
    form: 'exampleForm'
  })(MyFields)
);

// make sure to pass fields into the form wrapped with injectGenProps()
const MyPage = () => (
  ...
  <MyForm fields={fields} />
);
```

### Defining your own field types

```javascript
import {reduxForm, Field, Form} from 'redux-form';
import FormGenerator, {GenericRequiredLabel, injectGenProps} from '@isobar-us/redux-form-gen';

const SelectField => () => {
  // ... your custom select field implementation
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

// pass your fields and customFieldTypes into <FormGenerator />
const MyFields = ({handleSubmit}) => (
  <Form onSubmit={handleSubmit}>
    <FormGenerator fields={fields} customFieldTypes={customFieldTypes} />
    <button type='submit'>Submit</button>
  </Form>
);

// wrap reduxForm in injectGenProps to take care of validation and initialValues
const MyForm = injectGenProps(
  reduxForm({
    form: 'myForm'
  })(MyFields)
);

// make sure to pass fields and customFieldTypes into the form wrapped with injectGenProps()
const MyPage = () => (
  ...
  <MyForm fields={fields} customFieldTypes={customFieldTypes} />
);
```

## Default Field Types

### GenericProps

* `type: string` - the type of the field. you can add more type using `customFieldTypes` prop on the `<FormGenerator />`.
* `label: string` - the label for the field
* `childFields: [FieldType]` - an array of child fields. If the parent field is invisible, childFields will also be invisible. useful for the `section` and `group` types.
* `conditionalVisible: ConditionalObject` - the evaluated ConditionalObject controls whether a field and it's childFields are visible

### GenericFieldProps

Extends `GenericProps`

* `questionId`: - the `name` property for a field. supports dot-notation
* `required: boolean` - mark the field as required
* `disabled: boolean` - mark the field as disabled (also skips required validation)
* `conditionalRequired: ConditionalObject` - the evaluated ConditionalObject controls whether a field is required
* `conditionalDisabled: ConditionalObject` - the evaluated ConditionalObject controls whether a field is disabled (also skips required validation)

### Type: `text`

Extends `GenericFieldProps`. Renders a native `<input type="text" />` component.

### Type: `textarea`

Extends `GenericFieldProps`. Renders a native `<textarea>` component.

### Type: `radio`

Extends `GenericFieldProps`. Renders a native `<input type="radio" />` component.

### Type: `select`

Extends `GenericFieldProps`. Renders a native `<select>` and `<option>` component.

* `options: [ { label: string, value: string } ]` - an array of `<option>`s to render.

### Type: `array`

Extends `GenericFieldProps`. Uses ReduxForm `FieldArray` component, and renders each item, as an `arrayItem` type.

* `item: (FieldType: arrayItem)` - the `arrayItem` type that the `array` will use to render each item.
* `addLabel` - the label for the `Add` button for adding a new item to the array.

### Type: `arrayItem`

Extends `GenericProps`

* `label: string` - supports templates for `{index}` and `{indexOverTotal}` ex: `label: "Item {index}"`

### Type: `group`

Extends `GenericProps`. Renders a extra `label` for grouping fields.

### Type: `section`

Extends `GenericProps`. Renders a header for grouping fields.

## Custom Field Type Options

| Property                                | Type      | Description                                                                                           |
| --------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------- |
| `_genFieldComponent`                    | Component | This is the `redux-form` `Field`, `Fields`, or `FieldArray` component that this should use to render  |
| `_genComponent`                         | Component | the Component used if not using `_genFieldComponent`                                                  |
| `_genLabelComponent`                    | Component | the Component used to render the field label. defaults to `GenericRequiredLabel`                      |
| `_genChildren`                          | array     | used to override the default `childFields` when iterating only (not rendering)                        |
| `_genDefaultValue`                      | any       | used when calculating the initialValues with `getDefaultValues()` for a `reduxForm` component         |
| `_genIsFilled`                          | func      | `fn({data, field, lookupTable, customFieldTypes}) => bool`                                            |
| `_genIsValid`                           | func      | `fn({data, field, lookupTable, customFieldTypes}) => bool`                                            |
| `_genSectionErrors`                     | func      | `fn({errors, data, field, lookupTable, customFieldTypes}) => void` set in `errors`                    |
| `_genTraverseChildren`                  | func      | `fn({iterator, data, lookupTable}) => something.map((field) => iterator({field, data, lookupTable}))` |
| `_genSkipChildren`                      | bool      | skip rendering of `childFields`                                                                       |
| `_genHidden`                            | bool      | skip rendering of this field and all it's children.                                                   |
| ...                                     | ...       | ...                                                                                                   |
| any other props for `<Field>` component | any       | `name`, `names`, `component` etc...                                                                   |

**Note**: Any props with the `_gen` prefix are omitted when rendering the `_genFieldComponent`

## Known Bugs

* built in `SelectField` can only take strings as option values, since they get converted to strings on the `<option>`
  tag
