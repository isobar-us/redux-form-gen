export default [
  {
    type: 'section',
    label: 'Wizard Step 1',
    childFields: [
      {
        type: 'static',
        label: 'Static Label',
        text: 'Static Text'
      },
      {
        type: 'text',
        questionId: 'text',
        label: 'Text Label',
        required: true
      },
      {
        type: 'textarea',
        questionId: 'textarea',
        label: 'Textarea Label',
        required: true
      }
    ]
  },
  {
    type: 'section',
    label: 'Wizard Step 2',
    childFields: [
      {
        type: 'group',
        label: 'Group Label',
        childFields: [
          {
            type: 'radio',
            questionId: 'radio',
            label: 'Radio Label',
            required: true,
            options: [{label: 'Option 1', value: '1'}, {label: 'Option 2', value: '2'}, {label: 'Option 3', value: '3'}]
          },
          {
            type: 'select',
            questionId: 'select',
            label: 'Select Label',
            required: true,
            options: [{label: 'Option 1', value: 1}, {label: 'Option 2', value: 2}, {label: 'Option 3', value: 3}]
          }
        ]
      }
    ]
  },
  {
    type: 'section',
    label: 'Wizard Step 3',
    childFields: [
      {
        type: 'array',
        label: 'Array Label',
        questionId: 'array',
        addLabel: 'Add Label',
        item: {
          type: 'arrayItem',
          label: 'Item {index}',
          childFields: [
            {
              type: 'text',
              label: 'Text Label',
              questionId: 'text'
            }
          ]
        }
      }
    ]
  }
];
