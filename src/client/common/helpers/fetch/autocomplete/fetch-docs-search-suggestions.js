async function fetchDocsSearchSuggestions(value) {
  const response = await fetch(
    `${location.origin}/documentation/search?q=${value}`,
    { headers: { 'X-Requested-With': 'XMLHttpRequest' } }
  )
  const json = await response.json()

  if (response?.ok) {
    return json.suggestions
  }

  throw new Error(json.message)
}

export { fetchDocsSearchSuggestions }
