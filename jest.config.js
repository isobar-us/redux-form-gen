module.exports = {
  coverageDirectory: 'coverage',
  collectCoverage: true,
  coverageReporters: ['html', 'lcov'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.types.{js,jsx}',
    '!src/types.js'
  ],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|bmp|ico|yml)$':
      '<rootDir>/__mocks__/fileMock.js',
    '^.+\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js'
  },
  modulePaths: ['src'],
  testRegex: '(/__tests__/.*\\.spec.js)$',
  verbose: true,
  setupTestFrameworkScriptFile: './node_modules/jest-enzyme/lib/index.js',
  setupFiles: ['./__tests__/setup', 'raf/polyfill']
};
