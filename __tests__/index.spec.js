import DefaultExport, * as main from '../src';
import keys from 'lodash/keys';

describe('index exports', () => {
  it('should not export a default export', () => {
    expect(DefaultExport).toBeUndefined();
  });

  it('should export the correct named exports', () => {
    const namedExports = [
      'FormGenerator',
      // defaultFieldTypes
      'defaultFieldTypes',
      'getFieldOptions',
      'RequiredIndicator',
      'GenericRequiredLabel',
      'genericFieldProps',
      'injectGenProps',
      // validators
      'isSectionEmpty',
      'isSectionEmptyIterator',
      'isSectionFilled',
      'isSectionFilledIterator',
      'getSectionErrors',
      'getSectionErrorsIterator',
      'isNilOrEmpty',
      // validator utils
      'getFieldPath',
      'isFieldHidden',
      'isFieldVisible',
      'isFieldRequired',
      'isFieldDisabled',
      'isFieldEmpty',
      'isFieldFilled',
      'isFieldValid',
      'mapFieldChildren',
      // utils
      'getDefaultValues',
      'buildLookupTable',
      // contextUtils
      'consumeGenContext',
      // conditionalUtils
      'evalCond',
      'evalCondValid',
      // internals
      'GenField',
      'GenWrapper'
    ];

    // expect all the names to be exactly equal
    expect(keys(main)).toEqual(['__esModule', ...namedExports]);

    // expect all named exports to be defined
    namedExports.forEach((namedExport) => {
      expect(main[namedExport]).toBeDefined();
    });
  });
});
