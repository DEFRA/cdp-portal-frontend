import pickBy from 'lodash/pickBy.js'
import isNil from 'lodash/isNil.js'

const defaultSuggestion = {
  text: ' - - select - - ',
  disabled: true,
  attributes: { selected: true }
}

function buildSuggestions(items) {
  const suggestions = items.map((item) => {
    const { value, text, hint } = item
    return pickBy({ value, text, hint }, (value) => !isNil(value))
  })

  suggestions.unshift(defaultSuggestion)

  return suggestions
}

export { buildSuggestions }
