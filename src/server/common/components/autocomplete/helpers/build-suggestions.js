const defaultSuggestion = {
  text: ' - - select - - ',
  disabled: true,
  attributes: { selected: true }
}

function buildSuggestions(items) {
  const suggestions = items.map((item) => {
    const { value, text, hint } = item
    return { value, text, hint }
  })

  suggestions.unshift(defaultSuggestion)

  return suggestions
}

export { buildSuggestions }
