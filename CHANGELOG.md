# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v0.12.0-rc.0] - 2018-10-17

### Changed

* ⚠️ **[Breaking]** Changed the way that data is scoped
  * You can now specify `globalScope` next to a `questionId` in either field or conditional objects to change the base scope. By default the scope will be prefixed based on it's parent (such as an `array` or `section` type)
* Using an polyfill for `React.Fragment` so now the library should work in React < 16

### Added

* The `section` type can now accept a `questionId` in order to wrap it's children in a `<FormSection>`. This will prefix all it's childFields.

## [v0.11.0] - 2018-10-11

### Changed

* ⚠️ **[Breaking]** evalCondValid() now returns `true` if the value is `nil` or empty string #31
  * This should create more consistency in the usage of operators between `conditionalValid` and other conditional props

## [v0.10.0] - 2018-08-28

### Changed

* ⚠️ **[Breaking]** For number comparison operators, return false for nil or empty string values #28
  * This change effects the following conditional operators:
  * `lessThan`, `greaterThan`, `lessThanEqual`, `greaterThanEqual`

## [v0.9.12] - 2018-07-16

### Added

* `excludeInvalid` & `excludeRequired` options for `getSectionErrors()` #22

## [v0.9.11] - 2018-06-27

### Added

* New `onSetError` event listener for the `getSectionErrors()` function. #21
* replaced a custom shallow diff function with `react-fast-compare` for better performance.

## [v0.9.10] - 2018-05-02

### Added

* Internal values cache will now clear if form is reset.

### Fixed

* Performance has been increased by adding some update checks
* Moved internal values cache out of state (perf)
* Moved context into state (perf)

## [v0.9.9] - 2018-04-10

### Fixed

* Prevented internal bleed of `fieldOptions` between util functions
* Fixed detection of `_genHidden` in `isFieldVisible()`

## [v0.9.8] - 2018-03-06

### Fixed

* Allow `_genSectionErrors` to run for any field, regardless of if it has a `questionId` #20
* Check for `!isNil` before running `_genIsFilled` and `_genIsValid`

## [v0.9.7] - 2018-02-15

### Fixed

* `isFieldValid()` now runs both `_genIsValid` and `conditionalValid` and logical ANDs the results

## [v0.9.6] - 2018-02-15

### Fixed

* make sure all `Gen...` components extract options from gen context

## [v0.9.5] - 2018-02-14

### Fixed

* pass `customOperators` and `lookupTable` down to `getFieldOptions()`

## [v0.9.4] - 2018-02-14

### Added

* `_genSkipCache` field option to opt-out of the clear/restore functionality when a field changes visibility #17
* `compare` operator to compare the value of one questionId to another questionId #18
* `cond` operator to run conditional objects (useful in combination with `compare`) #18
* `customOperators` prop for `<FormGenerator />` and all utils. Allows you to specify you own operators for conditional objects. #18

## [v0.9.3] - 2018-02-13

### Fixed

* Fixed issue where `filled` wperator was not executing if `lookupTable` was provided, but the remote field was not in the table.

## [v0.9.2] - 2018-02-13

### Fixed

* FormGenerator now passes down `lookupTable` to `GenCondEval` via context. #16

## [v0.9.1] - 2018-02-11

### Fixed

* Moved `create-react-context` from devDependencies to dependencies

## [v0.9.0] - 2018-02-11

🚨 Use v0.9.1 🚨

---

### Changed

* ⚠️ **[Breaking]** `isFieldFilled()` has been renamed to `isSectionFilledIterator()`
* ⚠️ **[Breaking]** `isFieldEmpty()` has been renamed to `isSectionEmptyIterator()`
* ⚠️ **[Breaking]** `getFieldErrors()` has been renamed to `getSectionErrorsIterator()`

### Added

* New context API
  * new export `GenContext` follows the new `createReactContext()` pattern
* New util functions #13
  * `isFieldVisible(options)` - runs `field.conditionalVisible`
  * `isFieldHidden(options)` - checks for `_genHidden`
  * `isFieldDisabled(options)` - checks `field.disabled` or runs `field.conditionalDisabled`
  * `isFieldRequired(options)` - checks `field.required` or runs `field.conditionalRequired`. also takes into account the disabled state. a field that is disabled can't be required.
  * `isFieldFilled(options)` - checks for `_genIsFilled` or runs `!isNilOrEmpty(value)`
  * `isFieldEmpty(options)` - checks for `!_genIsFilled` or runs `isNilOrEmpty(value)`
  * `isFieldValid(options)` - checks for `_genIsValid` or runs `field.conditionalValid`
  * `mapFieldChildren(options, iterator)` - maps over all children (`field.childFields`, `_genChildren`, and `_genTraverseChildren`)

## [v0.8.1] - 2018-01-17

### Fixed

* Fix accidental omission of `_field` prop.

## [v0.8.0] - 2018-01-17

### Changed

* ⚠️ **[Breaking]** No more default export. please destructure `import {FormGenerator} from '@isobar-us/redux-form-generator'` #5
* ⚠️ **[Breaking]** Renamed `isSectionValid` to `getSectionErrors` #7
* ⚠️ **[Breaking]** Renamed `isFieldValid` to `getFieldErrors` #7

### Added

* New `_genWrapperComponent` api for field types. #6
* Field level validation messages. #9

### Fixed

* Fix bugs around `getDefaultValues` in combination with `GenCondClearField` #8

---

## [v0.7.2] - 2017-12-20

### Added

* `injectGenProps()` now merges the provided `validate` errors with the generated errors

## [v0.7.1] - 2017-12-15

### Added

* Codesandbox links are now versioned within this repo.
* new Wizard Example

### Fixed

* Fix a bug where conditional properties for array items were broken.

## [v0.7.0] - 2017-12-11

### Added

* 🎉 Flow Types! 🎉 #1
* Open Source Guidelines #2

### Fixed

* Fixed bug where the `not` conditional operator wasn't working.
* There may be some other bugs that were fixed by adding Flow.

---

## [v0.6.0] - 2017-11-21

### Added

* Add support for custom global required and invalid error messages to `isSectionValid()` & `isFieldValid()`
* Major refactor of `evalCond()` data flow. see Breaking Changes below.

### Fixed

* Fixed a bug where when using `<FormGenerator ... disabled />`, fields were childFields wouldn't re-enable

### Changed

* ⚠️ **[Breaking]** `evalCond()` & `evalCondValid()` no longer take `_parentValue` mixed in with data. You now use `valueKey` option to
  pass the questionId of the value data, and it will `get(data, valueKey)`. (is affected by reduxFormDeep option).
* ⚠️ **[Breaking]** `_value` is the new default `valueKey` for `evalCond()` & `evalCondValid()`
* ⚠️ **[Breaking]** When running any validation helpers like `isSectionValid()`, `evalCondValid()` defaults the `valueKey` to the current
  field questionId, not the parent like it used to.

### Removed
* ⚠️ **[Breaking]** Officially remove field level validation operators in favor of using `conditionalValid` operators
* ⚠️ **[Breaking]** Removed `evalCondRequired()` from default exports, since it's equal to `evalCond()`

---

## [v0.5.3] - 2017-11-21

### Fixed

* fixed a bug where when using `<FormGenerator ... disabled />`, fields with conditional operations wouldn't re-enable.

## [v0.5.2] - 2017-11-20

### Added

* added `injectGenProps` HOC to take care of passing `validate` and `initialValues` to the `reduxForm` decorated
  component.

### Fixed

* gracefully return `null` if required `fields` prop isn't passed to `<FormGenerator />`

## [v0.5.1] - 2017-11-20

### Fixed

* add missing dependencies (classnames, lodash, prop-types)
* import Frag explicitly instead of using webpack.ProvidePlugin

## v0.5.0 - 2017-11-19

* 🎉 First open source release 🎉
* Change package name to `@isobar-us/redux-form-gen`
* `isFieldValid` now checks for `name` from the field options before attempting to validate (previously checked for
  `questionId` on the field object)
* added `_genSectionErrors` api to allow field types to set multiple errors, only used in advanced cases.
* added error/warning validation messages to default field types
* `genericFieldProps` now takes all options object, instead of just `fields`
* refactor storybook examples.

---

## v0.4.0

* ⚠️ **[Breaking]**  remove the following field types from defaultFieldTypes, moved to storybook examples.
  * `arrayControl`
  * `arrayControlSelect`
  * `checkboxArray`
  * `columns`
  * `divider`
  * `sectionArray`
  * `static`
* export `GenField` as a named export.
* add `disabled` prop support for `<Form Generator />` to disable all fields in the form.
* use prettier for code formatting.

---

## v0.3.9

* refactored classnames/dom and stylesheet to be more lightweight
* removed unneeded `div`s using the `<Frag>` component pattern
* upgrade eslint and babel-eslint

## v0.3.8

* upgrade to react v16
* upgrade to redux-form v7
* use `_.get()` when retrieving fields from the lookupTable. added tests.

## v0.3.7

* fix clear/restore for arrays with default values

## v0.3.6

* fix clear/restore bug where conditional fields inside array items were causing duplicate items.
* make `isNilOrEmpty` work for Objects.

## v0.3.5

* conditional operators greaterThan(gt), lessThan(lt), greaterThanEqual(min), lessThanEqual(max) now treat nil as 0
* regex operators (regex, pobox, email) will return true if value is not a string.

## v0.3.4

* add support for `conditionalVisible` in the `isSectionValid`/`isFieldValid` logic.
* throw additional errors for invalid conditional object props.

## v0.3.3

* add `itemProps: {item, array}` to the options passed down by the `array` field type `_genTraverseChildren` function.
  useful for static rendering.

## v0.3.2

* fix the `maxLengh`, `minLength`, and `length` conditional operators, and default to `true` if the value doesn't have a
  length property.

## v0.3.1

* use `_genIsFilled` when checking `isSectionValid`/`isFieldValid` and a field is required.

## v0.3.0

* ⚠️ **[Breaking]** split `array` type into `array` and `arrayItem`. includes a new `GenArrayItem` component, and
  modification to `GenArray`.
* ⚠️ **_[Possibly Breaking]_** `value` and `equals` cond ops use `_.isEqual` for deep equal comparison.
* merge validation operators into evalCond() operators. supports `regex` and `length` comparisons among others.

---

## v0.2.5

* remove flex from `--inline`
* fix display classnames

## v0.2.4

* fix the `display` prop for `<FormGenerator />`
* add flex to the `--inline` style

## v0.2.3

* support for `conditionalDisabled`!
* isSectionValid will not validate fields that are disabled
* **[Broken: Fixed in v0.2.4]** added a `display` prop to `<FormGenerator display='stacked' />`. can be either `stacked`
  or `inline` and applies to the whole form. will be overridden by `display` on fields.
* export `omitGenOptions` from `GenField`
* remove `maxLength` from the default `text` field type. leaving this to app implementations.

## v0.2.2

* add `_genHidden` support for field Type definitions. if set to `true`, it prevents the field and it's children from
  rendering.
* fix clear/restore functionality for array-like fields.
* add styling for metadata

## v0.2.1

* add `defaultValue` support for overriding `_genDefaultValue` on all field types via FML

## v0.2.0

* ⚠️ **[Breaking]** change `_genNoChildren` to `_genSkipChildren`
* ⚠️ **[Breaking]** change `_genDisplayComponent` to `_genComponent`
* ⚠️ **[Breaking]** use `_genDisplayComponent` for static rendering only

---

## v0.1.6

* `array` field type no longer required `lookupTable` as an option for `_genTraverseChildren`
* export `reduxFormContext` from `contextUtils.js`

## v0.1.5

* added support for `display` `stacked/inline` orientation for fields
* css refactor and flex grid scaffolding
* broke out `GenArray` into member function components
* export `GenArrayUnrwrapped` from `GenArray.js` for easy class inheritance

## v0.1.4

* added `isSectionValid` and `isFieldValid` to exports
* added `isSectionEmpty` to exports
* removed `disableFieldValidate` from `<FormGenerator />` propTypes

## v0.1.3

* fix bug with remove & restore of field values with `CondClearField`

## v0.1.2

* `CondClearField` working by caching hidden field values in `FormGenerator` local state [broken. fixed in `v0.1.3`]
* added `getDefaultValues`
* new version of `buildLookupTable`

## v0.1.1

* fix bug where `_gen*` field props weren't getting stripped
* export `GenericRequiredLabel`
* export `genericFieldProps`

## v0.1.0

* first release

[Unreleased]: https://github.com/isobar-us/redux-form-gen/compare/v0.11.0...HEAD

[v0.11.0]: https://github.com/isobar-us/redux-form-gen/compare/v0.10.0...v0.11.0

[v0.10.0]: https://github.com/isobar-us/redux-form-gen/compare/v0.9.12...v0.10.0

[v0.9.12]: https://github.com/isobar-us/redux-form-gen/compare/v0.9.11...v0.9.12
[v0.9.11]: https://github.com/isobar-us/redux-form-gen/compare/v0.9.10...v0.9.11
[v0.9.10]: https://github.com/isobar-us/redux-form-gen/compare/v0.9.9...v0.9.10
[v0.9.9]: https://github.com/isobar-us/redux-form-gen/compare/v0.9.8...v0.9.9
[v0.9.8]: https://github.com/isobar-us/redux-form-gen/compare/v0.9.7...v0.9.8
[v0.9.7]: https://github.com/isobar-us/redux-form-gen/compare/v0.9.6...v0.9.7
[v0.9.6]: https://github.com/isobar-us/redux-form-gen/compare/v0.9.5...v0.9.6
[v0.9.5]: https://github.com/isobar-us/redux-form-gen/compare/v0.9.4...v0.9.5
[v0.9.4]: https://github.com/isobar-us/redux-form-gen/compare/v0.9.3...v0.9.4
[v0.9.3]: https://github.com/isobar-us/redux-form-gen/compare/v0.9.2...v0.9.3
[v0.9.2]: https://github.com/isobar-us/redux-form-gen/compare/v0.9.1...v0.9.2
[v0.9.1]: https://github.com/isobar-us/redux-form-gen/compare/v0.9.0...v0.9.1
[v0.9.0]: https://github.com/isobar-us/redux-form-gen/compare/v0.8.1...v0.9.0

[v0.8.1]: https://github.com/isobar-us/redux-form-gen/compare/v0.8.0...v0.8.1
[v0.8.0]: https://github.com/isobar-us/redux-form-gen/compare/v0.7.2...v0.8.0

[v0.7.2]: https://github.com/isobar-us/redux-form-gen/compare/v0.7.1...v0.7.2
[v0.7.1]: https://github.com/isobar-us/redux-form-gen/compare/v0.7.0...v0.7.1
[v0.7.0]: https://github.com/isobar-us/redux-form-gen/compare/v0.6.0...v0.7.0

[v0.6.0]: https://github.com/isobar-us/redux-form-gen/compare/v0.5.3...v0.6.0

[v0.5.3]: https://github.com/isobar-us/redux-form-gen/compare/v0.5.2...v0.5.3
[v0.5.2]: https://github.com/isobar-us/redux-form-gen/compare/v0.5.1...v0.5.2
[v0.5.1]: https://github.com/isobar-us/redux-form-gen/compare/v0.5.0...v0.5.1
