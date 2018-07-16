import {buildLookupTable} from '../src/utils';
import exampleFieldTypes from '../stories/customFieldTypes';
import {
  isSectionFilled,
  isSectionEmpty,
  getSectionErrors,
  REQUIRED_MESSAGE,
  INVALID_MESSAGE,
  isNilOrEmpty
} from '../src/validators';
import get from 'lodash/get';

describe('isSectionFilled()', () => {
  const fields = [
    {
      questionId: 'text_id',
      type: 'text',
      required: true
    },
    {
      questionId: 'array_id',
      type: 'array',
      item: {
        type: 'arrayItem',
        childFields: [
          {
            type: 'text',
            questionId: 'array_item_text',
            required: true
          },
          {
            type: 'radio',
            questionId: 'array_item_radio',
            options: [{label: 'Yes', value: 'yes'}, {label: 'Nes', value: 'no'}]
          },
          {
            type: 'array',
            questionId: 'array_nested',
            item: {
              type: 'arrayItem',
              childFields: [
                {
                  type: 'text',
                  questionId: 'array_nested_item_text',
                  required: true
                }
              ]
            }
          }
        ]
      }
    }
  ];

  it('should calculate filled true', () => {
    const data = {
      text_id: 'something',
      array_id: [
        {
          array_item_text: 'something',
          array_nested: [
            {
              array_nested_item_text: 'one more'
            }
          ]
        }
      ]
    };
    const lookupTable = buildLookupTable({fields, customFieldTypes: exampleFieldTypes});

    const filled = isSectionFilled({data, fields, customFieldTypes: exampleFieldTypes, lookupTable});
    expect(filled).toBe(true);
  });

  it('should calculate filled false', () => {
    const data = {
      text_id: 'something',
      array_id: [
        {
          array_nested: [
            {
              array_nested_item_text: 'one more'
            }
          ]
        }
      ]
    };
    const lookupTable = buildLookupTable({fields, customFieldTypes: exampleFieldTypes});

    const filled = isSectionFilled({data, fields, customFieldTypes: exampleFieldTypes, lookupTable});
    expect(filled).toBe(false);
  });
});

describe('isSectionEmpty()', () => {
  const fields = [
    {
      questionId: 'text_id',
      type: 'text',
      required: true
    },
    {
      questionId: 'array_id',
      type: 'array',
      item: {
        type: 'arrayItem',
        childFields: [
          {
            type: 'text',
            questionId: 'array_item_text',
            required: true
          },
          {
            type: 'radio',
            questionId: 'array_item_radio',
            options: [{label: 'Yes', value: 'yes'}, {label: 'Nes', value: 'no'}]
          },
          {
            type: 'array',
            questionId: 'array_nested',
            item: {
              type: 'arrayItem',
              childFields: [
                {
                  type: 'text',
                  questionId: 'array_nested_item_text',
                  required: true
                }
              ]
            }
          }
        ]
      }
    }
  ];

  it('should calculate empty true', () => {
    const data = {
      // text_id: 'something',
      array_id: [
        // {
        //   array_item_text: 'something',
        //   array_nested: [
        //     {
        //       // array_nested_item_text: 'one more'
        //     }
        //   ]
        // }
      ]
    };
    const lookupTable = buildLookupTable({fields, customFieldTypes: exampleFieldTypes});

    const empty = isSectionEmpty({data, fields, customFieldTypes: exampleFieldTypes, lookupTable});
    expect(empty).toBe(true);
  });

  it('should calculate empty false', () => {
    const data = {
      text_id: 'something',
      array_id: [
        {
          array_nested: [
            {
              array_nested_item_text: 'one more'
            }
          ]
        }
      ]
    };
    const lookupTable = buildLookupTable({fields, customFieldTypes: exampleFieldTypes});

    const empty = isSectionEmpty({data, fields, customFieldTypes: exampleFieldTypes, lookupTable});
    expect(empty).toBe(false);
  });
});

describe('getSectionErrors', () => {
  const customFieldRequiredMessage = 'Custom Field Required Message';
  const customFieldInvalidMessage = 'Custom Field Invalid Message';

  const fields = [
    {
      type: 'text',
      questionId: 'customRequired',
      required: true,
      requiredMessage: customFieldRequiredMessage
    },
    {
      type: 'text',
      questionId: 'customInvalid',
      conditionalValid: {
        questionId: 'foo'
      },
      invalidMessage: customFieldInvalidMessage
    },
    {
      type: 'text',
      questionId: 'foo',
      required: true,
      conditionalValid: {
        pobox: true
      },
      childFields: [
        {
          type: 'text',
          questionId: 'child_foo',
          required: true,
          childFields: [
            {
              type: 'text',
              questionId: 'child_child_foo',
              required: true,
              conditionalValid: {
                questionId: 'child_foo',
                value: 'cond'
              }
            }
          ]
        }
      ]
    },
    {
      type: 'array',
      questionId: 'baz',
      item: {
        type: 'arrayItem',
        childFields: [
          {
            type: 'text',
            questionId: 'disbar',
            required: true,
            disabled: true
          },
          {
            type: 'text',
            questionId: 'condisbar',
            required: true,
            conditionalDisabled: {
              questionId: 'child_foo',
              value: 'cond'
            }
          },
          {
            type: 'text',
            questionId: 'bar',
            conditionalValid: {
              greaterThan: 10
            },
            required: true
          },
          {
            type: 'array',
            questionId: 'nested_baz',
            conditionalValid: {
              length: 2
            },
            item: {
              type: 'arrayItem',
              childFields: [
                {
                  type: 'text',
                  questionId: 'nested_foo',
                  conditionalValid: {
                    regex: '[^!]hello'
                  },
                  required: true
                }
              ]
            }
          }
        ]
      }
    }
  ];

  it('should message for required fields', () => {
    const data = {
      foo: 'Po Box 1234',
      child_foo: 'cond',
      child_child_foo: 'asdf',
      baz: [
        {
          nested_baz: [
            {
              nested_foo: 'ahello'
            },
            {
              nested_foo: 'bye'
            }
          ]
        }
      ]
    };

    const lookupTable = buildLookupTable({fields, customFieldTypes: exampleFieldTypes});
    const errors = getSectionErrors({
      fields,
      data,
      customFieldTypes: exampleFieldTypes,
      lookupTable
    });

    expect(errors).toEqual({
      // child_foo: REQUIRED_MESSAGE,
      baz: [
        {
          bar: REQUIRED_MESSAGE,
          nested_baz: [
            undefined, // eslint-disable-line no-undefined
            {
              nested_foo: INVALID_MESSAGE
            }
          ]
        }
      ],
      customRequired: customFieldRequiredMessage
    });

    const customRequiredMessage = 'Custom Required Message';
    const customInvalidMessage = 'Custom Invalid Message';

    const customErrors = getSectionErrors({
      fields,
      data,
      customFieldTypes: exampleFieldTypes,
      lookupTable,
      messages: {
        requiredMessage: customRequiredMessage,
        invalidMessage: customInvalidMessage
      }
    });

    expect(customErrors).toEqual({
      // child_foo: REQUIRED_MESSAGE,
      baz: [
        {
          bar: customRequiredMessage,
          nested_baz: [
            undefined, // eslint-disable-line no-undefined
            {
              nested_foo: customInvalidMessage
            }
          ]
        }
      ],
      customRequired: customFieldRequiredMessage
    });
  });

  it('should message for invalid fields', () => {
    const data = {
      foo: 'something',
      child_foo: 'what',
      child_child_foo: 'asdf',
      baz: [
        {
          bar: '2',
          nested_baz: [{}, {}]
        }
      ]
    };

    const lookupTable = buildLookupTable({fields, customFieldTypes: exampleFieldTypes});
    const errors = getSectionErrors({
      fields,
      data,
      customFieldTypes: exampleFieldTypes,
      lookupTable
    });

    expect(errors).toEqual({
      foo: INVALID_MESSAGE,
      child_child_foo: INVALID_MESSAGE,
      baz: [
        {
          condisbar: REQUIRED_MESSAGE,
          bar: INVALID_MESSAGE,
          nested_baz: [
            {
              nested_foo: REQUIRED_MESSAGE
            },
            {
              nested_foo: REQUIRED_MESSAGE
            }
          ]
        }
      ],
      customRequired: customFieldRequiredMessage,
      customInvalid: customFieldInvalidMessage
    });
  });

  describe('should use _genIsFilled for custom fields', () => {
    const customFieldTypes = {
      checkbox: ({field}) => ({
        _genIsFilled: ({field, data}) => get(data, field.questionId) === true,
        name: field.questionId
      })
    };

    const checkFields = [
      {
        type: 'checkbox',
        required: true,
        questionId: 'check'
      }
    ];

    const lookupTable = buildLookupTable({fields: checkFields, customFieldTypes});

    it('should show errors', () => {
      const data = {
        check: false
      };
      const errorsFalse = getSectionErrors({
        fields: checkFields,
        data: data,
        customFieldTypes,
        lookupTable
      });

      expect(errorsFalse).toEqual({
        check: REQUIRED_MESSAGE
      });
    });

    it('should show no errors', () => {
      const data = {
        check: true
      };

      const errors = getSectionErrors({
        fields: checkFields,
        data: data,
        customFieldTypes,
        lookupTable
      });

      expect(errors).toEqual({});
    });
  });

  describe('should respect conditionalVisible', () => {
    const visFields = [
      {
        type: 'text',
        questionId: 'condText'
      },
      {
        type: 'text',
        questionId: 'visText',
        required: true,
        conditionalVisible: {
          questionId: 'condText',
          value: 'something'
        }
      }
    ];

    const lookupTable = buildLookupTable({fields: visFields});

    it('should show errors', () => {
      const data = {
        condText: 'something'
      };
      const errorsFalse = getSectionErrors({
        fields: visFields,
        data: data,
        lookupTable
      });

      expect(errorsFalse).toEqual({
        visText: REQUIRED_MESSAGE
      });
    });

    it('should show no errors', () => {
      const data = {};

      const errors = getSectionErrors({
        fields: visFields,
        data: data,
        lookupTable
      });

      expect(errors).toEqual({});
    });
  });

  describe('onSetError callback', () => {
    const callbackFields = [
      {
        type: 'text',
        questionId: 'requiredText',
        required: true
      },
      {
        type: 'text',
        questionId: 'invalidText',
        conditionalValid: {
          equals: 'foo'
        }
      },
      {
        type: 'text',
        questionId: 'validText'
      }
    ];

    const lookupTable = buildLookupTable({fields: callbackFields});

    it('should call onSetError for each error', () => {
      const errorSpy = jest.fn();
      const data = {
        invalidText: 'bar'
      };
      const callbackErrors = getSectionErrors({
        fields: callbackFields,
        data: data,
        lookupTable,
        onSetError: errorSpy
      });

      expect(callbackErrors).toEqual({
        requiredText: REQUIRED_MESSAGE,
        invalidText: INVALID_MESSAGE
      });

      expect(errorSpy.mock.calls).toMatchSnapshot();
    });

    it('should not call onSetError if there are no errors', () => {
      const errorSpy = jest.fn();
      const data = {
        requiredText: 'foo',
        invalidText: 'foo'
      };
      const callbackErrors = getSectionErrors({
        fields: callbackFields,
        data: data,
        lookupTable,
        onSetError: errorSpy
      });

      expect(callbackErrors).toEqual({});
      expect(errorSpy.mock.calls.length).toBe(0);
    });
  });

  describe('excludeInvalid / excludeRequired', () => {
    const visFields = [
      {
        type: 'text',
        questionId: 'requiredText',
        required: true
      },
      {
        type: 'text',
        questionId: 'invalidText',
        conditionalValid: {
          equals: 'foo'
        }
      },
      {
        type: 'text',
        questionId: 'validText'
      }
    ];

    const lookupTable = buildLookupTable({fields: visFields});

    it('should exclude invalid errors', () => {
      const data = {
        invalidText: 'bar'
      };
      const errorsRequired = getSectionErrors({
        fields: visFields,
        data: data,
        lookupTable,
        excludeInvalid: true
      });

      expect(errorsRequired).toEqual({
        requiredText: REQUIRED_MESSAGE
      });
    });

    it('should exclude required errors', () => {
      const data = {
        invalidText: 'bar'
      };

      const errorsInvalid = getSectionErrors({
        fields: visFields,
        data: data,
        lookupTable,
        excludeRequired: true
      });

      expect(errorsInvalid).toEqual({
        invalidText: INVALID_MESSAGE
      });
    });
  });

  describe('isNilOrEmpty', () => {
    // true
    it('should return true for no param', () => {
      expect(isNilOrEmpty()).toBe(true);
    });
    it('should return true for null', () => {
      expect(isNilOrEmpty(null)).toBe(true);
    });
    it('should return true for undefined', () => {
      expect(isNilOrEmpty(undefined)).toBe(true); // eslint-disable-line no-undefined
    });
    it('should return true for {}', () => {
      expect(isNilOrEmpty({})).toBe(true);
    });
    it('should return true for []', () => {
      expect(isNilOrEmpty([])).toBe(true);
    });
    it('should return true for empty string', () => {
      expect(isNilOrEmpty('')).toBe(true);
    });
    it('should return true for string with spaces', () => {
      expect(isNilOrEmpty('   ')).toBe(true);
    });
    // it('should return true for NaN', () => {
    //   expect(isNilOrEmpty(NaN)).toBe(true); // eslint-disable-line no-new-wrappers
    // }); // TODO what should we do about this?

    // false
    it('should return false for "lol"', () => {
      expect(isNilOrEmpty('lol')).toBe(false);
    });
    it('should return false for ["lol"]', () => {
      expect(isNilOrEmpty(['lol'])).toBe(false);
    });
    it('should return false for {"lol": false}', () => {
      expect(isNilOrEmpty({lol: false})).toBe(false);
    });
    it('should return false for number', () => {
      expect(isNilOrEmpty(123)).toBe(false);
    });
    it('should return false for zero', () => {
      expect(isNilOrEmpty(0)).toBe(false);
    });
    it('should return false for new Number()', () => {
      expect(isNilOrEmpty(new Number(123))).toBe(false); // eslint-disable-line no-new-wrappers
    });
    it('should return false for Infinity', () => {
      expect(isNilOrEmpty(Infinity)).toBe(false);
    });
    it('should return false for boolean', () => {
      expect(isNilOrEmpty(false)).toBe(false);
    });
    it('should return false for new Boolean()', () => {
      expect(isNilOrEmpty(new Boolean(false))).toBe(false); // eslint-disable-line no-new-wrappers
    });
    it('should return false for new Date()', () => {
      expect(isNilOrEmpty(new Date())).toBe(false);
    });
  });
});
