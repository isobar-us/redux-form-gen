# How to Contribute to redux-form-gen

Thank you for your interest in contributing to `redux-form-gen`!

## Development

This project uses [Yarn](https://yarnpkg.com/) for dependency management and [Storybook](https://storybook.js.org/) for
development.

Install dependencies:

```
$ yarn
```

Run Storybook:

```
$ yarn run storybook
```

Visit <http://localhost:6006> in your browser to see the storybook development environment.

## Git Hooks

When you install dependencies (using `yarn` or `npm install`), git hooks for `precommit` and `prepush` are installed
automatically using [husky](https://github.com/typicode/husky)

* `precommit` runs `list`
* `prepush` runs `lint` & `test`

## Code Formatting

We use `prettier-eslint` for consistent code formatting. Please make sure to format your code before submitting a PR.

```
$ yarn run format
```

## Testing

This project uses [jest](https://facebook.github.io/jest/) as the test runner. Tests are located in `__tests__`. If you
submit a PR, please make sure to modify or add tests as appropriate.

## Build

```
$ yarn run clean
$ yarn run check # Makes sure tests and lints are passing
$ yarn run build
```

Or simply use the following command which combines the 3 commands above:

```
$ yarn run prepublish
```
