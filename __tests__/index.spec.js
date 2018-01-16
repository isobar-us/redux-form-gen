import DefaultExport, * as main from '../src';

describe('index exports', () => {
  it('should not export a default export', () => {
    expect(DefaultExport).toBeUndefined();
  });

  it('should export the correct named exports', () => {
    expect(main.FormGenerator).toBeDefined();
    expect(main.defaultFieldTypes).toBeDefined();
    expect(main.getFieldOptions).toBeDefined();
    expect(main.RequiredIndicator).toBeDefined();
    expect(main.GenericRequiredLabel).toBeDefined();
    expect(main.genericFieldProps).toBeDefined();
    expect(main.injectGenProps).toBeDefined();

    expect(main.isSectionEmpty).toBeDefined();
    expect(main.isSectionFilled).toBeDefined();
    expect(main.isFieldFilled).toBeDefined();
    expect(main.isSectionValid).toBeDefined();
    expect(main.isFieldValid).toBeDefined();
    expect(main.isNilOrEmpty).toBeDefined();

    expect(main.getDefaultValues).toBeDefined();
    expect(main.buildLookupTable).toBeDefined();

    expect(main.consumeGenContext).toBeDefined();

    expect(main.evalCond).toBeDefined();
    expect(main.evalCondValid).toBeDefined();

    expect(main.GenField).toBeDefined();
  });
});
