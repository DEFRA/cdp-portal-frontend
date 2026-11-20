export const typeaheadStyleguide = {
  name: 'typeahead',
  title: 'Typeahead',
  description: 'Typeahead filtered picker',
  category: 'form',
  macro: {
    path: 'typeahead/macro.njk',
    name: 'appTypeahead'
  },
  params: [
    {
      name: 'options',
      type: 'array',
      required: true,
      description: 'Options for the picker'
    },
    {
      name: 'classes',
      type: 'string',
      required: false,
      description: 'Additional CSS classes'
    }
  ],
  examples: [
    {
      title: 'Typeahead',
      params: {
        label: {
          text: 'By'
        },
        hint: {
          text: 'Choose a user'
        },
        id: 'user',
        name: 'user',
        options: [
          {
            text: 'RoboCop',
            value: 'RoboCop'
          },
          {
            text: 'Roger Rabbit',
            value: 'Roger Rabbit'
          },
          {
            text: 'Barbie',
            value: 'Barbie'
          }
        ]
      }
    }
  ]
}
