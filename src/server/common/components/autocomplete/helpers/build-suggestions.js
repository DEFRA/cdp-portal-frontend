import pickBy from 'lodash/pickBy.js'
import isNil from 'lodash/isNil.js'

const defaultSuggestion = {
  text: ' - - select - - ',
  disabled: true,
  attributes: { selected: true }
}

function buildSuggestions(items) {
  const suggestions = items.map((item) => {
    const { value, text, hint, anchor } = item
    return pickBy({ value, text, hint, anchor }, (value) => !isNil(value))
  })

  suggestions.unshift(defaultSuggestion)

  return suggestions
}

export { buildSuggestions }
