# Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

* [Default Field Types](#default-field-types)
  * [GenericProps](#genericprops)
  * [GenericFieldProps](#genericfieldprops)
  * [Type: `text`](#type-text)
  * [Type: `textarea`](#type-textarea)
  * [Type: `radio`](#type-radio)
  * [Type: `select`](#type-select)
  * [Type: `array`](#type-array)
  * [Type: `arrayItem`](#type-arrayitem)
  * [Type: `group`](#type-group)
  * [Type: `section`](#type-section)
* [API](#api)
  * [default export `FormGenerator : React.ComponentType<FormGeneratorProps>`](#default-export-formgenerator--reactcomponenttypeformgeneratorprops)
  * [`isSectionValid: (options: SectionValidOptions) => Object`](#issectionvalid-options-sectionvalidoptions--object)
  * [`isSectionFilled: (options: SectionFilledOptions) => boolean`](#issectionfilled-options-sectionfilledoptions--boolean)
  * [`getDefaultValues: (options: GetDefaultValuesOptions) => Object`](#getdefaultvalues-options-getdefaultvaluesoptions--object)
  * [`injectGenProps: (React.ComponentType<ReduxForm>) => React.ComponentType`](#injectgenprops-reactcomponenttypereduxform--reactcomponenttype)
  * [`buildLookupTable: (options: BuildLookupTableOptions) => LookupTable`](#buildlookuptable-options-buildlookuptableoptions--lookuptable)
  * [`isNilOrEmpty: (any) => boolean`](#isnilorempty-any--boolean)
* [Types](#types)
  * [`FormGeneratorProps`](#formgeneratorprops)
    * [`fields: Array<FieldType>`](#fields-arrayfieldtype)
    * [`customQuestionProps?: { [key: string]: Object }`](#customquestionprops--key-string-object-)
    * [`visibleDepth?: string`](#visibledepth-string)
    * [`customFieldTypes?: CustomFieldTypes`](#customfieldtypes-customfieldtypes)
    * [`display?: 'stacked' | 'inline'`](#display-stacked--inline)
    * [`disabled?: boolean`](#disabled-boolean)
    * [`lookupTable: LookupTable`](#lookuptable-lookuptable)
  * [`FieldType`](#fieldtype)
    * [`type: string`](#type-string)
    * [`questionId?: string`](#questionid-string)
    * [`childFields?: Array<FieldType>`](#childfields-arrayfieldtype)
    * [`conditionalVisible?: ConditionalObject`](#conditionalvisible-conditionalobject)
    * [`conditionalRequired?: ConditionalObject`](#conditionalrequired-conditionalobject)
    * [`conditionalDisabled?: ConditionalObject`](#conditionaldisabled-conditionalobject)
  * [`ConditionalObject`](#conditionalobject)
    * [`questionId: string`](#questionid-string)
    * [`equals?: mixed`](#equals-mixed)
    * [`and?: Array<ConditionalObject>`](#and-arrayconditionalobject)
    * [`or?: Array<ConditionalObject>`](#or-arrayconditionalobject)
    * [`not?: ConditionalObject`](#not-conditionalobject)
    * [`filled?: boolean`](#filled-boolean)
    * [`includes?: mixed | Array<mixed>`](#includes-mixed--arraymixed)
    * [`greaterThan?: number`](#greaterthan-number)
    * [`lessThan?: number`](#lessthan-number)
    * [`greaterThanEqual?: number`](#greaterthanequal-number)
    * [`lessThanEqual?: number`](#lessthanequal-number)
    * [`length: number`](#length-number)
    * [`minLength: number`](#minlength-number)
    * [`maxLength: number`](#maxlength-number)
    * [`pobox: boolean`](#pobox-boolean)
    * [`email: boolean`](#email-boolean)
    * [`regex: boolean`](#regex-boolean)
    * [value : alias of `equals`](#value--alias-of-equals)
    * [lt : alias of `lessThan`](#lt--alias-of-lessthan)
    * [gt : alias of `greaterThan`](#gt--alias-of-greaterthan)
    * [max : alias of `lessThanEqual`](#max--alias-of-lessthanequal)
    * [min : alias of `greaterThanEqual`](#min--alias-of-greaterthanequal)
  * [`FieldOptions`](#fieldoptions)
    * [`_genFieldComponent?: React.ElementType`](#_genfieldcomponent-reactelementtype)
    * [`_genLabelComponent?: React.ElementType`](#_genlabelcomponent-reactelementtype)
    * [`_genComponent?: React.ElementType`](#_gencomponent-reactelementtype)
    * [`_genChildren?: FieldsType`](#_genchildren-fieldstype)
    * [`_genDefaultValue?: mixed`](#_gendefaultvalue-mixed)
    * [`_genIsFilled?: Function`](#_genisfilled-function)
    * [`_genIsValid?: Function`](#_genisvalid-function)
    * [`_genSectionErrors?: Function`](#_gensectionerrors-function)
    * [`_genTraverseChildren?: Function`](#_gentraversechildren-function)
    * [`_genSkipChildren?: boolean`](#_genskipchildren-boolean)
    * [`_genHidden?: boolean`](#_genhidden-boolean)
    * [(...) props for `_genFieldComponent`](#-props-for-_genfieldcomponent)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Default Field Types

### GenericProps

* `type: string` - the type of the field. you can add more type using `customFieldTypes` prop on the `<FormGenerator />`.
* `label: string` - the label for the field
* `childFields: [FieldType]` - an array of child fields. If the parent field is invisible, childFields will also be invisible. useful for the `section` and `group` types.
* `conditionalVisible`: [`ConditionalObject`](#conditionalobject) - the evaluated ConditionalObject controls whether a field and it's childFields are visible

### GenericFieldProps

Extends [GenericProps](#genericprops)

* `questionId`: - the `name` property for a field. supports dot-notation
* `required: boolean` - mark the field as required
* `disabled: boolean` - mark the field as disabled (also skips required validation)
* `conditionalRequired`: [`ConditionalObject`](#conditionalobject) - the evaluated ConditionalObject controls whether a field is required
* `conditionalDisabled`: [`ConditionalObject`](#conditionalobject) - the evaluated ConditionalObject controls whether a field is disabled (also skips required validation)

### Type: `text`

Extends [GenericFieldProps](#genericfieldprops). Renders a native `<input type="text" />` component.

### Type: `textarea`

Extends [GenericFieldProps](#genericfieldprops). Renders a native `<textarea>` component.

### Type: `radio`

Extends [GenericFieldProps](#genericfieldprops). Renders a native `<input type="radio" />` component.

### Type: `select`

Extends [GenericFieldProps](#genericfieldprops). Renders a native `<select>` and `<option>` component.

* `options: [ { label: string, value: string } ]` - an array of `<option>`s to render.

### Type: `array`

Extends [GenericFieldProps](#genericfieldprops). Uses ReduxForm `FieldArray` component, and renders each item, as an `arrayItem` type.

* `item: (FieldType: arrayItem)` - the `arrayItem` type that the `array` will use to render each item.
* `addLabel` - the label for the `Add` button for adding a new item to the array.

### Type: `arrayItem`

Extends [GenericProps](#genericprops)

* `label: string` - supports templates for `{index}` and `{indexOverTotal}` ex: `label: "Item {index}"`

### Type: `group`

Extends [GenericProps](#genericprops). Renders a extra `label` for grouping fields.

### Type: `section`

Extends [GenericProps](#genericprops). Renders a header for grouping fields.

# API

These are the library exports.

### default export `FormGenerator : React.ComponentType<FormGeneratorProps>`

### `isSectionValid: (options: SectionValidOptions) => Object`

### `isSectionFilled: (options: SectionFilledOptions) => boolean`

### `getDefaultValues: (options: GetDefaultValuesOptions) => Object`

### `injectGenProps: (React.ComponentType<ReduxForm>) => React.ComponentType`

does the heavy lifting to validation, defaultValues, and lookupTable. injects props into a reduxForm decorated component
(`initialValues`, `validate`) and uses `getDefaultValues` and `isSectionValid`

### `buildLookupTable: (options: BuildLookupTableOptions) => LookupTable`

### `isNilOrEmpty: (any) => boolean`

checks if something is nil or empty (runs trim on strings);

<!--
defaultFieldTypes,
getFieldOptions,
RequiredIndicator,
GenericRequiredLabel,
genericFieldProps,

// validators
isSectionEmpty,
isFieldFilled,
isFieldValid,

// contextUtils
consumeGenContext,

// conditionalUtils
evalCond,
evalCondValid,

// internals
GenField
-->

# Types

## `FormGeneratorProps`

### `fields: Array<FieldType>`

### `customQuestionProps?: { [key: string]: Object }`

### `visibleDepth?: string`

### `customFieldTypes?: CustomFieldTypes`

### `display?: 'stacked' | 'inline'`

### `disabled?: boolean`

### `lookupTable: LookupTable`

## `FieldType`

### `type: string`

### `questionId?: string`

### `childFields?: Array<FieldType>`

### `conditionalVisible?: ConditionalObject`

### `conditionalRequired?: ConditionalObject`

### `conditionalDisabled?: ConditionalObject`

## `ConditionalObject`

An object, when evaluated against data, resolves to a `true` or `false` value.

### `questionId: string`

defaults to the parent question, use this to override

### `equals?: mixed`

lodash `_.isEqual(value, param)`

### `and?: Array<ConditionalObject>`

an array of Conditional Objects that are logical `&&`'d together

### `or?: Array<ConditionalObject>`

an array of Conditional Objects that are logical `||`'d together

### `not?: ConditionalObject`

takes the opposite of the specified Conditional Object (`!` operation)

### `filled?: boolean`

if true, returns `!isNilOrEmpty(value)`

### `includes?: mixed | Array<mixed>`

used to check if an array includes the specific param. runs lodash `_.includes(value, param)` under the hood.

### `greaterThan?: number`

value > param

### `lessThan?: number`

value < param

### `greaterThanEqual?: number`

value >= param

### `lessThanEqual?: number`

value <= param

### `length: number`

value.length === param

### `minLength: number`

value.length >= param

### `maxLength: number`

value.length <= param

### `pobox: boolean`

check if the value looks like a pobox

### `email: boolean`

check if the value looks like an email address

### `regex: boolean`

text the value against the regex param

### value : alias of `equals`

### lt : alias of `lessThan`

### gt : alias of `greaterThan`

### max : alias of `lessThanEqual`

### min : alias of `greaterThanEqual`

## `FieldOptions`

### `_genFieldComponent?: React.ElementType`

This is the `redux-form` `Field`, `Fields`, or `FieldArray` component that this should use to render

### `_genLabelComponent?: React.ElementType`

The component to use when rendering the label. Internally uses `GenericRequiredLabel`.

### `_genComponent?: React.ElementType`

The component to use if you're not rendering a `redux-form` field component (using `_genFieldComponent`)

### `_genChildren?: FieldsType`

If inner fields are not represented by `childFields`, you use this property to expose those inner fields to traversals.

### `_genDefaultValue?: mixed`

The value to use when calculating default values for the form. (`getDefaultValues()`)

### `_genIsFilled?: Function`

`fn({data, field, lookupTable, customFieldTypes}) => bool`

Use this property to create a custom `isFieldFilled` function for this field type. Should return a boolean.

### `_genIsValid?: Function`

`fn({data, field, lookupTable, customFieldTypes}) => bool`

Use this property to create a custom `isFieldValue` function for this field type. Should return a boolean.

### `_genSectionErrors?: Function`

`fn({errors, data, field, lookupTable, customFieldTypes}) => void` set in `errors`

Allows a field type to set custom errors in the entire `errors` object during validation.

### `_genTraverseChildren?: Function`

`fn({iterator, data, lookupTable}) => something.map((field) => iterator({field, data, lookupTable}))`

Use the provided `iterator` to traverse over complex children.

### `_genSkipChildren?: boolean`

skip rendering of `childFields`

### `_genHidden?: boolean`

skip rendering of this field and all it's children.

### (...) props for `_genFieldComponent`

all props that aren't prefixed with `_gen` will get passed to the rendered `_genFieldComponent`. (such as `name`, `names`, `component`, etc).
