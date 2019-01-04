import {buildLookupTable, getDefaultValues, mergePaths} from '../src/utils';
import exampleFieldTypes from '../stories/customFieldTypes';
// import defaultsDeep from 'lodash/defaultsDeep';

describe('buildLookupTable()', () => {
  it('should handle nested arrays correctly', () => {
    const fields = [
      {
        questionId: 'text_id',
        type: 'text'
      },
      {
        questionId: 'one.two.three',
        type: 'text'
      },
      {
        questionId: 'array_id',
        type: 'array',
        item: {
          type: 'arrayItem',
          childFields: [
            {
              type: 'text',
              questionId: 'array_item_text'
            },
            {
              type: 'array',
              questionId: 'array_nested',
              item: {
                type: 'arrayItem',
                childFields: [
                  {
                    type: 'text',
                    questionId: 'array_nested_item_text'
                  }
                ]
              }
            }
          ]
        }
      }
    ];

    const table = buildLookupTable({fields, customFieldTypes: exampleFieldTypes});

    expect(table).toEqual({
      text_id: {
        questionId: 'text_id',
        type: 'text'
      },
      one: {
        two: {
          three: {
            questionId: 'one.two.three',
            type: 'text'
          }
        }
      },
      array_id: {
        questionId: 'array_id',
        type: 'array',
        item: {
          type: 'arrayItem',
          childFields: [
            {
              type: 'text',
              questionId: 'array_item_text'
            },
            {
              type: 'array',
              questionId: 'array_nested',
              item: {
                type: 'arrayItem',
                childFields: [
                  {
                    type: 'text',
                    questionId: 'array_nested_item_text'
                  }
                ]
              }
            }
          ]
        }
      },
      array_item_text: {
        type: 'text',
        questionId: 'array_item_text'
      },
      array_nested: {
        type: 'array',
        questionId: 'array_nested',
        item: {
          type: 'arrayItem',
          childFields: [
            {
              type: 'text',
              questionId: 'array_nested_item_text'
            }
          ]
        }
      },
      array_nested_item_text: {
        type: 'text',
        questionId: 'array_nested_item_text'
      }
    });
  });
});

describe('getDefaultValues()', () => {
  const fields = [
    {
      questionId: 'text_id',
      defaultValue: 'some default',
      type: 'text',
      childFields: [
        {
          questionId: 'child_array_id',
          type: 'array',
          item: {
            type: 'arrayItem'
          }
        }
      ]
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
            defaultValue: 'another default'
          },
          {
            type: 'array',
            questionId: 'array_nested',
            item: {
              type: 'arrayItem',
              childFields: [
                {
                  type: 'text',
                  questionId: 'array_nested_item_text'
                }
              ]
            }
          }
        ]
      }
    }
  ];
  it('should properly calculate array default values', () => {
    const defaultValues = getDefaultValues({fields});
    expect(defaultValues).toEqual({
      array_id: [],
      child_array_id: [],
      text_id: 'some default'
    });
  });

  it('should properly calculate nested array default values', () => {
    const lookupTable = buildLookupTable({fields, customFieldTypes: exampleFieldTypes});

    const initialValues = {
      array_id: [
        {
          array_item_text: 'something'
        }
      ]
    };

    // console.log(JSON.stringify(defaultsDeep({}, initialValues)));
    const defaultValues = getDefaultValues({
      fields,
      lookupTable,
      initialValues
    });
    expect(defaultValues).toEqual({
      array_id: [
        {
          array_item_text: 'something',
          array_nested: []
        }
      ],
      child_array_id: [],
      text_id: 'some default'
    });
  });
});

describe('mergePaths()', () => {
  it('should properly filter out null and undefined paths', () => {
    const merged = mergePaths('one', null, 0, 1, 'three', undefined); // eslint-disable-line no-undefined
    expect(merged).toEqual('one.0.1.three');
  });
});
