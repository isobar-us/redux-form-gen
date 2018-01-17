export default [
  {
    type: 'section',
    label: 'Default Field Types',
    childFields: [
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
      },
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
      },
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
  },
  {
    type: 'divider'
  },
  {
    type: 'section',
    label: 'Custom Field Types',
    childFields: [
      {
        type: 'static',
        label: 'Static Label',
        text: 'Static Text'
      },
      {
        type: 'dateUnknown',
        label: 'Date or Unknown Label',
        required: true,
        fields: {
          date: {
            type: 'date',
            questionId: 'du_date',
            label: 'Date'
          },
          unknown: {
            type: 'checkbox',
            questionId: 'du_unknown',
            label: 'Unknown'
          }
        }
      },
      {
        type: 'date',
        label: 'Date Label',
        questionId: 'date'
      }
    ]
  }
];
