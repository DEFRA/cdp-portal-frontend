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
      name: 'url',
      type: 'string',
      required: true,
      description: 'Url to render suggestions'
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
        url: './typeahead/suggestions'
      }
    }
  ]
}
