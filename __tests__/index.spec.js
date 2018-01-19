import DefaultExport, * as main from '../src';
import keys from 'lodash/keys';

describe('index exports', () => {
  it('should not export a default export', () => {
    expect(DefaultExport).toBeUndefined();
  });

  it('should export the correct named exports', () => {
    expect(keys(main)).toEqual([
      '__esModule',

      'FormGenerator',
      'defaultFieldTypes',
      'getFieldOptions',
      'RequiredIndicator',
      'GenericRequiredLabel',
      'genericFieldProps',
      'injectGenProps',

      'isSectionEmpty',
      'isSectionFilled',
      'isFieldFilled',
      'getSectionErrors',
      'getFieldErrors',
      'isNilOrEmpty',

      'getDefaultValues',
      'buildLookupTable',

      'consumeGenContext',
      'GenContext',

      'evalCond',
      'evalCondValid',

      'GenField',
      'GenWrapper'
    ]);
  });
});
