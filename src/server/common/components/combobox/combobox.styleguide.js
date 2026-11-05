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
      name: 'suggestions',
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
      title: 'User picker',
      params: {
        label: {
          text: 'By'
        },
        hint: {
          text: 'Choose a user'
        },
        id: 'user',
        name: 'user',
        suggestions: [
          {
            value: '',
            text: ' - - select - - ',
            disabled: true,
            attributes: { selected: true }
          },
          {
            text: 'RoboCop',
            value: 'RoboCop',
            helper: 'User Id: 12454878'
          },
          {
            text: 'Roger Rabbit',
            value: 'Roger Rabbit',
            helper: 'User Id: 556456465'
          },
          {
            text: 'Barbie',
            value: 'Barbie',
            helper: 'User Id: 67567576'
          }
        ]
      }
    }
  ]
}
