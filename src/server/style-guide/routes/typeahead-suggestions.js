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
    const {
      user_text: user,
      'user-hint_text': userHint,
      'user-custom_text': userCustom,
      hint,
      custom
    } = request.query

    const suggestions = [
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
      .filter(({ text }) =>
        text
          .toLowerCase()
          .includes(
            hint
              ? userHint.toLowerCase()
              : custom
                ? userCustom.toLowerCase()
                : user.toLowerCase()
          )
      )
      .map((user) =>
        hint
          ? user
          : {
              text: user.text,
              value: user.value
            }
      )

    return h.view('style-guide/views/typeahead-suggestions', {
      inputName: hint ? 'user-hint' : custom ? 'user-custom' : 'user',
      value: hint ? userHint : custom ? userCustom : user,
      suggestionText: hint ? userHint : custom ? userCustom : user,
      suggestions,
      partial: custom
        ? 'style-guide/views/typeahead-suggestions-option.njk'
        : ''
    })
  }
}
