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
            value: 'robo_cop'
          },
          {
            text: 'Roger Rabbit',
            value: 'roger_rabbit'
          },
          {
            text: 'Barbie',
            value: 'barbie'
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
            value: 'robo_cop',
            hint: 'User Id: 12454878'
          },
          {
            text: 'Roger Rabbit',
            value: 'roger_rabbit',
            hint: 'User Id: 556456465'
          },
          {
            text: 'Barbie',
            value: 'barbie',
            hint: 'User Id: 67567576'
          }
        ]
      }
    }
  ]
}
