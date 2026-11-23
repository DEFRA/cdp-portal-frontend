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
      title: 'Basic',
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
    },
    {
      title: 'With Hint',
      params: {
        label: {
          text: 'By'
        },
        hint: {
          text: 'Choose a user'
        },
        id: 'user-hint',
        name: 'user-hint',
        options: [
          {
            text: 'RoboCop',
            value: 'RoboCop',
            hint: 'User Id: 12454878'
          },
          {
            text: 'Roger Rabbit',
            value: 'Roger Rabbit',
            hint: 'User Id: 556456465'
          },
          {
            text: 'Barbie',
            value: 'Barbie',
            hint: 'User Id: 67567576'
          }
        ]
      }
    }
  ]
}
