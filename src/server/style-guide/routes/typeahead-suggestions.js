import { scopes } from '@defra/cdp-validation-kit'

export const typeaheadSuggestionsRoute = {
  options: {
    id: 'typeahead-suggestions',
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.admin, scopes.tenant]
      }
    }
  },
  handler: (request, h) => {
    const { user } = request.query

    return h.view('style-guide/views/typeahead-suggestions', {
      inputName: 'user',
      suggestionText: user,
      suggestions: [
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
    })
  }
}
