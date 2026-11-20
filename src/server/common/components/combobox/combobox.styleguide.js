export const comboboxStyleguide = {
  name: 'combobox',
  title: 'Combobox',
  description: 'Combobox filtered picker',
  category: 'form',
  macro: {
    path: 'combobox/macro.njk',
    name: 'appCombobox'
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
      title: 'Web Component',
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
